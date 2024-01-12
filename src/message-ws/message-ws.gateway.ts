import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io'
import { MessageWsService } from './message-ws.service';

@WebSocketGateway({ cors: true })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(private readonly messageWsService: MessageWsService) { }

  handleConnection(client: Socket) {
    this.messageWsService.registerClient(client);
    console.log(`Clients connected: ${this.messageWsService.getTotalClients()}`);
  }

  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id);
  }
}
