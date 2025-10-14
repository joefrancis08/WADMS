const generateToken = (length = 32) => {
  const randomBytes = crypto.getRandomValues(new Uint8Array(length));
  return btoa(String.fromCharCode(...randomBytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

export default generateToken;