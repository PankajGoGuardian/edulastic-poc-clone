import React, { useRef } from 'react'
import { connect } from 'react-redux'
import {
  EduButton,
  CustomModalStyled,
  TextInputStyled,
} from '@edulastic/common'
import { Icon } from 'antd'
import {
  ModalContent,
  ModalHeader,
  ModalHeaderTitle,
  CloseIcon,
  ModalFooterContainer,
} from './styled'
import { getTestSelector, setTestDataAction } from '../../ducks'
import { DEFAULT_TEST_TITLE } from '../../utils'
import { StyledInfoMessage } from '../GroupItems/styled'

const TestNameChangeModal = ({
  visible,
  closeModal,
  handleResponse,
  test,
  setData,
  showSaveTitle,
  testNameSaving,
}) => {
  const { title: testName } = test
  const inputRef = useRef(null)
  const Footer = [
    <ModalFooterContainer>
      <EduButton
        onClick={() => {
          if (
            !testName?.trim() ||
            testName?.trim().toLowerCase() === DEFAULT_TEST_TITLE.toLowerCase()
          ) {
            return
          }
          handleResponse()
        }}
        height="36px"
        width="124px"
        fontSize="14px"
        style={{ textTransform: 'none' }}
        loading={testNameSaving}
        disabled={
          !testName?.trim() ||
          testName?.trim().toLowerCase() === DEFAULT_TEST_TITLE.toLowerCase()
        }
      >
        {showSaveTitle ? 'Save' : 'Continue'}
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
      modalWidth="398px"
      modalMaxWidth="398px"
      padding="32px"
      zIndex="2000"
    >
      <ModalHeader>
        <ModalHeaderTitle>
          <span>{showSaveTitle ? 'Save' : 'Enter'} Test Name</span>
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
        <TextInputStyled
          showArrow
          inputRef={inputRef}
          value={testName}
          onChange={(e) => setData({ ...test, title: e.target.value })}
          data-cy="testname-modal"
          size="large"
          placeholder="Enter name here"
          margin="0px"
          width="100%"
          height="40px"
          fontSize="14px"
          bg="transparent"
          onFocus={(event) => {
            event.target.select()
          }}
          style={{ fontWeight: '400' }}
        />
        <StyledInfoMessage>
          <Icon type="info-circle" /> Rename the test to continue
        </StyledInfoMessage>
      </ModalContent>
    </CustomModalStyled>
  )
}

export default connect(
  (state) => ({
    test: getTestSelector(state),
  }),
  {
    setData: setTestDataAction,
  }
)(TestNameChangeModal)
