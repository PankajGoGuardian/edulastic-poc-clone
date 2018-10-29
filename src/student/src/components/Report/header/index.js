import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { IconCaretDown, IconMenuOpenClose } from '@edulastic/icons';
import AssignmentsHeader from '../../commonStyle/assignmentHeader';
import ClassLabel from '../../commonStyle/classLabel';
import AssignmentTitle from '../../commonStyle/assignmentTitle';
import AssignmentFilter from '../../commonStyle/assignmentFilter';
import AssignmentSelectClass from '../../commonStyle/assignmentSelectClass';
import SelectStyle from '../../commonStyle/selectStyle';
import { responsiveSideBar } from '../../../actions/responsivetogglemenu';

const options = ['FFC1', 'FFC2', 'FFC3', 'FFC4', 'FFC5', 'FFC6'];

const AssignmentSelect = () => (
  <AssignmentSelectClass>
    <ClassLabel>class</ClassLabel>
    <SelectStyle>
      {options.map(option => (
        <option> {option} </option>
      ))}
    </SelectStyle>
    <Icon />
  </AssignmentSelectClass>
);

const ReportHeader = ({ flag, responsiveSideBar: responsive }) => (
  <div>
    <AssignmentsHeader flag={flag}>
      <AssignmentHammerger>
        <IconMenu onClick={responsive} />
      </AssignmentHammerger>
      <AssignmentTitle>Reports</AssignmentTitle>
      <AssignmentFilter>
        <AssignmentSelect />
      </AssignmentFilter>
    </AssignmentsHeader>
  </div>
);

export default React.memo(
  connect(
    ({ ui }) => ({ flag: ui.flag }),
    { responsiveSideBar },
  )(ReportHeader),
);

ReportHeader.propTypes = {
  flag: PropTypes.bool.isRequired,
  responsiveSideBar: PropTypes.func.isRequired,
};

const Icon = styled(IconCaretDown)`
  position: absolute;
  left: 11rem;
  top: 0.9rem;
  fill: #12a6e8;
  width: 11px !important;
  height: 11px !important;

  @media (max-width: 900px) {
    left: 10.5rem;
    top: 1.05rem;
  }
  @media (max-width: 425px) {
    left: 8.5rem;
    top: 1.05rem;
  }
  @media (max-width: 320px) {
    left: 8rem;
    top: 1.05rem;
  }
`;

const AssignmentHammerger = styled.div`
  color: #fff;
  font-weight: 700;
  font-size: 1.5rem;
  @media (min-width: 1200px) {
    display: none;
  }
`;

const IconMenu = styled(IconMenuOpenClose)`
  fill: #fff;
  margin-right: 2rem;
  width: 20px !important;
  height: 20px !important;
  cursor: pointer;
  &:hover {
    fill: #fff;
  }
`;
