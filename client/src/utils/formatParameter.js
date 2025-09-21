function formatParameter(text) {
  if (!text) return { label: '', content: '' };

  // Split only once at the first space
  const [labelWithDot, ...rest] = text.split(' ');

  // Remove dot from label (e.g., 'A.' -> 'A')
  const label = labelWithDot.replace('.', '');

  // Join the rest back together
  const content = rest.join(' ');

  return { label: label, content: content };
}

export default formatParameter;
