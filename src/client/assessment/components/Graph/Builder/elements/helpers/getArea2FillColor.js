const COLORS = [
  '#FFF8DC',
  '#FFE4C4',
  '#F5DEB3',
  '#D2B48C',
  '#F4A460',
  '#CD853F',
  '#8B4513',
  '#A52A2A',
]

export const getArea2FillColor = (index) => {
  const color = COLORS[index % COLORS.length]
  return {
    fillColor: color,
    highlightFillColor: color,
    fillOpacity: 0.5,
    highlightFillOpacity: 0.5,
    strokeColor: 'transparent',
    highlightStrokeColor: 'transparent',
  }
}
