// Handle Blank User Input
export function handleBlankUserInput(res, fullName, email, password) {
  if (!fullName || !email || !password) {
    res.status(400).json({ 
      message: "Blank field/s are required.", 
      success: false,
      isFieldBlank: true
    });
    return true;
  }
  return false;
}
