import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
  EduButton,
  CustomModalStyled,
  NumberInputStyled,
  notification,
} from '@edulastic/common'
import {
  ModalContent,
  ModalHeader,
  ModalHeaderTitle,
  ModalFooterContainer,
  StyledInfoMessage,
} from './styled'
import { getTestEntitySelector, setTestDataAction } from '../../../../ducks'

const AutoSelectScoreChangeModal = ({
  visible,
  closeModal,
  test,
  currentGroupId,
  handleSave,
  setTestData,
}) => {
  const currentGroup =
    test.itemGroups.find((itemGroup) => itemGroup._id == currentGroupId) || {}
  const { groupName, itemsDefaultMaxScore } = currentGroup

  const [oldScore] = useState(itemsDefaultMaxScore)

  const handleSaveScore = () => {
    handleSave(undefined, undefined, () =>
      notification({
        msg: `Score updated to ${itemsDefaultMaxScore} for each item in ${groupName}.`,
      })
    )
    closeModal()
  }

  const onChangeScore = (value) => {
    const updatedItemGroups = test.itemGroups.map((itemGroup) => {
      if (itemGroup._id === currentGroupId) {
        return {
          ...itemGroup,
          itemsDefaultMaxScore: value,
        }
      }
      return itemGroup
    })
    setTestData({
      itemGroups: updatedItemGroups,
    })
  }

  const cancel = () => {
    onChangeScore(oldScore)
    closeModal()
  }

  const Footer = [
    <ModalFooterContainer>
      <EduButton
        onClick={cancel}
        height="36px"
        width="124px"
        fontSize="14px"
        style={{ textTransform: 'none' }}
        type="primary"
        isGhost
      >
        CANCEL
      </EduButton>
      <EduButton
        onClick={handleSaveScore}
        height="36px"
        width="124px"
        fontSize="14px"
        style={{ textTransform: 'none' }}
      >
        SAVE
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
      onCancel={cancel}
      modalWidth="588px"
      modalMaxWidth="588px"
      padding="32px"
    >
      <ModalHeader>
        <ModalHeaderTitle>
          <span>Edit Score </span>
        </ModalHeaderTitle>
      </ModalHeader>
      <ModalContent>
        <StyledInfoMessage>
          All items in random distribution should have same score for reports.
        </StyledInfoMessage>
        <StyledInfoMessage>
          In {groupName}, set{' '}
          <NumberInputStyled
            showArrow
            defaultValue={itemsDefaultMaxScore}
            size="large"
            placeholder="Enter score"
            margin="0px"
            width="10ch"
            fontSize="14px"
            textAlign="center"
            bg="transparent"
            onFocus={(event) => {
              event.target.select()
            }}
            onChange={onChangeScore}
            style={{ fontWeight: '400' }}
          />{' '}
          for each item
        </StyledInfoMessage>
      </ModalContent>
    </CustomModalStyled>
  )
}

export default connect(
  (state) => ({
    test: getTestEntitySelector(state),
  }),
  {
    setTestData: setTestDataAction,
  }
)(AutoSelectScoreChangeModal)
