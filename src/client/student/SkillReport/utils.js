import { orderBy, round } from 'lodash'

export const getBandWithColor = (scaleInfo = {}, percentage) => {
  const sortedScales = orderBy(scaleInfo.scale, ['threshold'], ['desc'])
  const data =
    sortedScales.find((scale) => round(percentage) >= scale.threshold) || {}
  return data
}
