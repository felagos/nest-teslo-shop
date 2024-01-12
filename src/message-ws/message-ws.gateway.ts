import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { MessageWsService } from './message-ws.service';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: true })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  wss: Server;

  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService,
    ) { }

  handleConnection(client: Socket) {
    this.messageWsService.registerClient(client);
    console.log(`Clients connected: ${this.messageWsService.getTotalClients()}`);

    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients());
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
