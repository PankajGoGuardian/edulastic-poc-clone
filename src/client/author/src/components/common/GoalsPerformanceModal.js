import React, { useEffect, useState } from 'react'
import { CustomModalStyled, EduTableStyled } from '@edulastic/common'
import styled from 'styled-components'
import { Progress, Tooltip, Tabs } from 'antd'
import { title } from '@edulastic/colors'
import { isEmpty } from 'lodash'
import { IconPieChartIcon } from '@edulastic/icons'
import { segmentApi } from '@edulastic/api'
import ReviewPerformanceModal from './ReviewPerformanceModal'
import DollarPremiumSymbol from '../../../AssignTest/components/Container/DollarPremiumSymbol'

const { TabPane } = Tabs

const GoalsPerformanceModal = ({
  termId,
  fetchPerformanceGoals,
  showGoalsModal,
  closeModal,
  performanceData = {},
  isPremiumUser,
  history,
  getDifferentiationData,
}) => {
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [studentId, setStudentId] = useState('')

  const handleLinkClick = (studentId) => {
    if (!isPremiumUser) {
      return
    }
    history.push({
      pathname: `/author/reports/student-profile-summary/student/${studentId}`,
      state: {
        studentIdState: studentId,
      },
    })
    closeModal()
  }

  const handleClick = (standards, data) => {
    if (!isPremiumUser) {
      return
    }
    getDifferentiationData({
      standards: `${standards.map((o) => o.id).join(',')}`,
      skillIdentifiers: `${standards.map((o) => o.name).join(',')}`,
      studentId: data.studentId,
    })
    setStudentId(data.studentId)
    setShowReviewModal(true)
    segmentApi.genericEventTrack('goals_differentiation', {})
  }

  const getLinkColumn = () => {
    if (!isPremiumUser) {
      return []
    }

    return [
      {
        title: 'Student Summary Report',
        dataIndex: 'studentId',
        key: 'studentId',
        render: (studentId) => (
          <IconContainer onClick={() => handleLinkClick(studentId)}>
            <Tooltip placement="bottom" title="Student Summary Report">
              <IconPieChartIcon alt="Images" />
            </Tooltip>
          </IconContainer>
        ),
      },
    ]
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      width: '35%',
    },
    {
      title: 'Review Standards Counts',
      dataIndex: 'standards',
      key: 'standards',
      render: (standards, data) => (
        <>
          <LinkContainer onClick={() => handleClick(standards, data)}>
            {isPremiumUser ? (
              <a>{standards.length || 0}</a>
            ) : (
              standards.length || 0
            )}
          </LinkContainer>
        </>
      ),
    },
    ...getLinkColumn(),
  ]
  const percentage =
    Math.ceil(
      (performanceData?.countAbove60 /
        (performanceData?.countAbove60 + performanceData?.countBelow60)) *
        100
    ) || 0
  useEffect(() => {
    if (isEmpty(performanceData)) {
      fetchPerformanceGoals({ termId })
    }
  }, [])

  const closeReviewModal = () => {
    setShowReviewModal(false)
  }

  const handleImgClick = (text) => {
    if (text === 'Edulastic Certified') {
      window.open(
        'https://edulastic.teachable.com/courses/category/edulastic-certified-educator',
        '_blank'
      )
    } else {
      window.open('https://edulastic.com/innovator-team/', '_blank')
    }
    segmentApi.genericEventTrack(text, {})
  }

  const header = (
    <HeaderTitleWrapper>
      <h2>Performance Achieved</h2>
      <div>
        <Progress
          strokeWidth="12px"
          strokeColor={
            percentage < 30
              ? 'rgb(255, 230, 192)'
              : percentage < 60
              ? 'rgb(235, 123, 101)'
              : 'rgb(153, 203, 118)'
          }
          percent={percentage}
          trailColor="#e1e1e1"
          size="large"
        />
      </div>
    </HeaderTitleWrapper>
  )
  const tabTitle = (
    <>
      My Goals
      <DollarPremiumSymbol premium={isPremiumUser} />
    </>
  )
  return (
    <>
      <CustomModalStyled
        visible={showGoalsModal}
        title=""
        onCancel={closeModal}
        footer={null}
        modalWidth="900px"
        centered
        bodyStyle={{ paddingTop: '0px' }}
      >
        <Container>
          <Tabs defaultActiveKey="1">
            <TabPane tab={tabTitle} key="1">
              {header}
              <EduTableStyled
                dataSource={performanceData?.eachStdInfo || []}
                columns={columns}
                pagination={{ pageSize: 10, hideOnSinglePage: true }}
                loading={!performanceData?.eachStdInfo}
              />
            </TabPane>
            <TabPane tab="Edulastic Goals" key="2">
              <div>
                <ul className="logos">
                  <li
                    onClick={() => handleImgClick('Edulastic Certified')}
                    title="Edulastic Certified"
                  >
                    <img
                      src="https://process.fs.teachablecdn.com/ADNupMnWyR7kCWRvm76Laz/resize=width:705/https://www.filepicker.io/api/file/r23bFtSuQyWTCGLp6Pfb"
                      alt=""
                    />
                  </li>
                  <li
                    onClick={() => handleImgClick('Edulastic Innovator')}
                    title="Edulastic Innovator"
                  >
                    <img
                      src="https://edulastic.com/wp-content/uploads/2022/01/edulastic.png"
                      alt=""
                    />
                  </li>
                  <li
                    onClick={() => handleImgClick('Edulastic Coach')}
                    title="Edulastic Coach"
                  >
                    <img
                      src="https://edulastic.com/wp-content/uploads/2022/01/coach.png"
                      alt=""
                    />
                  </li>
                  <li
                    onClick={() => handleImgClick('Edulastic Creator (Author)')}
                    title="Edulastic Creator (Author)"
                  >
                    <img
                      src="https://edulastic.com/wp-content/uploads/2022/01/creator.png"
                      alt=""
                    />
                  </li>
                  <li title="Beta testing">
                    <img
                      src="https://cdnedupoc.snapwiz.net/default/coach_1_609b1c73-6216-4a64-b9ad-10a72382440a.png"
                      alt=""
                    />
                  </li>
                </ul>
              </div>
            </TabPane>
          </Tabs>
        </Container>
      </CustomModalStyled>
      {showReviewModal && (
        <ReviewPerformanceModal
          showReviewModal={showReviewModal}
          closeReviewModal={closeReviewModal}
          closeModal={closeModal}
          studentId={studentId}
        />
      )}
    </>
  )
}

