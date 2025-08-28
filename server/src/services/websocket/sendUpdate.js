import { getWSS } from "../../config/ws.js";

const sendUpdate = (type) => {
  const wss = getWSS();
  if (wss) {
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({
          type,
          isUpdated: true
        }));
      }
    });
  }
}

export default sendUpdate;