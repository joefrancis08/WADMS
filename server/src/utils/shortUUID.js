import { randomUUID } from 'crypto';

function uuidBase64() {
  const uuid = randomUUID().replace(/-/g, '');
  const buffer = Buffer.from(uuid, 'hex');
  return buffer.toString('base64url'); // 22 chars
}

export default uuidBase64;