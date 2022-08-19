import { uniqBy } from 'lodash'

export const getEloTloFromStandards = (standards) => {
  const standardsWithId = standards.map((el) => ({
    _id: el.id,
    ...el,
  }))
  const elo = standardsWithId.filter((item) => item.level === 'ELO')
  const tlo = uniqBy(
    standardsWithId.map((item) => ({
      identifier: item.tloIdentifier,
      description: item.tloDescription,
      position: item.position,
      _id: item.tloId,
    })),
    '_id'
  )
  return {
    elo,
    tlo,
  }
}
