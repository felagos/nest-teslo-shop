import { Manager, Socket } from 'socket.io-client';

export const connectServer = () => {
    const manager = new Manager('http://localhost:3000/socket.io/socket.io.js');
    const socket = manager.socket('/');
};

const addListener = (socket: Socket) => {
    const label = document.querySelector<HTMLSpanElement>('#server-status')!;

    socket.on('connect', () => {
        label.innerText = 'Online';
    });

    socket.on('disconnected', () => {
        label.innerText = 'Offline';
    });

    socket.on('clients-updated', (clients: string[]) => {
        const list = document.querySelector<HTMLSpanElement>('#client-list')!;

        clients.forEach(client => {
            const li = document.createElement('li');
            li.innerText = client;
            list.appendChild(li);
        })

    });


}