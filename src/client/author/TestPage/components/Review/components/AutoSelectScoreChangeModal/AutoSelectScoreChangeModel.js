import React, { useRef } from 'react'
import {
  EduButton,
  CustomModalStyled,
  NumberInputStyled,
} from '@edulastic/common'
import { Icon } from 'antd'
import {
  ModalContent,
  ModalHeader,
  ModalHeaderTitle,
  CloseIcon,
  ModalFooterContainer,
} from './styled'
import { StyledInfoMessage } from '../../../GroupItems/styled'

const AutoSelectScoreChangeModal = ({
  visible,
  closeModal,
  score = 1,
  sectionName = 'default name',
  groupIndex,
  test,
  handleSave,
}) => {
  const inputRef = useRef(null)

  const handleChange = () => {
    test.itemGroups[groupIndex].itemsDefaultMaxScore =
      inputRef.current?.value || 1
    handleSave()
    closeModal()
  }

  const Footer = [
    <ModalFooterContainer>
      <EduButton
        onClick={() => {
          handleChange()
        }}
        height="36px"
        width="124px"
        fontSize="14px"
        style={{ textTransform: 'none' }}
      >
        Save
      </EduButton>
    </ModalFooterContainer>,
  ]

  return (
    <CustomModalStyled
      centered
      closable={false}
      textAlign="left"
      visible={visible}
      footer={Footer}
      bodyPadding="0px"
      onCancel={closeModal}
      modalWidth="450px"
      modalMaxWidth="450px"
      padding="32px"
    >
      <ModalHeader>
        <ModalHeaderTitle>
          <span>Edit Score </span>
        </ModalHeaderTitle>
        <EduButton
          IconBtn
          isGhost
          width="24px"
          height="24px"
          onClick={closeModal}
          title="Close"
          noHover
          noBorder
          style={{ 'box-shadow': 'none' }}
        >
          <CloseIcon width={14} height={14} />
        </EduButton>
      </ModalHeader>
      <ModalContent>
        <StyledInfoMessage>
          Set{' '}
          <NumberInputStyled
            showArrow
            ref={inputRef}
            defaultValue={score}
            data-cy="testname-modal"
            size="large"
            placeholder="Enter name here"
            margin="0px"
            width="10ch"
            fontSize="14px"
            bg="transparent"
            onFocus={(event) => {
              event.target.select()
            }}
            style={{ fontWeight: '400' }}
          />{' '}
          for all the items in {sectionName}
          <div style={{ marginTop: '1rem' }}>
            <Icon type="info-circle" /> All items in random distribution should
            have same score for reports.{' '}
          </div>
        </StyledInfoMessage>
      </ModalContent>
    </CustomModalStyled>
  )
}

export default AutoSelectScoreChangeModal
