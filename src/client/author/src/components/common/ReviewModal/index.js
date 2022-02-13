import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { EduTableStyled } from '@edulastic/common'
import ManageContentBlock from '../../../../CurriculumSequence/components/ManageContentBlock'
import {
  ContentContainer,
  RightContentWrapper,
  StyledFlexContainer,
} from './style'
import { getPerformanceGoalsSelector } from '../../../../Dashboard/ducks'
import Tags from '../Tags'

const ReviewModalContent = ({
  performanceGoals,
  studentId,
  closeReviewModal,
  closeModal,
}) => {
  const getColumns = () => {
    if (performanceGoals?.differenciations?.[`${studentId}`]) {
      return []
    }
    return [
      {
        title: 'Domain',
        dataIndex: 'domainName',
        key: 'domainName',
      },
    ]
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      render: (name) => <Tags tags={[name]} show={1} />,
    },
    ...getColumns(),
    {
      title: 'Description',
      dataIndex: 'standardName',
      key: 'standardName',
      align: 'left',
    },
  ]
  const data = performanceGoals
    ? performanceGoals?.differenciations?.[`${studentId}`] ||
      performanceGoals?.eachStdInfo.find((o) => o.studentId === studentId)
        ?.standards
    : null
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
              dataSource={data}
              columns={columns}
              pagination={{ pageSize: 12, hideOnSinglePage: true }}
              loading={!performanceGoals?.differenciations?.[`${studentId}`]}
            />
          </Container>
        </ContentContainer>
        <RightContentWrapper isReviewModal>
          <ManageContentBlock
            isReviewModal
            isDifferentiationTab
            closeReviewModal={closeReviewModal}
            closeModal={closeModal}
          />
        </RightContentWrapper>
      </StyledFlexContainer>
    </StyledFlexContainer>
  )
}

const enhance = compose(
  connect(
    (state) => ({
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
