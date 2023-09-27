import { groupBy, isEmpty, uniqBy } from 'lodash'

export const buildChartData = (apiData, chartType) => {
  const {
    annotation: { measures, dimensions, segments, timeDimensions },
    data,
  } = apiData
  if (chartType === 'table') {
    return {
      columns: [
        ...Object.keys(measures).map((key) => ({
          key,
          title: measures[key].title,
        })),
        ...Object.keys(dimensions).map((key) => ({
          key,
          title: dimensions[key].title,
        })),
        ...Object.keys(segments).map((key) => ({
          key,
          title: segments[key].title,
        })),
        ...Object.keys(timeDimensions)
          .filter((key) => !(key.split('.').length > 2))
          .map((key) => ({ key, title: timeDimensions[key].title })),
      ],
      table: data,
    }
  }

  const seriesNames = [] // TODO: HANDLE UNIQUE SERIESNAME
  const dataPivot = []
  if (!isEmpty(timeDimensions)) {
    const groupedByTimeDimensions = groupBy(
      data,
      (o) => o[Object.keys(timeDimensions)[0]]
    )
    Object.keys(groupedByTimeDimensions).forEach((timeKey) => {
      const timeGroup = groupedByTimeDimensions[timeKey]
      const dataPivotRow = {
        x: timeKey,
        category: timeKey,
      }
      timeGroup.forEach((timeGroupObj) => {
        if (!isEmpty(measures)) {
          Object.keys(measures).forEach((measureKey) => {
            const measure = measures[measureKey]
            const key = Object.keys(dimensions).length
              ? `${Object.keys(dimensions)
                  .map((dimensionKey) => timeGroupObj[dimensionKey])
                  .join(',')},${measureKey}`
              : measureKey
            const title = Object.keys(dimensions).length
              ? `${Object.keys(dimensions)
                  .map((dimensionKey) => dimensions[dimensionKey].title)
                  .join(',')},${measure.title}`
              : measure.title
            dataPivotRow[key] = timeGroupObj[measureKey]
            seriesNames.push({ title, key })
          })
        } else {
          const key = `${Object.keys(dimensions)
            .map((dimensionKey) => timeGroupObj[dimensionKey])
            .join(',')}`
          const title = `${Object.keys(dimensions)
            .map((dimensionKey) => dimensions[dimensionKey].title)
            .join(',')}`
          dataPivotRow[key] = 0
          seriesNames.push({ title, key })
        }
      })
      dataPivot.push(dataPivotRow)
    })
  } else {
    data.forEach((record) => {
      const key = `${Object.keys(dimensions)
        .map((dimensionKey) => record[dimensionKey])
        .join(',')}`
      const dataPivotRow = {
        x: key,
        category: key,
      }
      if (!isEmpty(measures)) {
        Object.keys(measures).forEach((measureKey) => {
          const measure = measures[measureKey]
          dataPivotRow[measureKey] = record[measureKey]
          seriesNames.push({ key: measureKey, title: measure.title })
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
