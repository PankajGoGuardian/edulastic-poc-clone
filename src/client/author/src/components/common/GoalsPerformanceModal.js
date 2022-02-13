import React, { useEffect } from 'react'
import { CustomModalStyled, EduTableStyled } from '@edulastic/common'
import styled from 'styled-components'
import { Progress, Tooltip } from 'antd'
import { title } from '@edulastic/colors'
import { isEmpty } from 'lodash'
import { IconPieChartIcon } from '@edulastic/icons'

const GoalsPerformanceModal = ({
  termId,
  fetchPerformanceGoals,
  showGoalsModal,
  closeModal,
  performanceData = {},
  isPremiumUser,
  history,
}) => {
  const handleLinkClick = () => {
    history.push('/author/reports/student-profile-summary/student/')
    closeModal()
  }

  const handleClick = () => {
    console.log('clicked to open new modal')
  }

  const getLinkColumn = () => {
    if (!isPremiumUser) {
      return []
    }

    return [
      {
        title: 'Links',
        dataIndex: 'links',
        key: 'links',
        render: () => (
          <IconContainer onClick={handleLinkClick}>
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
    },
    {
      title: 'Recommended',
      dataIndex: 'age',
      key: 'age',
      render: () => <LinkContainer onClick={handleClick}>Link</LinkContainer>,
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

  const header = (
    <HeaderTitleWrapper>
      <h2>Performance Goals</h2>
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
  return (
    <CustomModalStyled
      visible={showGoalsModal}
      title={header}
      onCancel={closeModal}
      footer={null}
      modalWidth="900px"
      centered
    >
      <Container>
        <EduTableStyled
          dataSource={performanceData?.eachStdInfo || []}
          columns={columns}
          pagination={{ pageSize: 10, hideOnSinglePage: true }}
          loading={!performanceData?.eachStdInfo}
        />
      </Container>
    </CustomModalStyled>
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
`
const HeaderTitleWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 15px;
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
