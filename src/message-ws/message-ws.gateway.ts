import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { MessageWsService } from './message-ws.service';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ cors: true })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  wss: Server;

  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization.split(' ')[1];
    let payload = null

    try {
      payload = this.jwtService.verify(token, { secret: this.configService.get('JWT_SECRET') });
      this.wss.emit('clients-updated', this.messageWsService.getConnectedClients());
    } catch (error) {
      client.disconnect(true);
      return;
    }

    this.messageWsService.registerClient(client);
    console.log(`Clients connected: ${this.messageWsService.getTotalClients()}`);
  }

  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id);
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    client.emit('message-from-server', { fullName: 'Server', message: payload.message });
    //client.broadcast.emit('message-from-server', { fullName: 'Server', message: payload.message });
    //this.wss.emit('message-from-server', { fullName: 'Server', message: payload.message });
  }

}
