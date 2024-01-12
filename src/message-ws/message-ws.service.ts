import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConnectedClient {
    [id: string]: Socket;
}

@Injectable()
export class MessageWsService {

    private connectedClients: ConnectedClient = {};

    registerClient(client: Socket) {
        this.connectedClients[client.id] = client;
    }

    removeClient(clientId: string) {
        delete this.connectedClients[clientId];
    }

    getTotalClients() {
        return Object.keys(this.connectedClients).length;
    }

}