export default GoalsPerformanceModal

const Container = styled.div`
  .ant-pagination {
    position: relative;
    padding: 0px;
    margin: 0px;
    bottom: 0;
    right: 0;
    top: 15px;
  }
  .ant-tabs.ant-tabs-top {
    padding-bottom: 25px;
    .ant-tabs-tab {
      text-transform: uppercase;
      font-weight: bold;
    }
  }
  ul.logos {
    list-style: none;
    display: flex;
    justify-content: left;
    align-items: center;
    margin: 0px;
    padding: 0px;
    padding: 20px 0px;
    flex-wrap: wrap;
    li {
      width: 30%;
      height: 80px;
      border: 1px solid #dddddd;
      cursor: pointer;
      margin: 5px;
      text-align: center;
      img {
        height: 100%;
        max-width: 100%;
        cursor: pointer;
      }
      &:nth-child(2) {
        background: linear-gradient(to right, #1dbfa0, #23b4d2);
      }
      &:nth-child(3) {
        background: linear-gradient(to right, #ffdc41, #e9aa14);
      }
      &:nth-child(4) {
        background: linear-gradient(to right, #f941ff, #7204b1);
      }
      &:nth-child(5) {
        background: #cccccc;
      }
    }
  }
`
const HeaderTitleWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 0px 15px;
  h2 {
    font-size: 22px;
    color: ${title};
    margin: 0px;
    font-weight: bold;
    margin-right: 30px;
  }
  & > div {
    width: 200px;
  }
`
const IconContainer = styled.div``

const LinkContainer = styled.div``
