export const logoutUserController = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({
        message: 'Logout failed. Could not destroy session.',
        success: false,
      });
    }

    res.clearCookie(process.env.SESSION_KEY);
    return res.status(200).json({
      message: 'Logged out successfully.',
      success: true,
    });
  });
};