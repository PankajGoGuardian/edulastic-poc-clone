import React from 'react'
import { GroupedStackedBarChart } from '../../../../../common/components/charts/groupedStackedBarChart'

// {
// 	data: [{ // represents bar in chart
//    rubricId: string
//    criteriaId: string
//    criteriaScore: number
//    criteriaMaxScore: number
//     studentsByRating: {
// 			[rating-id]: number // no. of students having this rating
// 		},
// 		totalStudents: number
// 	}],
// 	rubrics: [{
// 		_id
// 		name
// 		description
// 		criteria: [{}]
// 	}]
// }

const Data = {
  data: [
    {
      rubricId: 1,
      criteriaId: 1,
      criteriaScore: 2,
      criteriaMaxScore: 2,
      studentsByRating: {
        1: 20,
        2: 12,
        3: 30,
      },
      totalStudents: 50,
    },
    {
      rubricId: 1,
      criteriaId: 2,
      criteriaScore: 2,
      criteriaMaxScore: 2,
      studentsByRating: {
        1: 10,
        2: 9,
        3: 7,
      },
      totalStudents: 50,
    },
  ],
  rubrics: [
    {
      _id: 1,
      name: 'rubric sample',
      // criteria: []
    },
  ],
}

const GroupedStackedBarChartContainer = ({ chartData }) => {
  // process chart data here
  const data = chartData

  return (
    <div>
      <GroupedStackedBarChart data={data} />
    </div>
  )
}

export default GroupedStackedBarChartContainer
