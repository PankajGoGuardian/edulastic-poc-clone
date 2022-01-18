const standard = {
  keypad: true,
  graphpaper: true,
  expressions: true,
  settingsMenu: true,
  zoomButtons: true,
  expressionsTopbar: true,
  pointsOfInterest: true,
  trace: true,
  border: true,
  lockViewport: false,
  expressionsCollapsed: false,
  capExpressionSize: false,
  administerSecretFolders: false,
  images: true,
  folders: true,
  notes: true,
  links: true,
  qwertyKeyboard: true,
  restrictedFunctions: false,
  pasteGraphLink: false,
  pasteTableData: true,
  clearIntoDegreeMode: false,
  autosize: true,
  plotSingleVariableImplicitEquations: true,
  projectorMode: false,
  decimalToFraction: true,
  invertedColors: false,
  degreeMode: true,
  showGrid: true,
  polarMode: false,
  showXAxis: true,
  showYAxis: true,
  xAxisNumbers: true,
  yAxisNumbers: true,
  polarNumbers: true,
}

const stateConfig = {
  alabama: {
    ...standard,
  },
  arizona: {
    ...standard,
    images: true,
    folders: true,
    notes: true,
    qwertyKeyboard: true,
    degreeMode: false,
    decimalToFraction: true,
  },
  california: {
    ...standard,
    images: true,
    folders: true,
    notes: true,
    qwertyKeyboard: true,
    degreeMode: false,
    decimalToFraction: true,
  },
  connecticut: { ...standard },
  delaware: {
    ...standard,
    images: true,
    folders: true,
    notes: true,
    qwertyKeyboard: true,
    degreeMode: false,
    decimalToFraction: true,
  },
  florida: {
    ...standard,
  },
  georgia: {
    ...standard,
    images: true,
    folders: true,
    notes: true,
    qwertyKeyboard: true,
    degreeMode: false,
  },
  hawaii: {
    ...standard,
    images: true,
    folders: true,
    zoomButtons: true,
    qwertyKeyboard: true,
    degreeMode: false,
    decimalToFraction: true,
  },
  idaho: {
    ...standard,
    images: true,
    folders: true,
    notes: true,
    zoomButtons: true,
    qwertyKeyboard: true,
    degreeMode: false,
    decimalToFraction: true,
  },
  indiana: {
    ...standard,
    images: true,
    folders: true,
    zoomButtons: true,
    qwertyKeyboard: true,
    degreeMode: false,
    decimalToFraction: true,
  },
  iowa: {
    ...standard,
  },
  kentucky: {
    ...standard,
    images: true,
    folders: true,
    notes: true,
    degreeMode: false,
  },
  louisiana: {
    ...standard,
    images: true,
    folders: true,
    notes: true,
    degreeMode: false,
  },
  maryland: {
    ...standard,
    images: true,
    folders: true,
    notes: true,
    degreeMode: false,
  },
  massachusetts: {
    ...standard,
    images: true,
    folders: true,
    notes: true,
    degreeMode: false,
  },
  michigan: {
    ...standard,
  },
  mississippi: {
    ...standard,
    images: true,
    folders: true,
    notes: true,
    degreeMode: false,
    decimalToFraction: true,
  },
  missouri: {
    ...standard,

    images: true,
    folders: true,
    notes: true,
    degreeMode: false,
    qwertyKeyboard: true,
  },
  montana: {
    ...standard,

    images: true,
    folders: true,
    notes: true,
    zoomButtons: true,
    degreeMode: false,
    qwertyKeyboard: true,
    decimalToFraction: true,
  },
  nebraska: {
    ...standard,
  },
  nevada: {
    ...standard,
  },
  new_hampshire: {
    ...standard,
    images: true,
    folders: true,
    notes: true,
    degreeMode: false,
    decimalToFraction: true,
  },
  new_york: {
    ...standard,
    images: true,
    folders: true,
    notes: true,
    degreeMode: false,
    qwertyKeyboard: true,
    decimalToFraction: true,
  },
  north_carolina: {
    ...standard,
    images: true,
    folders: true,
    notes: true,
    degreeMode: false,
    qwertyKeyboard: true,
  },
  north_dakota: {
    ...standard,
  },
  ohio: {
    ...standard,
    images: true,
    folders: true,
    notes: true,
    zoomButtons: true,
    qwertyKeyboard: true,
    degreeMode: false,
    decimalToFraction: true,
  },
  oregon: {
    ...standard,
    images: true,
    folders: true,
    notes: true,
    degreeMode: false,
    qwertyKeyboard: true,
    decimalToFraction: true,
  },
  rhode_island: {
    ...standard,
    images: true,
    folders: true,
    notes: true,
    degreeMode: false,
    qwertyKeyboard: true,
    decimalToFraction: true,
  },
  south_dakota: {
    ...standard,
    images: true,
    folders: true,
    notes: true,
    degreeMode: false,
    qwertyKeyboard: true,
    decimalToFraction: true,
  },
  texas: {
    ...standard,
    images: true,
    folders: true,
    notes: true,
    Slider: true,
    // 'Implicit Plotting': true,
    // 'Inequality Plotting': true,
  },
  utah: {
    ...standard,
    images: true,
    folders: true,
    notes: true,
    degreeMode: false,
  },
  vermont: {
    ...standard,
    images: true,
    folders: true,
    notes: true,
    zoomButtons: true,
    degreeMode: false,
    qwertyKeyboard: true,
    decimalToFraction: true,
  },
  virginia: {
    ...standard,
    images: true,
    folders: true,
    notes: true,
    degreeMode: false,
  },
  washington: {
    ...standard,
    images: true,
    folders: true,
    notes: true,
    zoomButtons: true,
    degreeMode: false,
    qwertyKeyboard: true,
    decimalToFraction: true,
  },
  west_virginia: {
    ...standard,
    images: true,
    folders: true,
    notes: true,
    degreeMode: false,
  },
  wyoming: {
    ...standard,
    images: true,
    folders: true,
    notes: true,
    qwertyKeyboard: true,
    degreeMode: false,
    decimalToFraction: true,
  },
  virgin_islands: {
    ...standard,
    images: true,
    folders: true,
    notes: true,
    zoomButtons: true,
    qwertyKeyboard: true,
    degreeMode: false,
    decimalToFraction: true,
  },
}

export const isValidDesmosState = (state = '') => {
  const allStates = Object.keys(stateConfig)
  return allStates.includes(state.toLowerCase().replace(/\s+/g, '_'))
}

export const getDesmosConfig = (state = '') => {
  if (!state) {
    return standard
  }
  const stateKey = state.toLowerCase().replace(/\s+/g, '_')
  return stateConfig[stateKey] || standard
}