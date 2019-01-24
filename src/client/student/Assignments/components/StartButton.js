import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
//assets
import lockIcon from '../../assets/lock-icon.svg';
// components
import StartButton from '../../styled/AssignmentCardButton';

const AssignmentButton = ({ startDate, t, startTest, attempted, resume }) => {
  const startButtonText = resume
    ? t('common.resume')
    : attempted
    ? t('common.retake')
    : t('common.startAssignment');

  return new Date(startDate) > new Date() ? (
    <NotAvailableButton disabled>
      <img src={lockIcon} alt="" />
      <span>{t('common.lockAssignment')}</span>
    </NotAvailableButton>
  ) : (
    <StartButton onClick={startTest}>
      <span>{startButtonText}</span>
    </StartButton>
  );
};
AssignmentButton.propTypes = {
  startDate: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  startTest: PropTypes.isRequired,
  attempted: PropTypes.bool.isRequired,
  resume: PropTypes.bool.isRequired
};

const NotAvailableButton = styled(StartButton)`
  display: flex;
  justify-content: space-evenly;
  img {
    width: 15px;
    height: 15px;
  }
  span {
    color: #dddddd;
  }
  &:hover {
    background-color: #fff;
    span {
      color: #dddddd;
    }
  }
`;

export default AssignmentButton;
