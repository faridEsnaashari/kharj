export function calculateUpdatedBalance(
  currentBalance: number,
  originalAmount: number,
  newAmount: number,
): number {
  const restoredBalance = currentBalance - originalAmount;
  return restoredBalance + newAmount;
}
