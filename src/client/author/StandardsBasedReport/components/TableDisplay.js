import { smallDesktopWidth } from '@edulastic/colors'
import { round, sum, values, isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { getHasRandomQuestionselector } from '../../ClassBoard/ducks'
import ArrowLeftIcon from '../Assets/left-arrow.svg'
import ArrowRightIcon from '../Assets/right-arrow.svg'
import { getStandardWisePerformanceMemoized } from '../Transformer'
import DetailedDisplay from './DetailedDisplay'
import {
  InfoCard,
  MasterySummary,
  MasterySummaryInfo,
  MoblieFlexContainer,
  MoblieSubFlexContainer,
  PerformanceSummary,
  QuestionCell,
  ReportTitle,
  StandardCell,
  StandardsMobile,
  StyledCard,
  TableData,
} from './styled'
import NoDataNotification from '../../../common/components/NoDataNotification'

export const getMastery = (assignmentMasteryArray, performancePercentage) => {
  performancePercentage = performancePercentage || 0

  for (const mastery of assignmentMasteryArray) {
    if (performancePercentage >= mastery.threshold) {
      return mastery
    }
  }
  return {
    color: '#E61E54',
    masteryLabel: 'NM',
  }
}

const sortAlphaNum = (a, b) => {
  if (a < b) {
    return -1
  }
  if (a > b) {
    return 1
  }
  return 0
}

export const getPerfomancePercentage = (testActivities, std) => {
  const performances = values(
    getStandardWisePerformanceMemoized(testActivities, std)
  )
  return (sum(performances) / performances.length) * 100
}

class TableDisplay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stdId: '',
      perfomancePercentage: undefined,
    }
    this.dataLoaded = false
  }

  static getDerivedStateFromProps(props, state) {
    const { reportStandards: standards } = props
    const submittedActs = props.testActivities.filter(
      (x) => x.status === 'submitted'
    )
    if (submittedActs.length && !state.dataLoaded) {
      const standardsByMasterySummary = standards.map((std) => {
        const masterySummary = getPerfomancePercentage(
          props.testActivities,
          std
        )
        return { masterySummary, _id: std._id }
      })
      const firstStandard = standardsByMasterySummary?.sort(
        (a, b) => (b.masterySummary || 0) - (a.masterySummary || 0)
      )[0]
      const perfomancePercentage = firstStandard?.masterySummary
      return {
        stdId: firstStandard ? firstStandard._id : '',
        perfomancePercentage,
        dataLoaded: true,
      }
    }
  }

  onCaretClick = (data, perfomancePercentage = undefined) => {
    if (perfomancePercentage || perfomancePercentage === 0) {
      this.setState((prev) => ({
        stdId: prev.stdId === data ? '' : data,
        perfomancePercentage,
      }))
    } else {
      this.setState((prev) => ({ stdId: prev.stdId === data ? '' : data }))
    }
  }

  isMobile = () => window.innerWidth < 768

  filteredData = (data) => {
    const { testActivities: testActivity } = this.props
    const studentData = testActivity.filter((std) =>
      std.questionActivities.filter(
        (questionActivity) =>
          data.qIds.filter((qId) => questionActivity._id === qId).length > 0
      )
    )
    return studentData
  }

  getPerfomancePercentage = (std) => {
    const { testActivities } = this.props
    const performances = values(
      getStandardWisePerformanceMemoized(testActivities, std)
    )
    return performances.length
      ? (sum(performances) / performances.length) * 100
      : 0
  }

  getMasterySummary = (data) => {
    const {
      additionalData: { assignmentMastery },
    } = this.props
    const studentData = this.filteredData(data)
    let totalMastered = 0
    studentData.forEach((student) => {
      const score = student.score || 0
      if (
        assignmentMastery[1].threshold <
        ((score / student.maxScore) * 100).toFixed(10)
      ) {
        totalMastered += 1
      }
    })
    return Math.round((totalMastered / studentData.length) * 100 * 100) / 100
  }

  render() {
    const { stdId, perfomancePercentage } = this.state
    const {
      additionalData: { assignmentMastery = [] } = {},
      reportStandards: standards,
      isTestStandardsEmpty,
      t,
      hasRandomQuestions,
      testActivities,
      qids,
      labels,
    } = this.props
    const questionsColumn = hasRandomQuestions
      ? []
      : [
          {
            title: 'Question',
            dataIndex: 'question',
            key: 'question',
            sorter: (a, b) => sortAlphaNum(a.question, b.question),
            width: 200,
            render: (text) => <CustomQuestionCell>{text}</CustomQuestionCell>,
          },
        ]
    const columns = [
      {
        title: 'Standards',
        dataIndex: 'standard',
        key: 'standard',
        className: 'standard-column',
        sorter: (a, b) =>
          sortAlphaNum(a.standard.props.children, b.standard.props.children),
        render: (text) => <CustomStandardCell>{text}</CustomStandardCell>,
      },
      ...questionsColumn,

      {
        title: 'Mastery Summary',
        dataIndex: 'masterySummary',
        key: 'masterySummary',
        className: 'mastery-column',
        sorter: (a, b) => (a.masterySummary || 0) - (b.masterySummary || 0),
        render: (text) => (
          <MasterySummary
            strokeColor={getMastery(assignmentMastery || [], text || 0).color}
            showInfo={false}
            percent={round(parseFloat(text), 2) || 0}
          />
        ),
      },
      {
        title: 'Performance Summary %',
        key: 'performanceSummary',
        dataIndex: 'performanceSummary',
        className: 'performance-column',
        sorter: (a, b) => (a.masterySummary || 0) - (b.masterySummary || 0),
        render: (text) => (
          <PerformanceSummary>{round(text, 2) || 0}</PerformanceSummary>
        ),
        defaultSortOrder: 'descend',
      },
      {
        title: '',
        key: 'icon',
        dataIndex: 'icon',
        className: 'arrowIcon-column',
      },
    ]
    const submittedLength = testActivities.filter(
      (act) => act.status === 'submitted'
    ).length
    const data = standards.map((std, index) => {
      const _perfomancePercentage = this.getPerfomancePercentage(std)
      return {
        key: index + 1,
        stdId: std._id,
        standard: <p className="first-data">{std.identifier}</p>,
        question: [
          ...new Set(
            std.qIds
              .filter((qid) => qids.indexOf(qid.split('_')[1]) > -1)
              .map((id) => labels[id]?.barLabel)
          ),
        ].join(','),
        masterySummary: _perfomancePercentage,
        performanceSummary: _perfomancePercentage,
        icon: submittedLength ? (
          stdId === std._id ? (
            <div>
              <img src={ArrowRightIcon} alt="right" />
            </div>
          ) : (
            <div>
              <img src={ArrowLeftIcon} alt="left" />
            </div>
          )
        ) : null,
      }
    })

    const isMobile = this.isMobile()

    if (isEmpty(standards)) {
      let heading = t('common.noMatchingStandardsHeading')
      let description = (
        <>
          Please visit <Link to="/author/profile">My Profile</Link>{' '}
          {t('common.noMatchingStandardsDescription')}
        </>
      )
      if (isTestStandardsEmpty) {
        heading = t('common.noStandardsHeading')
        description = t('common.noStandardsDescription')
      }
      return <NoDataNotification heading={heading} description={description} />
    }

    return (
      <>
        {isMobile && (
          <MoblieFlexContainer>
            <ReportTitle>Standard performance</ReportTitle>
          </MoblieFlexContainer>
        )}
        {isMobile && (
          <MoblieFlexContainer>
            {data.map((d, i) => (
              <StyledCard key={i}>
                <StandardsMobile>{d.standard}</StandardsMobile>
                <MoblieSubFlexContainer>
                  <InfoCard>
                    <label>Question</label>
                    <QuestionCell>{d.question}</QuestionCell>
                  </InfoCard>
                  <InfoCard>
                    <label>Performance %</label>
                    <PerformanceSummary>
                      {round(d.performanceSummary, 2) || 0}
                    </PerformanceSummary>
                  </InfoCard>
                </MoblieSubFlexContainer>

                <MoblieSubFlexContainer flexDirection="column">
                  <label>Mastery Summary</label>
                  <MasterySummary
                    percent={round(parseFloat(d.masterySummary), 2)}
                    showInfo={false}
                  />
                  <MasterySummaryInfo>
                    {round(d.masterySummary, 2)}%
                  </MasterySummaryInfo>
                </MoblieSubFlexContainer>

                <MoblieSubFlexContainer>{d.icon}</MoblieSubFlexContainer>
              </StyledCard>
            ))}
          </MoblieFlexContainer>
        )}

        {!isMobile && (
          <StyledCard noBorder>
            <ReportTitle className="abc">Standard performance</ReportTitle>
            <TableData
              columns={columns}
              dataSource={data}
              pagination={false}
              onRow={(rowData) => ({
                onClick: () => {
                  if (stdId === rowData.stdId) {
                    return this.onCaretClick(rowData.stdId)
                  }
                  return this.onCaretClick(
                    rowData.stdId,
                    rowData.performanceSummary
                  )
                },
              })}
            />
          </StyledCard>
        )}

        {stdId !== '' && (
          <DetailedDisplay
            onClose={() => this.onCaretClick(stdId)}
            data={standards.find((std) => std._id === stdId)}
            performancePercentage={perfomancePercentage}
            color={
              getMastery(assignmentMastery || [], perfomancePercentage || 0)
                .color
            }
          />
        )}
      </>
    )
  }
}

export default connect(
  (state) => ({
    hasRandomQuestions: getHasRandomQuestionselector(state),
  }),
  null
)(TableDisplay)

const CustomStandardCell = styled(StandardCell)`
  max-width: 120px;
  margin: 0px !important;
`
const CustomQuestionCell = styled(QuestionCell)`
  overflow: hidden;
  text-overflow: ellipsis;
  div {
    margin: 0px auto;
  }
  @media (max-width: ${smallDesktopWidth}) {
    max-width: 80px;
  }
`

TableDisplay.propTypes = {
  /* eslint-disable react/require-default-props */
  additionalData: PropTypes.object,
}
