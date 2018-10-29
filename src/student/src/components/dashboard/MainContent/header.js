import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IconCaretDown } from '@edulastic/icons';
import AssignmentTitle from '../common/assignmentTitle';
import AssignmentFilter from '../common/assignmentFilter';
import AssignmentSelectClass from '../common/assignmentSelectClass';
import SelectStyle from '../common/selectStyle';
import FilterBtn from '../common/filterBtn';

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

const Header = ({ flag }) => (
  <AssignmentsHeader flag={flag}>
    <AssignmentTitle>Assignments</AssignmentTitle>
    <AssignmentFilter>
      <AssignmentSelect />
      <AssignmentFilterBtn>
        <StatusSelect>
          <select>
            <option>6 ALL</option>
            <option>qwdq</option>
            <option>qwdq</option>
            <option>qwdq</option>
            <option>qwdq</option>
          </select>
          <StatusSelectIcon />
        </StatusSelect>
        <FilterBtn>
          <Number>6</Number>
          <span>ALL</span>
        </FilterBtn>
        <FilterBtn>
          <NumberNotStarted>6</NumberNotStarted>
          <span>NOT STARTED</span>
        </FilterBtn>
        <FilterBtn>
          <NumberProgress>9</NumberProgress>
          <span>IN PROGRESS</span>
        </FilterBtn>
        <FilterBtn>
          <NumberSubmitted>0</NumberSubmitted>
          <span>SUBMITTED</span>
        </FilterBtn>
        <FilterBtn>
          <NumberGraded>0</NumberGraded>
          <span>GRADED</span>
        </FilterBtn>
      </AssignmentFilterBtn>
    </AssignmentFilter>
  </AssignmentsHeader>
);
export default React.memo(connect(({ ui }) => ({ flag: ui.flag }))(Header));

Header.propTypes = {
  flag: PropTypes.bool.isRequired,
};

const AssignmentsHeader = styled.div`
  @media (min-width: 1200px) {
    position: fixed;
    top: 0;
    left: ${props => (props.flag ? '7rem' : '16.3rem')};
    right: 0;
    align-items: center;
    padding: 1.45rem 1.5rem;
    background-color: #f3f3f3;
  }
  @media (max-width: 1200px) {
    margin-left: 1.5rem;
    margin-right: 1.5rem;
  }
  @media (max-width: 480px) {
    margin: 0rem 1rem;
  }
`;

const ClassLabel = styled.span`
  line-height: 2.5rem;
  text-align: center;
  width: 43%;
  color: rgb(67, 75, 93);
  font-weight: 600;
  font-size: 0.9rem;
  background-color: rgb(229, 229, 229);
  @media (max-width: 900px) {
    line-height: 3rem;
    width: 40%;
  }
  @media (max-width: 768px) {
    width: 50%;
  }
`;

const AssignmentFilterBtn = styled.div`
  float: right;
`;

const StatusSelect = styled.div`
  display: none;
  float: right;
  & select {
    position: relative;
    margin-right: 0;
    border: none;
    width: 10rem;
    height: 2.7rem;
    border-radius: 1rem;
    background-color: #fff;
    box-shadow: 0 0.2rem 0.5rem rgba(0, 0, 0, 0.07);
    outline: none;
    -webkit-appearance: none;
    padding: 0rem 1rem;
  }
  @media (max-width: 900px) {
    display: block;
    & select {
      width: 12rem;
    }
  }
  @media (max-width: 768px) {
    display: block;
    & select {
      width: 11rem;
    }
  }
  @media (max-width: 480px) {
    display: block;
    & select {
      width: 11rem;
    }
  }
  @media (max-width: 480px) {
    display: block;
    & select {
      width: 9rem;
    }
  }
`;

const Number = styled.span`
  font-size: 1.3rem !important;
`;
const NumberNotStarted = Number.extend`
  color: #ee1658 !important;
`;
const NumberProgress = Number.extend`
  color: #12a6e8 !important;
`;
const NumberSubmitted = Number.extend`
  color: #e8a812 !important;
`;
const NumberGraded = Number.extend`
  color: #4aac8b !important;
`;

const Icon = styled(IconCaretDown)`
  position: absolute;
  left: 8rem;
  top: 0.9rem;
  fill: #12a6e8;
  width: 11px !important;
  height: 11px !important;

  @media (max-width: 900px) {
    left: 10.5rem;
    top: 1.17rem;
  }
  @media (max-width: 768px) {
    left: 8.5rem;
  }
`;

const StatusSelectIcon = styled(IconCaretDown)`
  @media (max-width: 900px) {
    position: absolute;
    fill: #12a6e8;
    width: 11px !important;
    height: 11px !important;
    right: 3rem;
    top: 7.2rem;
  }
`;
