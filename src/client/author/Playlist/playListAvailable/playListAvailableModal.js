import React from 'react'
import { CustomModalStyled, EduButton } from '@edulastic/common'
import styled from 'styled-components'

const PlayListAvailableModal = ({ isVisible, closeModal }) => {
  const footer = (
    <EduButton width="180px" height="45px" onClick={closeModal}>
      Get Started
    </EduButton>
  )

  return (
    <CustomModalStyled
      title="Spark Math Aligned To Your Curriculum"
      className="sparkMathModaltest"
      centered
      visible={isVisible}
      footer={footer}
      onCancel={closeModal}
    >
      <ModalBody>
        <p>
          SparkMath puts pre-built quizzes and assessments for each modules of
          your curriculum at your fingertips. Playlists for the following
          curricula are currently available.
        </p>
        <p>
          <img
            src="https://s3.amazonaws.com/edureact-dev/user/60179c19e4c00120ad85905c/53f4e0ff-7055-48a6-b5ab-28ce280dbd39.png"
            alt=""
          />
          <img
            src="https://s3.amazonaws.com/edureact-dev/user/60179c19e4c00120ad85905c/310cc21e-3c52-4a48-84a5-ff40da87695c.png"
            alt=""
          />
          <img
            src="https://s3.amazonaws.com/edureact-dev/user/60179c19e4c00120ad85905c/3ca23d9d-6fb5-4970-a60e-de98afd47b76.png"
            alt=""
          />
          <img
            src="https://s3.amazonaws.com/edureact-dev/user/60179c19e4c00120ad85905c/a9142b7c-8a53-4fb5-a731-261bc96a7c15.png"
            alt=""
          />
        </p>
        <p>
          Pick the curriculum that you are interested in and select &ldquo;Use
          This&ldquo; at the top right corner to being customizing it.
        </p>
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
