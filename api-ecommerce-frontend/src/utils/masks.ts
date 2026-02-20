export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function maskWhatsapp(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);

  if (!digits.length) return "";

  if (digits.length <= 2) return ddd;

  if (digits.length <= 10) {
    const part1 = rest.slice(0, 4);
    const part2 = rest.slice(4, 8);
    return `${ddd} ${part1}${part2 ? "-" + part2 : ""}`.trim();
  }

  const part1 = rest.slice(0, 5);
  const part2 = rest.slice(5, 9);
  return `${ddd} ${part1}${part2 ? "-" + part2 : ""}`.trim();
}