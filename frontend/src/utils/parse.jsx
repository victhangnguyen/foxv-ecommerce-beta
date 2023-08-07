export function parseIntlNumber(num, local = "vi-VN") {
  const numberFormatter = Intl.NumberFormat(local);
  const formatted = numberFormatter.format(num);
  return formatted;
}

export function getMinutesFromNowToTimestamp(timestamp) {
  const currentTime = new Date();
  const targetTime = new Date(timestamp);
  const timeDifference = currentTime - targetTime;
  const minutes = Math.floor(timeDifference / (1000 * 60)); // 1 phút = 60.000 milliseconds
  return minutes;
}
