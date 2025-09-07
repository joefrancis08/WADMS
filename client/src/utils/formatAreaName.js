function formatAreaName(area) {
  if (!area) return "";

  // Take text before colon
  const base = area.split(":")[0].trim();  // "AREA I"

  // Split into two parts: "AREA" and "I"
  const [word, numeral] = base.split(" ");

  // Capitalize "Area", keep numeral as is
  return `${word.charAt(0)}${word.slice(1).toLowerCase()} ${numeral}`;
}

export default formatAreaName;