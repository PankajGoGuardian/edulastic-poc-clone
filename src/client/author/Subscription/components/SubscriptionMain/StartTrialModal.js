import { CustomModalStyled, EduButton } from '@edulastic/common'
import React from 'react'
import { ModalBody, FlexRow } from './styled'

const StartTrialModal = ({ visible, setShowModal }) => {
  return (
    <CustomModalStyled
      visible={visible}
      title="Start a Trial"
      onCancel={() => setShowModal(false)}
      footer={[
        <EduButton onClick={() => setShowModal(false)} isGhost isBlue>
          Cancel
        </EduButton>,
        <EduButton isBlue>Proceed</EduButton>,
      ]}
      centered
    >
      <ModalBody>
        <FlexRow>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
            dapibus ex accumsan dui laoreet venenatis. Nullam dignissim mauris
            metus. Nullam aliquet porttitor quam
          </p>
        </FlexRow>
      </ModalBody>
    </CustomModalStyled>
  )
}

export default StartTrialModal
