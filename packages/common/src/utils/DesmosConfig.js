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
    plotInequalities: false,
    plotSingleVariableImplicitEquations: false,
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
    restrictedFunctions: true,
    sliders: false,
    degreeMode: true,
    qwertyKeyboard: false,
    images: false,
    folders: false,
    notes: false,
    distributions: false,
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
    plotSingleVariableImplicitEquations: false,
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
  south_carolina: {
    ...standard,
    decimalToFraction: false,
    Slider: true,
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
    plotInequalities: false,
    plotImplicits: false,
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
  const lowerCaseState = state?.toLocaleLowerCase() ?? ''
  return allStates.some((st) => {
    return (
      st.name.toLocaleLowerCase() === lowerCaseState ||
      st.abbreviation.toLocaleLowerCase() === lowerCaseState ||
      st.t_abbreviation.toLocaleLowerCase() === lowerCaseState
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
