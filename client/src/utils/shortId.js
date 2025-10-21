function shortId(len = 8) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const out = [];
  while (out.length < len) {
    const b = crypto.getRandomValues(new Uint8Array(1))[0];
    // 62 * 4 = 248 → use 0–247 to avoid modulo bias
    if (b < 248) out.push(alphabet[b % 62]);
  }
  return out.join('');
}

export default shortId;
