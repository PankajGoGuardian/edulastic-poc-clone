import React from 'react'
import {
  ContentContainer,
  RightContentWrapper,
  StyledFlexContainer,
} from './style'
import ManageContentBlock from '../../../../CurriculumSequence/components/ManageContentBlock'
import { compose } from 'redux'
import { connect } from 'react-redux'
import {
  getDifferentiationStudentListSelector,
  getDifferentiationWorkSelector,
  getWorkStatusDataSelector,
} from '../../../../CurriculumSequence/ducks'
import styled from 'styled-components'
import { EduTableStyled } from '@edulastic/common'
import { getPerformanceGoalsSelector } from '../../../../Dashboard/ducks'

const ReviewModalContent = ({ performanceGoals }) => {
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
      render: () => <div>Link</div>,
    },
  ]

  console.log('performanceGoals', performanceGoals)
  return (
    <StyledFlexContainer
      width="100%"
      alignItems="flex-start"
      justifyContent="flex-start"
      flexDirection="column"
    >
      <StyledFlexContainer width="100%" justifyContent="flex-start">
        <ContentContainer isDifferentiationTab urlHasUseThis>
          <Container>
            <EduTableStyled
              dataSource={performanceGoals?.differenciations || []}
              columns={columns}
              pagination={{ pageSize: 10, hideOnSinglePage: true }}
              loading={!performanceGoals?.differenciations}
            />
          </Container>
        </ContentContainer>
        <RightContentWrapper isReviewModal>
          <ManageContentBlock isReviewModal isDifferentiationTab />
        </RightContentWrapper>
      </StyledFlexContainer>
    </StyledFlexContainer>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      differentiationStudentList: getDifferentiationStudentListSelector(state),
      differentiationWork: getDifferentiationWorkSelector(state),
      workStatusData: getWorkStatusDataSelector(state),
      performanceGoals: getPerformanceGoalsSelector(state),
    }),
    null
  )
)

export default enhance(ReviewModalContent)

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
