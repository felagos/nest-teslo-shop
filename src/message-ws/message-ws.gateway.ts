import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { MessageWsService } from './message-ws.service';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  wss: Server;

  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization.split(' ')[1];
    let payload: JwtPayload = null

    try {
      payload = this.jwtService.verify(token, { secret: this.configService.get('JWT_SECRET') });
      await this.messageWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect(true);
      return;
    }

    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id);
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    const user = this.messageWsService.getUserBySocketId(client.id);
    client.emit('message-from-server', { fullName: user.fullName, message: payload.message });
    //client.broadcast.emit('message-from-server', { fullName: 'Server', message: payload.message });
    //this.wss.emit('message-from-server', { fullName: 'Server', message: payload.message });
  }

}
