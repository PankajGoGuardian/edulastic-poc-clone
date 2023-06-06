import { sum } from 'lodash'
import { v4 } from 'uuid'

export const calculateScore = (rubricData, selectedData) => {
  const seletecdPointsArray = Object.keys(selectedData).map((cId) => {
    const rId = selectedData[cId]
    return rubricData.criteria
      .find(({ id }) => id === cId)
      .ratings.find(({ id }) => id === rId).points
  })

  return sum(seletecdPointsArray)
}

export const generateCriteriaData = (index) => ({
  name: `Criteria Name ${index}`,
  id: v4(),
  ratings: [
    {
      name: 'Rating 1',
      desc: '',
      id: v4(),
      points: 0,
    },
    {
      name: 'Rating 2',
      desc: '',
      id: v4(),
      points: 0,
    },
  ],
})

export const getDefaultRubricData = () => ({
  name: '',
  description: '',
  criteria: [generateCriteriaData(1)],
})
