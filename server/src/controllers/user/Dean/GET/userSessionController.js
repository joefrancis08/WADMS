// Get session info
export const userSessionController = (req, res) => {
  if (req.session.user) {
    return res.status(200).json({ user: req.session.user });
  } else {
    return res.status(200).json({ emptySession: true });
  }
};