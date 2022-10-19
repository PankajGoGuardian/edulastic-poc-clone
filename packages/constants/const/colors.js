const bandColors = [
  '#576BA9',
  '#A1C3EA',
  '#F39300',
  '#FEC571',
  '#3DB04E',
  '#74E27A',
  '#AFA515',
  '#EBDD54',
  '#b22222',
  '#7c0a02',
  '#db75c5',
]

// NOTE: band with updated colors introduced for better display of foreground text
// TODO: replace bandColors with bandColorsNew along with patch
const bandColorsNew = [
  '#798cce',
  '#a8c2e6',
  '#5fad5a',
  '#90de85',
  '#e9dc6b',
  '#ada439',
  '#e69736',
  '#f59d7c',
  '#e55c5c',
  '#ce7bc1',
]

/**
 * derived from `bandColorsNew` by calling `[2,3,4,5,6,7,8,9,10].map(createColorBand)`
 *
 * TODO update colors after input from PM
 */
const colorBandsByLength = {
  2: ['#5fad5a', '#e55c5c'],
  3: ['#5fad5a', '#ada439', '#e55c5c'],
  4: ['#5fad5a', '#e9dc6b', '#e69736', '#e55c5c'],
  5: ['#5fad5a', '#e9dc6b', '#ada439', '#f59d7c', '#e55c5c'],
  6: ['#5fad5a', '#90de85', '#e9dc6b', '#e69736', '#f59d7c', '#e55c5c'],
  7: [
    '#5fad5a',
    '#90de85',
    '#e9dc6b',
    '#ada439',
    '#e69736',
    '#f59d7c',
    '#e55c5c',
  ],
  8: [
    '#798cce',
    '#a8c2e6',
    '#90de85',
    '#e9dc6b',
    '#ada439',
    '#e69736',
    '#e55c5c',
    '#ce7bc1',
  ],
  9: [
    '#798cce',
    '#a8c2e6',
    '#5fad5a',
    '#90de85',
    '#ada439',
    '#e69736',
    '#f59d7c',
    '#e55c5c',
    '#ce7bc1',
  ],
  10: [
    '#798cce',
    '#a8c2e6',
    '#5fad5a',
    '#90de85',
    '#e9dc6b',
    '#ada439',
    '#e69736',
    '#f59d7c',
    '#e55c5c',
    '#ce7bc1',
  ],
}

const createColorBand = (length) => {
  if (length in colorBandsByLength) return [...colorBandsByLength[length]]

  if (length > bandColorsNew.length) throw new Error('Color not available')
  const [start, end] =
    length > bandColorsNew.length - 3
      ? [0, bandColorsNew.length - 1]
      : [2, bandColorsNew.length - 2]
  const colorBand = new Array(length).fill().map((_, i) => {
    const idx = Math.round(start + (i * (end - start)) / (length - 1))
    return bandColorsNew[idx]
  })

  colorBandsByLength[length] = colorBand
  return [...colorBand]
}

module.exports = {
  performanceBandColors: bandColors,
  externalPerformanceBandColors: bandColorsNew,
  standardProficiencyColors: bandColors,
  createColorBand,
}
