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

const colorBandsByLength = {
  2: ['#90DE85', '#E55C5C'],
  3: ['#90DE85', '#E9DC6B', '#E55C5C'],
  4: ['#5FAD5A', '#90DE85', '#E9DC6B', '#E55C5C'],
  5: ['#5FAD5A', '#90DE85', '#E9DC6B', '#E69736', '#E55C5C'],
  6: ['#5FAD5A', '#90DE85', '#E9DC6B', '#F59D7C', '#E69736', '#E55C5C'],
  7: [
    '#5FAD5A',
    '#90DE85',
    '#E9DC6B',
    '#ADA439',
    '#F59D7C',
    '#E69736',
    '#E55C5C',
  ],
  8: [
    '#5FAD5A',
    '#90DE85',
    '#A8C2E6',
    '#E9DC6B',
    '#ADA439',
    '#F59D7C',
    '#E69736',
    '#E55C5C',
  ],
  9: [
    '#5FAD5A',
    '#90DE85',
    '#798CCE',
    '#A8C2E6',
    '#E9DC6B',
    '#ADA439',
    '#F59D7C',
    '#E69736',
    '#E55C5C',
  ],
  10: [
    '#5FAD5A',
    '#90DE85',
    '#CE7BC1',
    '#798CCE',
    '#A8C2E6',
    '#E9DC6B',
    '#ADA439',
    '#F59D7C',
    '#E69736',
    '#E55C5C',
  ],
}

const getColorsByInterpolation = (num) => {
  const [fromColor, toColor] = [
    [116, 34, 52], // hsl -> #5FAD5A
    [0, 72, 63], // hsl -> #E55C5C
  ]
  const [h0, s0, l0] = fromColor
  const [hn, sn, ln] = toColor

  const colors = Array(num)
    .fill()
    .map((_, i) => [
      h0 + (i * (hn - h0)) / (num - 1),
      s0 + (i * (sn - s0)) / (num - 1),
      l0 + (i * (ln - l0)) / (num - 1),
    ])
  return colors.map(([h, s, l]) => `hsl(${h}deg ${s}% ${l}%)`)
}

const getColorBandBySize = (length) => {
  if (length in colorBandsByLength) return [...colorBandsByLength[length]]

  if (length > bandColorsNew.length) return getColorsByInterpolation(length)
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
  getColorBandBySize,
}
