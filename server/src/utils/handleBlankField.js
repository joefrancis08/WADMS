// Handle Blank User Input
export function handleBlankUserInput(res, fullName, email, password) {
  if (!fullName || !email || !password) {
    res.status(400).json({ 
      message: "Full name, email, and password are required.", 
      success: false,
      isFieldBlank: true
    });
    return true;
  }
  return false;
}
