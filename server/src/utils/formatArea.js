function formatArea(text) {
  return text
    .toUpperCase()
    .replace(
      /(AREA\s+[IVX]+)\s*[-:]?\s*(.*)/,
      "$1: $2"
    );
}

export default formatArea;
