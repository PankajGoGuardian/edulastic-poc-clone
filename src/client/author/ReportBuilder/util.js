import { groupBy, isEmpty, uniqBy } from 'lodash'

export const buildChartData = (apiData, chartType) => {
  const {
    annotation: { facts, dimensions, timeDimensions },
    data,
  } = apiData
  if (chartType === 'table') {
    return {
      columns: [
        ...facts.map(({ name, title }) => ({
          key: name,
          title,
        })),
        ...dimensions.map(({ name, title }) => ({
          key: name,
          title,
        })),
        ...timeDimensions
          .filter(({ name }) => !(name.split('.').length > 2))
          .map(({ name, title }) => ({
            key: name,
            title,
          })),
      ],
      table: data,
    }
  }

  const seriesNames = [] // TODO: HANDLE UNIQUE SERIESNAME
  const dataPivot = []
  if (!isEmpty(timeDimensions)) {
    const groupedByTimeDimensions = groupBy(
      data,
      (o) => o[timeDimensions[0].name]
    )
    Object.keys(groupedByTimeDimensions).forEach((timeKey) => {
      const timeGroup = groupedByTimeDimensions[timeKey]
      const dataPivotRow = {
        x: timeKey,
        category: timeKey,
      }
      timeGroup.forEach((timeGroupObj) => {
        if (!isEmpty(facts)) {
          facts.forEach(({ name: factName, title: factTitle }) => {
            const key = !isEmpty(dimensions)
              ? `${dimensions
                  .map(({ name: dimensionName }) => timeGroupObj[dimensionName])
                  .join(',')},${factName}`
              : factName
            const title = !isEmpty(dimensions)
              ? `${dimensions
                  .map(({ title: dimensionTitle }) => dimensionTitle)
                  .join(',')},${factTitle}`
              : factTitle
            dataPivotRow[key] = timeGroupObj[factName]
            seriesNames.push({ title, key })
          })
        } else {
          const key = `${dimensions
            .map(({ name: dimensionName }) => timeGroupObj[dimensionName])
            .join(',')}`
          const title = `${dimensions
            .map(({ title: dimensionTitle }) => dimensionTitle)
            .join(',')}`
          dataPivotRow[key] = 0
          seriesNames.push({ title, key })
        }
      })
      dataPivot.push(dataPivotRow)
    })
  } else {
    data.forEach((record) => {
      const key = `${dimensions
        .map(({ name: dimensionName }) => record[dimensionName])
        .join(',')}`
      const dataPivotRow = {
        x: key,
        category: key,
      }
      if (!isEmpty(facts)) {
        facts.forEach(({ name: factName, title: factTitle }) => {
          dataPivotRow[factName] = record[factName]
          seriesNames.push({ key: factName, title: factTitle })
        })
      } else {
        dataPivotRow[''] = undefined
        seriesNames.push({ key: '', title: '' })
      }
      dataPivot.push(dataPivotRow)
    })
  }
  return {
    data: dataPivot,
    seriesNames: uniqBy(seriesNames, (s) => s.key),
  }
}

export const formatQueryData = (_query) => {
  const {
    source,
    facts = [],
    dimensions = [],
    segments = [],
    filters = [],
  } = _query
  const query = {}
  if (source) {
    // TODO always required for a query
    Object.assign(query, { source })
  }
  if (facts.length) {
    Object.assign(query, { facts: facts.map((o) => o.name) })
  }
  if (dimensions.length) {
    Object.assign(query, {
      dimensions: dimensions.map((o) => o.name),
    })
  }
  if (segments.length) {
    Object.assign(query, {
      segments: segments.map((o) => o.name),
    })
  }
  if (filters.length) {
    Object.assign(query, {
      filters: filters.map(({ dimension, operator, values }) => ({
        member: dimension.name,
        operator,
        values,
      })),
    })
  }
  return query
}
