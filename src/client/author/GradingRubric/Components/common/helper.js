import { sum } from 'lodash'

export const calculateScore = (rubricData, selectedData) => {
  const seletecdPointsArray = Object.keys(selectedData).map((cId) => {
    const rId = selectedData[cId]
    return rubricData.criteria
      .find(({ id }) => id === cId)
      .ratings.find(({ id }) => id === rId).points
  })

  return sum(seletecdPointsArray)
}
