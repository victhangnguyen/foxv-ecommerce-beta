export function parseIntlNumber(num, local = 'vi-VN') {
  const numberFormatter = Intl.NumberFormat(local);
  const formatted = numberFormatter.format(num);
  return formatted;
}
