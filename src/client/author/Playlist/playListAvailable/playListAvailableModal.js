import React from 'react'
import { CustomModalStyled, EduButton } from '@edulastic/common'
import styled from 'styled-components'

const PlayListAvailableModal = ({
  isVisible,
  closeModal,
  filteredSpark,
  description,
}) => {
  const footer = (
    <EduButton
      width="180px"
      height="45px"
      data-cy="playlistGetStartedButton"
      onClick={closeModal}
    >
      Get Started
    </EduButton>
  )

  const { name } = filteredSpark

  const title =
    name === 'SparkScience'
      ? 'SparkScience + Teacher Premium'
      : 'Spark Math Aligned To Your Curriculum'

  return (
    <CustomModalStyled
      title={title}
      className="sparkMathModaltest"
      centered
      visible={isVisible}
      footer={footer}
      onCancel={closeModal}
    >
      <ModalBody>
        <div dangerouslySetInnerHTML={{ __html: description }} />
      </ModalBody>
    </CustomModalStyled>
  )
}

export default PlayListAvailableModal

const ModalBody = styled.div`
  p {
    font-weight: normal !important;
    padding-bottom: 10px;
  }
  img {
    width: auto;
    max-height: 40px;
    padding: 0px 10px;
  }
`
