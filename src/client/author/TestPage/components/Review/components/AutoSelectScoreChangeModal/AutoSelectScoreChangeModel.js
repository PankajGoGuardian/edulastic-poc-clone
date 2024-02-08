import React from 'react'
import { connect } from 'react-redux'
import {
  EduButton,
  CustomModalStyled,
  NumberInputStyled,
} from '@edulastic/common'
import { Icon } from 'antd'
import { debounce } from 'lodash'
import {
  ModalContent,
  ModalHeader,
  ModalHeaderTitle,
  CloseIcon,
  ModalFooterContainer,
} from './styled'
import { StyledInfoMessage } from '../../../GroupItems/styled'
import { getTestEntitySelector, setTestDataAction } from '../../../../ducks'

const AutoSelectScoreChangeModal = ({
  visible,
  closeModal,
  score = 1,
  sectionName = 'default name',
  groupIndex,
  test,
  handleSave,
  setTestData,
}) => {
  const handleSaveScore = () => {
    handleSave()
    closeModal()
  }
  const onChangeScore = debounce((value) => {
    const updatedItemGroups = test.itemGroups.map((itemGroup, index) => {
      if (index === groupIndex) {
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
  })

  const Footer = [
    <ModalFooterContainer>
      <EduButton
        onClick={handleSaveScore}
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
            defaultValue={score}
            size="large"
            placeholder="Enter score"
            margin="0px"
            width="10ch"
            fontSize="14px"
            bg="transparent"
            onFocus={(event) => {
              event.target.select()
            }}
            onChange={onChangeScore}
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

export default connect(
  (state) => ({
    test: getTestEntitySelector(state),
  }),
  {
    setTestData: setTestDataAction,
  }
)(AutoSelectScoreChangeModal)
