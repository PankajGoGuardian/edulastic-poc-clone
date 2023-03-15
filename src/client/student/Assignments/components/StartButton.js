import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Tooltip } from 'antd'
import { borders, mobileWidthMax } from '@edulastic/colors'
// assets
import lockIcon from '../../assets/lock-icon.svg'
// components
import StartButton from '../../styled/AssignmentCardButton'

const AssignmentButton = ({
  startDate,
  t,
  startTest,
  attempted,
  resume,
  isPaused,
  assessment,
  serverTimeStamp,
  isTimeWindowRestricted = false,
  restrictedButtonText,
  restrictedButtonTooltip,
}) => {
  const startButtonText = resume
    ? t('common.resume')
    : attempted
    ? t('common.retake')
    : t('common.startAssignment')
  const isTimeExpired = new Date(startDate) > new Date(serverTimeStamp)
  const isNotStarted = !startDate
  let lockButtonText = ''
  let buttonTooltip = null
  if (isPaused) {
    lockButtonText = ' (Paused)'
    buttonTooltip = 'Will be available once teacher resumes the test for you'
  }
  if (isTimeWindowRestricted) {
    lockButtonText = restrictedButtonText
    buttonTooltip = restrictedButtonTooltip
  }
  // Enable start button based on server time stamp and start date
  return isTimeExpired || isNotStarted || isPaused || isTimeWindowRestricted ? (
    <Tooltip placement="left" title={buttonTooltip}>
      <NotAvailableButton disabled>
        <span>
          <img src={lockIcon} alt="" />
        </span>
        <span data-cy="lockAssignment">
          {t('common.lockAssignment')}
          {lockButtonText}
        </span>
      </NotAvailableButton>
    </Tooltip>
  ) : (
    <StartButton onClick={startTest} assessment={assessment}>
      <span data-cy="assignmentButton">{startButtonText}</span>
    </StartButton>
  )
}
AssignmentButton.propTypes = {
  startDate: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  startTest: PropTypes.isRequired,
  attempted: PropTypes.bool.isRequired,
  resume: PropTypes.bool.isRequired,
}

const NotAvailableButton = styled(StartButton)`
  display: flex;
  justify-content: space-evenly;
  height: 40px;
  margin-top: 5px;
  &.ant-btn[disabled] {
    background: transparent;
    position: relative;
    padding-left: 40px;
    border-color: ${borders.primary};
    width: auto;

    @media screen and (max-width: ${mobileWidthMax}) {
      margin-top: 10px;
      margin-left: 0px;
    }

    span {
      color: ${borders.primary};

      img {
        position: absolute;
        top: 50%;
        left: 12px;
        transform: translateY(-50%);
      }
    }
  }

  span {
    img {
      width: 15px;
      height: 15px;
    }
  }
  span {
    color: ${(props) => props.theme.assignment.cardNotAvailabelBtnTextColor};
  }
  &:hover {
    background-color: ${(props) =>
      props.theme.assignment.cardNotAvailabelBtnBgColor};
    span {
      color: ${(props) => props.theme.assignment.cardNotAvailabelBtnTextColor};
    }
  }
`

export default AssignmentButton
