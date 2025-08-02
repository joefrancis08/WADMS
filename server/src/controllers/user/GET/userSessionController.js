// Get session info
export const userSessionController = (req, res) => {
  if (req.session.user) {
    return res.json({ user: req.session.user });
  } else {
    return res.status(401).json({ message: 'Not authenticated' });
  }
}