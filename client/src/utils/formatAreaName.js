// Helper to convert Arabic numbers to Roman numerals (1-20)
function toRoman(num) {
  const roman = ["","I","II","III","IV","V","VI","VII","VIII","IX","X",
                 "XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX"];
  return roman[num] || num; // fallback to original if out of range
}

function formatAreaName(area) {
  if (!area) return "";

  // Replace dash with colon
  area = area.replace("-", ":");

  // Take text before colon
  const base = area.split(":")[0].trim(); // e.g., "AREA 2" or "AREA II"

  // Split into two parts: word and numeral
  const [word, numeralRaw] = base.split(" ");

  // Convert numeral to Roman if it's a number
  const numeral = /^\d+$/.test(numeralRaw) ? toRoman(parseInt(numeralRaw, 10)) : numeralRaw;

  // Capitalize word properly
  const formattedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

  return `${formattedWord} ${numeral}`;
}

export default formatAreaName;
