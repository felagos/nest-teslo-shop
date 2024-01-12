import { connectServer } from './socket-client'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Websocket - Client</h1>
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

connectServer();