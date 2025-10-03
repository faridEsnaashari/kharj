export function generateRandomNumber(length: number = 5): number {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateTimeRandomNumber(length: number = 5): number {
  const now = new Date();
  const seed = now.getTime();
  const r = Math.abs(Math.sin(seed)) * 10000;
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor((r + generateRandomNumber(1)) * (max - min + 1)) + min;
}
