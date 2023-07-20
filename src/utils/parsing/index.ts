export const sanitizeDecimalString = (text: string) =>
  text
    // Remove all non-decimal/numeric characters
    .replace(/[^0-9.]/g, '')
    // Remove redundant leading zeroes
    .replace(/^0+(?=\d)/, '')
    // Remove all decimal points except the first
    .replace(/^([^.]*\.)(.*)$/, (a, b, c) => b + c.replace(/\./g, ''))
    // If string ends with a decimal, append a zero
    .replace(/\.$/, '.0');
