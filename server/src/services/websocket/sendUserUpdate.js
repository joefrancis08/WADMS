import { getWSS } from "../../config/ws.js";

const sendUserUpdate = () => {
  const wss = getWSS();
  if (wss) {
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({
          type: 'user-update',
          isUpdated: true
        }));
      }
    });
  }
}

export default sendUserUpdate;