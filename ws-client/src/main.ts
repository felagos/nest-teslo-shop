import { connectServer } from './socket-client'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Websocket - Client</h1>
    <input type='text' id='jwtToken' placeholder='Web Token' />
    <button type='button' id='btn-connect'>Connect</button>

    <br/>

    <span id='server-status'>Offline</span>
    <ul id='client-list'></ul>
    <form id='message-form'>
      <input type='text' id='message' />
      <button type='submit'>Send</button>
    </form>

    <h3>Messages</h3>
    <ul id='messages'></ul>

  </div>
`

const jwtToken = document.querySelector<HTMLInputElement>('#jwtToken')!;
const btnConnect = document.querySelector<HTMLButtonElement>('#btn-connect')!;

btnConnect.addEventListener('click', () => {
    const token = jwtToken.value.trim();
    if(token === '') return;

    connectServer(token);
});