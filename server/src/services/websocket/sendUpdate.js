import { getWSS } from "../../config/ws.js";

const sendUpdate = (type, payload = {}) => {
  const wss = getWSS();
  if (wss) {
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({
          type,
          isUpdated: true,
          data: Object.keys(payload).length > 0 && payload
        }));
      }
    });
  }
}

export default sendUpdate;