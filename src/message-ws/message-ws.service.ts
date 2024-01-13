import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

interface ConnectedClient {
    [id: string]: {
        socket: Socket,
        user: User
    };
}

@Injectable()
export class MessageWsService {

    private connectedClients: ConnectedClient = {};

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>) { }

    async registerClient(client: Socket, userId: string) {
        const user = await this.userRepository.findOneBy({ id: userId });

        if(!user) throw new Error('User not found');
        if(!user.isActive) throw new Error('User is not active');

        this.disconnectClient(user.id);

        this.connectedClients[client.id] = {
            socket: client,
            user
        };
    }

    removeClient(clientId: string) {
        delete this.connectedClients[clientId];
    }

    getConnectedClients() {
        return Object.keys(this.connectedClients);
    }

    getTotalClients() {
        return Object.keys(this.connectedClients).length;
    }

    getUserBySocketId(socketId: string) {
        const client = this.connectedClients[socketId];
        
        if(!client) return null;
        
        return client.user;
    }

    private disconnectClient(userId: string) {
        const clientIds = Object.values(this.connectedClients);
        const clientKeys = Object.keys(this.connectedClients);

        const client = clientIds.find(client => client.user.id === userId);
        
        if(!client) return;

        client.socket.disconnect();
    }

}
