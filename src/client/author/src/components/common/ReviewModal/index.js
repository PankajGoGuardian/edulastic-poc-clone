import React, { useState } from 'react'
import {
  ContentContainer,
  RightContentWrapper,
  StyledFlexContainer,
} from './style'
import WorkTable from '../../../../CurriculumSequence/components/Differentiation/WorkTable'
import ManageContentBlock from '../../../../CurriculumSequence/components/ManageContentBlock'
import { compose } from 'redux'
import { connect } from 'react-redux'
import {
  getDifferentiationStudentListSelector,
  getDifferentiationWorkSelector,
  getWorkStatusDataSelector,
} from '../../../../CurriculumSequence/ducks'

const ReviewModalContent = ({
  differentiationWork,
  workStatusData,
  differentiationStudentList,
}) => {
  const [selectedRows, setSelectedRows] = useState([])
  const workTableCommonProps = {
    differentiationStudentList,
  }
  return (
    <StyledFlexContainer
      width="100%"
      alignItems="flex-start"
      justifyContent="flex-start"
      flexDirection="column"
    >
      <StyledFlexContainer width="100%" justifyContent="flex-start">
        <ContentContainer isDifferentiationTab urlHasUseThis>
          <div>
            <WorkTable
              type="REVIEW"
              data-cy="review"
              data={differentiationWork.review}
              workStatusData={workStatusData.REVIEW || []}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              isReviewModal
              {...workTableCommonProps}
            />
          </div>
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
    }),
    null
  )
)

export default enhance(ReviewModalContent)
