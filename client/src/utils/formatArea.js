// Roman numerals 1–20
const romanMap = [
  '', 'I', 'II', 'III', 'IV',
  'V', 'VI', 'VII', 'VIII', 'IX',
  'X', 'XI', 'XII', 'XIII', 'XIV',
  'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'
];

function toRoman(num) {
  return num >= 1 && num <= 20 ? romanMap[num] : num;
}

function formatArea(str) {
  if (!str) return "";

  const text = str.trim().toUpperCase();

  // Match: AREA <number or roman> [optional dash/colon/spaces] <rest>
  const match = text.match(/^AREA\s+(\d+|[IVXLCDM]+)\s*[-:]?\s*(.*)$/);

  if (match) {
    let areaPart = match[1]; // number or roman numeral
    let rest = match[2] || "";

    // If it's a number, convert to Roman
    if (/^\d+$/.test(areaPart)) {
      areaPart = toRoman(parseInt(areaPart, 10));
    }

    // Return consistent format
    return `AREA ${areaPart}${rest ? ": " + rest : ":"}`;
  }

  // Fallback: just uppercase whole string
  return text;
}

export default formatArea;
