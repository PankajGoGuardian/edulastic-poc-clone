import React from 'react'
import { CustomModalStyled } from '@edulastic/common'
import styled from 'styled-components'
import { title } from '@edulastic/colors'
import ReviewModalContent from './ReviewModal'

const ReviewPerformanceModal = ({ showReviewModal, closeReviewModal }) => {
  const header = (
    <HeaderTitleWrapper>
      <h2>Differentiation</h2>
    </HeaderTitleWrapper>
  )
  return (
    <>
      <CustomModalStyled
        visible={showReviewModal}
        title={header}
        onCancel={closeReviewModal}
        footer={null}
        modalWidth="1200px"
        centered
      >
        <ReviewModalContent />
      </CustomModalStyled>
    </>
  )
}

export default ReviewPerformanceModal

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
