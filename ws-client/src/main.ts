import { connectServer } from './socket-client'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Websocket - Client</h1>
    <span id='server-status'>Offline</span>
    <ul id='client-list'></ul>
  </div>
`

connectServer();