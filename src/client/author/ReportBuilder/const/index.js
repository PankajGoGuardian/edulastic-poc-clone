export const DEFAULT_PAGESIZE = 20

export const DEFAULT_WIDGET_LAYOUT = {
  type: 'table',
  options: {
    x: 0,
    y: 0,
    w: 8,
    h: 8,
    coOrds: {
      xCoOrds: [],
      yCoOrds: [],
    },
    axesLabel: {
      x: '',
      y: '',
    },
  },
}

export const DEFAULT_REPORT_STATE = {
  title: 'Untitled Report',
  description: '',
  widgets: [],
}

export const isValidQuery = (query) => {
  return query?.dimensions?.length || query?.facts?.length
}
