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
    images: false,
    folders: false,
    notes: false,
    qwertyKeyboard: false,
    degreeMode: true,
    decimalToFraction: false,
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
    // "Advanced Dist Functions": false
  },
  california: {
    ...standard,
    images: false,
    folders: false,
    notes: false,
    zoomFit: false,
    qwertyKeyboard: false,
    degreeMode: true,
    decimalToFraction: false,
    plotInequalities: false,
    plotImplicits: false,
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
    // "Advanced Dist Functions": false
  },
  connecticut: { ...standard },
  delaware: {
    ...standard,
    images: false,
    folders: false,
    notes: false,
    zoomFit: false,
    qwertyKeyboard: false,
    degreeMode: true,
    decimalToFraction: false,
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
    // "Advanced Dist Functions": false
  },
  florida: {
    ...standard,
  },
  georgia: {
    ...standard,
    images: false,
    folders: false,
    notes: false,
    qwertyKeyboard: false,
    degreeMode: true,
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
    // "Advanced Dist Functions": false
  },
  hawaii: {
    ...standard,
    images: false,
    folders: false,
    notes: false,
    zoomFit: false,
    qwertyKeyboard: false,
    degreeMode: true,
    decimalToFraction: false,
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
    // "Advanced Dist Functions": false
  },
  idaho: {
    ...standard,
    images: false,
    folders: false,
    notes: false,
    zoomFit: false,
    qwertyKeyboard: false,
    degreeMode: true,
    decimalToFraction: false,
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
    // "Advanced Dist Functions": false
  },
  indiana: {
    ...standard,
    images: false,
    folders: false,
    notes: false,
    zoomFit: false,
    qwertyKeyboard: false,
    degreeMode: true,
    decimalToFraction: false,
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
    // "Advanced Dist Functions": false
  },
  iowa: {
    ...standard,
  },
  kentucky: {
    ...standard,
    images: false,
    folders: false,
    notes: false,
    degreeMode: true,
    forceEnableGeometryFunctions: true,
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
  },
  louisiana: {
    ...standard,
    images: false,
    folders: false,
    notes: false,
    qwertyKeyboard: false,
    degreeMode: true,
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
    // "Advanced Dist Functions": false
  },
  maryland: {
    ...standard,
    images: false,
    folders: false,
    notes: false,
    degreeMode: true,
    forceEnableGeometryFunctions: true,
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
  },
  massachusetts: {
    ...standard,
    images: false,
    folders: false,
    notes: false,
    degreeMode: true,
    forceEnableGeometryFunctions: true,
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
  },
  michigan: {
    ...standard,
  },
  mississippi: {
    ...standard,
    images: false,
    folders: false,
    notes: false,
    qwertyKeyboard: false,
    degreeMode: true,
    decimalToFraction: false,
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
    // "Advanced Dist Functions": false
  },
  missouri: {
    ...standard,
    images: false,
    folders: false,
    notes: false,
    qwertyKeyboard: false,
    degreeMode: true,
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
  },
  montana: {
    ...standard,
    images: false,
    folders: false,
    notes: false,
    zoomFit: false,
    qwertyKeyboard: false,
    degreeMode: true,
    decimalToFraction: false,
  },
  nebraska: {
    ...standard,
  },
  nevada: {
    ...standard,
  },
  new_hampshire: {
    ...standard,
    images: false,
    folders: false,
    notes: false,
    qwertyKeyboard: false,
    degreeMode: true,
    decimalToFraction: false,
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
    // "Advanced Dist Functions": false
  },
  new_york: {
    ...standard,
    images: false,
    folders: false,
    notes: false,
    qwertyKeyboard: false,
    degreeMode: true,
    forceEnableGeometryFunctions: false,
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
  },
  north_carolina: {
    ...standard,
    images: false,
    folders: false,
    notes: false,
    qwertyKeyboard: false,
    degreeMode: true,
    plotSingleVariableImplicitEquations: false,
    forceLogModeRegressions: true,
    forceEnableGeometryFunctions: false,
    // Actions: false
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
  },
  north_dakota: {
    ...standard,
  },
  ohio: {
    ...standard,
    images: false,
    folders: false,
    notes: false,
    qwertyKeyboard: false,
    degreeMode: true,
    decimalToFraction: false,
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
    // "Advanced Dist Functions": false
  },
  oregon: {
    ...standard,
    images: false,
    folders: false,
    notes: false,
    zoomFit: false,
    qwertyKeyboard: false,
    degreeMode: true,
    decimalToFraction: false,
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
    // "Advanced Dist Functions": false
  },
  pennsylvania: {
    images: false,
    folders: false,
    notes: false,
    plotImplicits: false,
    plotSingleVariableImplicitEquations: false,
    forceEnableGeometryFunctions: false,
    sliders: false,
    // Actions: false
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
  },
  rhode_island: {
    ...standard,
    images: false,
    folders: false,
    notes: false,
    qwertyKeyboard: false,
    degreeMode: true,
    decimalToFraction: false,
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
    // "Advanced Dist Functions": false,
    forceEnableGeometryFunctions: true,
  },
  south_carolina: {
    ...standard,
    sliders: false,
    decimalToFraction: true,
  },
  south_dakota: {
    ...standard,
    images: false,
    folders: false,
    notes: false,
    zoomFit: false,
    qwertyKeyboard: false,
    degreeMode: true,
    decimalToFraction: false,
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
    // "Advanced Dist Functions": false,
  },
  texas: {
    ...standard,
    images: false,
    folders: false,
    notes: false,
    zoomFit: false,
    sliders: false,
    plotInequalities: false,
    plotImplicits: false,
    forceEnableGeometryFunctions: false,
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
  },
  utah: {
    ...standard,
    images: false,
    folders: false,
    notes: false,
    degreeMode: true,
    forceEnableGeometryFunctions: true,
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
  },
  vermont: {
    ...standard,
    images: false,
    folders: false,
    notes: false,
    zoomFit: false,
    qwertyKeyboard: false,
    degreeMode: true,
    decimalToFraction: false,
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
    // "Advanced Dist Functions": false,
  },
  virginia: {
    ...standard,
    images: false,
    folders: false,
    notes: false,
    degreeMode: true,
    plotSingleVariableImplicitEquations: false,
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
    // audio: false,
  },
  washington: {
    ...standard,
    images: false,
    folders: false,
    notes: false,
    zoomFit: false,
    qwertyKeyboard: false,
    degreeMode: true,
    decimalToFraction: false,
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
    // "Advanced Dist Functions": false,
  },
  west_virginia: {
    ...standard,
    images: false,
    folders: false,
    notes: false,
    zoomFit: false,
    degreeMode: true,
    forceEnableGeometryFunctions: false,
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
    // "Advanced Dist Functions": false,
  },
  wyoming: {
    ...standard,
    images: false,
    folders: false,
    notes: false,
    qwertyKeyboard: false,
    degreeMode: true,
    decimalToFraction: false,
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
    // "Advanced Dist Functions": false,
  },
  virgin_islands: {
    ...standard,
    images: false,
    folders: false,
    notes: false,
    zoomFit: false,
    qwertyKeyboard: false,
    degreeMode: true,
    decimalToFraction: false,
    // "Advanced Trig Functions": false,
    // "Advanced Stats Functions": false,
    // "Advanced Dist Functions": false,
  },
}

