import { Manager, Socket } from 'socket.io-client';

type ServerMessage = {
    fullName: string
    message: string
}

let socket: Socket;

export const connectServer = (jwtToken: string) => {
    const manager = new Manager('http://localhost:3000/socket.io/socket.io.js', {
        extraHeaders: {
            Authorization: `Bearer ${jwtToken}`
        }
    });

    socket?.removeAllListeners();

    socket = manager.socket('/');
    addListener(socket);
};

const addListener = (socket: Socket) => {
    const label = document.querySelector<HTMLSpanElement>('#server-status')!;
    const form = document.querySelector<HTMLFormElement>('#message-form')!;
    const input = document.querySelector<HTMLInputElement>('#message')!;
    const messages = document.querySelector<HTMLUListElement>('#messages')!;

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

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const messageValue = input.value.trim();
        if(messageValue === '') return;

        socket.emit('message-from-client', { id: Date.now(), message: messageValue });

        input.value = '';
    });

    socket.on('message-from-server', (payload: ServerMessage) => {
        const li = document.createElement('li');
        li.innerText = payload.fullName + ': ' + payload.message;
        messages.appendChild(li);
    });
}

