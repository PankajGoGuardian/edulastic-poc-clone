import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Row } from 'antd'

import { StyledCard, StyledH3, NoDataContainer } from '../../../common/styled'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import GroupedStackedBarChartContainer from './components/charts/groupedStackedBarChartContainer'
import { getDenormalizedChartData } from './utils/transformers'

import { actions, selectors } from './ducks'
import { mapValues } from 'lodash'

const ChartData = {
  metrics: [
    {
      rubricId: 1,
      criteriaId: 1,
      criteriaScore: 2,
      criteriaMaxScore: 2,
      responsesByRating: {
        1: 20,
        2: 12,
        3: 30,
      },
      totalResponses: 80,
    },
    {
      rubricId: 1,
      criteriaId: 2,
      criteriaScore: 2,
      criteriaMaxScore: 2,
      responsesByRating: {
        4: 10,
        5: 9,
        6: 7,
      },
      totalResponses: 30,
    },
    {
      rubricId: 2,
      criteriaId: 3,
      criteriaScore: 2,
      criteriaMaxScore: 2,
      responsesByRating: {
        7: 13,
        8: 12,
        9: 8,
      },
      totalResponses: 80,
    },
    {
      rubricId: 2,
      criteriaId: 4,
      criteriaScore: 2,
      criteriaMaxScore: 2,
      responsesByRating: {
        10: 16,
        11: 8,
        12: 7,
        13: 5
      },
      totalResponses: 40,
    },
    {
      rubricId: 2,
      criteriaId: 5,
      criteriaScore: 2,
      criteriaMaxScore: 2,
      responsesByRating: {
        14: 6,
        15: 18,
        16: 7,
        17: 15
      },
      totalResponses: 40,
    },
  ],
  rubrics: [
    {
      id: 1,
      name: 'rubric 1',
      criteria: [{
        id: 1,
        name: 'organizational skill',
        ratings: [{
          id: 1,
          name: 'rating 1',
          fill: '#E55C5C'
        },
        {
          id: 2,
          name: 'rating 2',
          fill: '#FFFF00'
        },
        {
          id: 3,
          name: 'rating 3',
          fill: '#00FF00',
        }
        ]
      }, {
        id: 2,
        name: 'speaking skill',
        ratings: [{
          id: 4,
          name: 'rating 4',
          fill: '#E55C5C'
        },
        {
          id: 5,
          name: 'rating 5',
          fill: '#FFFF00'
        },
        {
          id: 6,
          name: 'rating 6',
          fill: '#00FF00'
        }
        ]
      }]
    },
    {
      id: 2,
      name: 'rubric 2',
      criteria: [{
        id: 3,
        name: 'organizational skill',
        ratings: [{
          id: 7,
          name: 'rating 7',
          fill: '#E55C5C'
        },
        {
          id: 8,
          name: 'rating 8',
          fill: '#FFFF00'
        },
        {
          id: 9,
          name: 'rating 9',
          fill: '#00FF00',
        }
        ]
      }, {
        id: 4,
        name: 'speaking skill',
        ratings: [{
          id: 10,
          name: 'rating 10',
          fill: '#E55C5C'
        },
        {
          id: 11,
          name: 'rating 11',
          fill: '#FFFF00'
        },
        {
          id: 12,
          name: 'rating 12',
          fill: '#00FF00'
        },
        {
          id: 13,
          name: 'rating 13',
          fill: '#E55C5C'
        }
        ]
      }, {
        id: 5,
        name: 'speaking skill',
        ratings: [{
          id: 14,
          name: 'rating 14',
          fill: '#E55C5C'
        },
        {
          id: 15,
          name: 'rating 15',
          fill: '#FFFF00'
        },
        {
          id: 16,
          name: 'rating 16',
          fill: '#00FF00'
        },
        {
          id: 17,
          name: 'rating 17',
          fill: '#E55C5C'
        }
        ]
      }]
    },
  ],
}

const PerformanceByRubricCriteria = ({
  // selectors from ducks selectors
  reportChartData,
  loadingReportChartData,
  reportTableData,
  loadingReportTableData,
  error,
  // actions from ducks actions
  fetchReportChartDataRequest,
  fetchReportTableDataRequest,
}) => {
  // data size exceeding template
  // if (error && error.dataSizeExceeded) {
  //   return <DataSizeExceeded />
  // }

  // No data container template
  // if (!denormalizedData?.length) {
  //   return (
  //     <NoDataContainer>
  //       {settings.requestFilters?.termId ? 'No data available currently.' : ''}
  //     </NoDataContainer>
  //   )
  // }

  useEffect(() => {
    console.log('callingx')
    fetchReportChartDataRequest()
  }, [])

  const chartData = useMemo(() => getDenormalizedChartData(reportChartData), [reportChartData]) 

  return (
    <div>
      <StyledCard>
        <Row type="flex" justify="start">
          <StyledH3 margin="0 0 10px 50px">
            Performance by Rubric criteria
          </StyledH3>
        </Row>
        <Row><GroupedStackedBarChartContainer data={chartData}/></Row>
        {/* Table container */}
      </StyledCard>
    </div>
  )
}

const enhance = compose(connect((state) => ({
  ...mapValues(selectors, (selector) => selector(state)),
}), {
  ...actions,
}))

export default enhance(PerformanceByRubricCriteria)
