import React, { useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Moment from 'moment'
import { Progress, Layout, Row, Col } from 'antd'
import { get, round } from 'lodash'
import { PrintActionWrapper } from '@edulastic/common'
import qs from 'qs'
import { receiveTestActivitydAction } from '../src/actions/classBoard'
import { getSortedTestActivitySelector } from '../ClassBoard/ducks'
import StudentReportPage from './components/StudentReportPage'
import { getDefaultTestSettingsAction } from '../TestPage/ducks'
import { performanceBandSelector } from '../AssignTest/duck'

const StudentsReportCard = ({
  location,
  match,
  loadTestActivity,
  testActivity,
  classResponse,
  loadTestSettings,
  performanceBandsData,
  audit = false,
}) => {
  const { assignmentId, classId } = match.params
  const gradedTestActivities = testActivity.filter(
    (ta) => ta.status === 'submitted' && ta.graded === 'GRADED'
  )
  let { options = '' } = qs.parse(location.search.substr(1), {
    ignoreQueryPrefix: true,
  })
  options = options?.split(',')?.map((o) => o.trim())
  options = options?.reduce((acc, option) => {
    acc[option] = true
    return acc
  }, {})

  const [numStudentsLoaded, setNumStudentsLoaded] = useState({})
  // load all test activity;
  useEffect(() => {
    loadTestActivity(assignmentId, classId)
    loadTestSettings()
  }, [])

  // change page title to <test title> - <date>
  useEffect(() => {
    document.title = `${classResponse?.title} - ${Moment().format(
      'MMM DD, YYYY'
    )}`
  }, [classResponse])

  const setLoadedCb = useCallback((index) => {
    if (!numStudentsLoaded[index]) {
      setNumStudentsLoaded((loaded) => ({ ...loaded, [index]: true }))
    }
  })

  const totalLength = gradedTestActivities?.length || 0
  const loadedCount = Object.keys(numStudentsLoaded).length
  const allLoaded = totalLength === loadedCount
  const percentLoaded = round((loadedCount / totalLength) * 100, 1)

  return (
    <>
      {allLoaded ? (
        <PrintActionWrapper />
      ) : (
        <Layout.Content>
          <center>
            <h2>Loading reports...</h2>
          </center>
          <Row>
            <Col span={22} offset={1}>
              <Progress status="active" percent={percentLoaded} />
            </Col>
          </Row>
        </Layout.Content>
      )}
      <StudentsReportCardContainer>
        {gradedTestActivities.map((ta, index) =>
          index <= loadedCount ? (
            <StudentReportPage
              testActivity={ta}
              groupId={classId}
              sections={options}
              classResponse={classResponse}
              performanceBandsData={performanceBandsData}
              index={index}
              setLoaded={setLoadedCb}
              audit={audit}
            />
          ) : null
        )}
      </StudentsReportCardContainer>
    </>
  )
}

const StudentsReportCardContainer = styled.div`
  width: 25cm;
  margin: auto;
  background-color: white;
  pointer-events: none;
  * {
    -webkit-print-color-adjust: exact !important; /* Chrome, Safari */
    color-adjust: exact !important; /*Firefox*/
  }
`

const enhance = connect(
  (state) => ({
    testActivity: getSortedTestActivitySelector(state),
    author_classboard_testActivity: get(
      state,
      ['author_classboard_testActivity'],
      []
    ),
    entities: get(state, ['author_classboard_testActivity', 'entities'], []),
    classResponse: get(state, ['classResponse', 'data']),
    performanceBandsData: performanceBandSelector(state),
  }),
  {
    loadTestActivity: receiveTestActivitydAction,
    loadTestSettings: getDefaultTestSettingsAction,
  }
)

export default enhance(StudentsReportCard)
