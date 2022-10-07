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
  '#a1c3ea',
  '#f39300',
  '#fec571',
  '#3db04e',
  '#74e27a',
  '#afa515',
  '#ebdd54',
  '#f59d7c',
  '#e55c5c',
  '#db75c5',
]

const threeBandColors = ['#74e27a', '#ebdd54', '#e55c5c']

const fiveBandColors = ['#a1c3ea', '#fec571', '#74e27a', '#ebdd54', '#e55c5c']

module.exports = {
  performanceBandColors: bandColors,
  externalPerformanceBandColors: bandColorsNew,
  standardProficiencyColors: bandColors,
  threeBandColors,
  fiveBandColors,
}
