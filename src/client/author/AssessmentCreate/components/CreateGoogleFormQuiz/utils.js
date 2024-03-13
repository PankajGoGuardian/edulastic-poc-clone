/**
 * Formats an array of indexes with a specified prefix,
 * and adds "and" before the last number.
 * @param {number[]} numbers - The array of numbers to be formatted.
 * @param {string} prefix - The prefix to be added to each number.
 * @returns {string} The formatted string.
 */

export const formatIndexWithAnd = (numbers, prefix) => {
  const formattedNumbers = numbers.map((num) => prefix + num)
  if (formattedNumbers.length > 1) {
    const lastNumber = formattedNumbers.pop()
    return `${formattedNumbers.join(', ')} and ${lastNumber}`
  }
  if (formattedNumbers.length === 1) {
    return formattedNumbers[0]
  }

  return ''
}
