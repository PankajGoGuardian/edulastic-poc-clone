import { groupBy, isEmpty, uniqBy } from 'lodash'

export const buildChartData = (apiData, chartType, coOrds = {}) => {
  const { annotation, data } = apiData
  let { facts, dimensions } = annotation
  const { timeDimensions } = annotation
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

  const { xCoOrds, yCoOrds } = coOrds
  if (!isEmpty(xCoOrds) || !isEmpty(yCoOrds)) {
    const viewLevelFacts = xCoOrds.map((name) =>
      [...facts, ...dimensions].find((o) => o.name === name)
    )
    const viewLevelDimensions = yCoOrds.map((name) =>
      [...facts, ...dimensions].find((o) => o.name === name)
    )
    facts = viewLevelFacts
    dimensions = viewLevelDimensions
  }

  const seriesNames = []
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
  const finalSeriesNames = uniqBy(seriesNames, (s) => s.key)
  const finalDataPivot = dataPivot.map((o) => {
    const newObj = { ...o }
    finalSeriesNames.forEach(({ key }) => {
      if (key && !newObj[key]) Object.assign(newObj, { key: 0 })
    })
    return newObj
  })

  return {
    yAxesFields: facts,
    xAxesFields: dimensions,
    data: finalDataPivot,
    seriesNames: finalSeriesNames,
  }
}