const allStates = [
  {
    key: 'alabama',
    name: 'Alabama',
    abbreviation: 'AL',
    t_abbreviation: 'Ala.',
  },
  {
    key: 'alaska',
    name: 'Alaska',
    abbreviation: 'AK',
    t_abbreviation: 'Alaska',
  },
  {
    key: 'arizona',
    name: 'Arizona',
    abbreviation: 'AZ',
    t_abbreviation: 'Ariz.',
  },
  {
    key: 'arkansas',
    name: 'Arkansas',
    abbreviation: 'AR',
    t_abbreviation: 'Ark.',
  },
  {
    key: 'california',
    name: 'California',
    abbreviation: 'CA',
    t_abbreviation: 'Calif.',
  },
  {
    key: 'colorado',
    name: 'Colorado',
    abbreviation: 'CO',
    t_abbreviation: 'Colo.',
  },
  {
    key: 'connecticut',
    name: 'Connecticut',
    abbreviation: 'CT',
    t_abbreviation: 'Conn.',
  },
  {
    key: 'delaware',
    name: 'Delaware',
    abbreviation: 'DE',
    t_abbreviation: 'Del.',
  },
  {
    key: 'florida',
    name: 'Florida',
    abbreviation: 'FL',
    t_abbreviation: 'Fla.',
  },
  {
    key: 'georgia',
    name: 'Georgia',
    abbreviation: 'GA',
    t_abbreviation: 'Ga.',
  },
  {
    key: 'hawaii',
    name: 'Hawaii',
    abbreviation: 'HI',
    t_abbreviation: 'Hawaii',
  },
  {
    key: 'idaho',
    name: 'Idaho',
    abbreviation: 'ID',
    t_abbreviation: 'Idaho',
  },
  {
    key: 'illinois',
    name: 'Illinois',
    abbreviation: 'IL',
    t_abbreviation: 'Ill.',
  },
  {
    key: 'indiana',
    name: 'Indiana',
    abbreviation: 'IN',
    t_abbreviation: 'Ind.',
  },
  {
    key: 'iowa',
    name: 'Iowa',
    abbreviation: 'IA',
    t_abbreviation: 'Iowa',
  },
  {
    key: 'kansas',
    name: 'Kansas',
    abbreviation: 'KS',
    t_abbreviation: 'Kans.',
  },
  {
    key: 'kentucky',
    name: 'Kentucky',
    abbreviation: 'KY',
    t_abbreviation: 'Ky.',
  },
  {
    key: 'louisiana',
    name: 'Louisiana',
    abbreviation: 'LA',
    t_abbreviation: 'La.',
  },
  {
    key: 'maine',
    name: 'Maine',
    abbreviation: 'ME',
    t_abbreviation: 'Maine',
  },
  {
    key: 'maryland',
    name: 'Maryland',
    abbreviation: 'MD',
    t_abbreviation: 'Md.',
  },
  {
    key: 'massachusetts',
    name: 'Massachusetts',
    abbreviation: 'MA',
    t_abbreviation: 'Mass.',
  },
  {
    key: 'michigan',
    name: 'Michigan',
    abbreviation: 'MI',
    t_abbreviation: 'Mich.',
  },
  {
    key: 'minnesota',
    name: 'Minnesota',
    abbreviation: 'MN',
    t_abbreviation: 'Minn.',
  },
  {
    key: 'mississippi',
    name: 'Mississippi',
    abbreviation: 'MS',
    t_abbreviation: 'Miss.',
  },
  {
    key: 'missouri',
    name: 'Missouri',
    abbreviation: 'MO',
    t_abbreviation: 'Mo.',
  },
  {
    key: 'montana',
    name: 'Montana',
    abbreviation: 'MT',
    t_abbreviation: 'Mont.',
  },
  {
    key: 'nebraska',
    name: 'Nebraska',
    abbreviation: 'NE',
    t_abbreviation: 'Neb. or Nebr.',
  },
  {
    key: 'nevada',
    name: 'Nevada',
    abbreviation: 'NV',
    t_abbreviation: 'Nev.',
  },
  {
    key: 'new_hampshire',
    name: 'New Hampshire',
    abbreviation: 'NH',
    t_abbreviation: 'N.H.',
  },
  {
    key: 'new_jersey',
    name: 'New Jersey',
    abbreviation: 'NJ',
    t_abbreviation: 'N.J.',
  },
  {
    key: 'new_mexico',
    name: 'New Mexico',
    abbreviation: 'NM',
    t_abbreviation: 'N.Mex.',
  },
  {
    key: 'new_york',
    name: 'New York',
    abbreviation: 'NY',
    t_abbreviation: 'N.Y.',
  },
  {
    key: 'north_carolina',
    name: 'North Carolina',
    abbreviation: 'NC',
    t_abbreviation: 'N.C.',
  },
  {
    key: 'north_dakota',
    name: 'North Dakota',
    abbreviation: 'ND',
    t_abbreviation: 'N.Dak.',
  },
  {
    key: 'ohio',
    name: 'Ohio',
    abbreviation: 'OH',
    t_abbreviation: 'Ohio',
  },
  {
    key: 'oklahoma',
    name: 'Oklahoma',
    abbreviation: 'OK',
    t_abbreviation: 'Okla.',
  },
  {
    key: 'oregon',
    name: 'Oregon',
    abbreviation: 'OR',
    t_abbreviation: 'Ore.',
  },
  {
    key: 'pennsylvania',
    name: 'Pennsylvania',
    abbreviation: 'PA',
    t_abbreviation: 'Pa.',
  },
  {
    key: 'rhode_island',
    name: 'Rhode Island',
    abbreviation: 'RI',
    t_abbreviation: 'R.I.',
  },
  {
    key: 'south_carolina',
    name: 'South Carolina',
    abbreviation: 'SC',
    t_abbreviation: 'S.C.',
  },
  {
    key: 'south_dakota',
    name: 'South Dakota',
    abbreviation: 'SD',
    t_abbreviation: 'S.Dak.',
  },
  {
    key: 'tennessee',
    name: 'Tennessee',
    abbreviation: 'TN',
    t_abbreviation: 'Tenn.',
  },
  {
    key: 'texas',
    name: 'Texas',
    abbreviation: 'TX',
    t_abbreviation: 'Tex.',
  },
  {
    key: 'utah',
    name: 'Utah',
    abbreviation: 'UT',
    t_abbreviation: 'Utah',
  },
  {
    key: 'vermont',
    name: 'Vermont',
    abbreviation: 'VT',
    t_abbreviation: 'Vt.',
  },
  {
    key: 'virginia',
    name: 'Virginia',
    abbreviation: 'VA',
    t_abbreviation: 'Va.',
  },
  {
    key: 'washington',
    name: 'Washington',
    abbreviation: 'WA',
    t_abbreviation: 'Wash.',
  },
  {
    key: 'west_virginia',
    name: 'West Virginia',
    abbreviation: 'WV',
    t_abbreviation: 'W.Va.',
  },
  {
    key: 'wyoming',
    name: 'Wyoming',
    abbreviation: 'WY',
    t_abbreviation: 'Wyo.',
  },
  {
    key: 'virgin_islands',
    name: 'Virgin Islands',
    abbreviation: 'VI',
    t_abbreviation: 'V.I.',
  },
]

export const isValidDesmosState = (state = '') => {
  return allStates.some((st) => {
    return (
      st.name.includes(state) ||
      st.abbreviation.includes(state) ||
      st.t_abbreviation.includes(state)
    )
  })
}

export const getDesmosConfig = (stateName = '', calculateMode) => {
  if (!stateName || calculateMode !== 'GRAPHING_STATE_DESMOS') {
    return standard
  }

  const state = allStates.find((st) => {
    return (
      st.name.includes(stateName) ||
      st.abbreviation.includes(stateName) ||
      st.t_abbreviation.includes(stateName)
    )
  })

  if (!state) {
    return standard
  }

  return stateConfig[state.key] || standard
}

export const getStateName = (stateName = '') => {
  if (!stateName) {
    return ''
  }

  const state = allStates.find((st) => {
    return (
      st.name.includes(stateName) ||
      st.abbreviation.includes(stateName) ||
      st.t_abbreviation.includes(stateName)
    )
  })
  if (!state) {
    return ''
  }

  return state.name
}
