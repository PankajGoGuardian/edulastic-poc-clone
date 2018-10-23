import React from 'react';
import styled from 'styled-components';
import { IconCaretDown } from '@edulastic/icons';
import AssignmentsHeader from '../common/header';
import AssignmentTitle from '../common/assignmentTitle';
import AssignmentFilter from '../common/assignmentFilter';
import AssignmentSelectClass from '../common/assignmentSelectClass';
import SelectStyle from '../common/selectStyle';
import FilterBtn from '../common/filterBtn';

class Header extends React.Component {
  render() {
    return (
      <AssignmentsHeader>
        <AssignmentTitle>Assignments</AssignmentTitle>
        <AssignmentFilter>
          <AssignmentSelectClass>
            <ClassLabel>class</ClassLabel>
            <SelectStyle>
              <option>FFC1</option>
              <option>FFC2</option>
              <option>FFC3</option>
              <option>FFC4</option>
              <option>FFC5</option>
              <option>FFC6</option>
            </SelectStyle>
            <Icon />
          </AssignmentSelectClass>
          <AssignmentFilterBtn>
            <StatusSelect>
              <select>
                <option>qwdq</option>
                <option>qwdq</option>
                <option>qwdq</option>
                <option>qwdq</option>
                <option>qwdq</option>
              </select>
            </StatusSelect>
            <FilterBtn>
              <Number>6</Number>
              <span>ALL</span>
            </FilterBtn>
            <FilterBtn>
              <Number>6</Number>
              <span>NOT STARTED</span>
            </FilterBtn>
            <FilterBtn>
              <Number>9</Number>
              <span>IN PROGRESS</span>
            </FilterBtn>
            <FilterBtn>
              <Number>0</Number>
              <span>SUBMITTED</span>
            </FilterBtn>
            <FilterBtn>
              <Number>0</Number>
              <span>GRADED</span>
            </FilterBtn>
          </AssignmentFilterBtn>
        </AssignmentFilter>
      </AssignmentsHeader>
    );
  }
}

export default Header;

const ClassLabel = styled.span`
  line-height: 2.4rem;
  text-align: center;
  width: 53%;
  color: rgb(67, 75, 93);
  font-weight: 600;
  background-color: rgb(229, 229, 229);
`;

const AssignmentFilterBtn = styled.div`
  float: right;
`;

const StatusSelect = styled.div`
  display: none;
  @media (max-width: 875px) {
    display: block;
    float: right;
    & select {
      position: relative;
      margin-right: 0;
      border: none;
      padding-left: 2rem;
      padding-right: 3.5rem;
      height: 2.7rem;
      border-radius: 2rem;
      background-color: #fff;
      box-shadow: 0 0.2rem 0.5rem rgba(0, 0, 0, 0.07);
      outline: none;
    }
  }
`;

const Number = styled.span`
  font-size: 1.3rem !important;
`;

const Icon = styled(IconCaretDown)`
   {
    position: absolute;
    left: 8.6rem;
    top: 1rem;
    fill: #12a6e8;
    width: 11px !important;
    height: 11px!Important;
  }
`;
