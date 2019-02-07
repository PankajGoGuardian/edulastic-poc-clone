import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'antd';
import {
  Paper,
  Checkbox
} from '@edulastic/common';
import { random } from 'lodash';
import { withNamespaces } from '@edulastic/localization';
import { darkBlue, mobileWidth, lightBlue, mainBlueColor, lightGreen, green, white, darkBlueSecondary } from '@edulastic/colors';
import minusIcon from '../assets/minus.svg';
import plusIcon from '../assets/plus.svg';
import assignIcon from '../assets/assign.svg';
import visualizationIcon from '../assets/visualization-show.svg';
import triangleIcon from '../assets/triangle.svg';
import infoIcon from '../assets/info.svg';

/**
 * @typedef {object} Props
 * @property {import('./CurriculumSequence').Module} module
 * @property {function} onCollapseExpand
 * @property {boolean} collapsed
 */


/** @extends Component<Props> */
class ModuleRow extends Component {
  progressValue = random(0, 100);

  state = {
    checked: false
  }

  handleChecked = () => {
    this.setState((prevState) => ({ checked: !prevState.checked }));
  }

  render() {
    const { checked } = this.state;
    const { assigned, data, name, id } = this.props.module;
    const { onCollapseExpand, collapsed, padding } = this.props;

    return (
      <ModuleWrapper padding={padding}>
        <Container>
          <Module>
            <ModuleHeader collapsed={collapsed}>
              <ModuleInfo>
                <Checkbox checked={checked} onChange={this.handleChecked} className="module-checkbox" />
                <ModuleTitleAssignedWrapper>
                  <ModuleTitle>{name}</ModuleTitle>
                  <ModulesAssigned>Assigned 2 of 3</ModulesAssigned>
                </ModuleTitleAssignedWrapper>
                <Button type="primary" ghost className="module-btn-expand-collapse" onClick={() => onCollapseExpand(id)}>
                  {!collapsed
                    ? <img src={minusIcon} alt="collapse module " />
                    : <img src={plusIcon} alt="expand module " />
                  }
                </Button>
              </ModuleInfo>
              <AssignmentProgress width={`${this.progressValue}%`} />
            </ModuleHeader>
            {!collapsed &&
              <div>
                {data.map((moduleData) => {
                  return (
                    <Assignment key={module.id}>
                      <Checkbox onChange={() => { }} className="module-checkbox" />
                      <AssignmentContent>
                        <AssignmentPrefix>{moduleData.standards}</AssignmentPrefix>
                        <ModuleDataName>{moduleData.name}</ModuleDataName>
                      </AssignmentContent>
                      <AssignmentIconsWrapper>
                        <AssignmentIcon><img src={assignIcon} alt="checkbox " /></AssignmentIcon>
                        <AssignmentIcon><img src={visualizationIcon} alt="visualize " /></AssignmentIcon>
                        <AssignmentIcon><img src={triangleIcon} alt="triangle icon " /></AssignmentIcon>
                      </AssignmentIconsWrapper>
                    </Assignment>
                  )
                })}
                <ModuleFooter>
                  <Icon><img src={infoIcon} alt="info " /></Icon>
                  <p>UNIT ASSESSMENT (42 QUESTIONS): Unit 1: Understanding Equations & Inequalities</p>
                </ModuleFooter>
              </div>
            }
          </Module>
        </Container>
      </ModuleWrapper>
    );
  }
};

ModuleRow.defaultProps = {
  module: null,
  onCollapseExpand: () => {},
  collapsed: false,
  padding: false
};

const AssignmentContent = styled.div`
  flex-direction: row;
  display: flex;
  @media only screen and (max-width: 845px) {
    flex-direction: column;
  }
`;

const ModuleTitle = styled.div`
  display: flex;
  justify-self: flex-start;
`;

const ModuleTitleAssignedWrapper = styled.div`
  display: flex;
  /* justify-content: space-between; */
  flex-grow: 1;
  @media only screen and (max-width: 845px) {
    flex-direction: column;
  }
`;

const ModuleDataName = styled.div`
  @media only screen and (max-width: 845px) {
    order: 2;
  }
`;

const ModuleInfo = styled.div`
  display: flex;
  width: 100%;
`;

const AssignmentProgress = styled.div`
  width: ${({ width }) => width};
  height: 5px;
  background-color: ${mainBlueColor};
  margin-top: 10px;
  display: flex;
  align-self: flex-start;
  margin-left: -20px;
`;

const Icon = styled.span`
  margin-right: 50px;
`;

const AssignmentIconsWrapper = styled.div`
  margin-left: auto;
  justify-self: flex-end;
  padding: 0 20px;
  display: inline-flex;
`;

const AssignmentIcon = styled.span`
  margin-left: 20px;
`;

const Row = styled(Paper)`
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 20px;
  padding-right: 10px;
  box-shadow: none;
  align-items: center;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  overflow: auto;
  height: 100%;

  @media (max-width: ${mobileWidth}) {
    padding-left: 10px;
    margin-right: ${props => !props.value && "20px !important"};
    margin-left: ${props => props.value && "20px !important"};
  }
`;

const Module = styled.div`
  font-size: 13px;
  font-weight: 600;
`;

const ModuleHeader = styled(Row)`
  box-shadow: none;
  display: flex;
  flex-direction: column;
  border-bottom-left-radius: ${({ collapsed }) =>
    !collapsed ? "0px" : "10px"};
  border-bottom-right-radius: ${({ collapsed }) =>
    !collapsed ? "0px" : "10px"};
  padding-bottom: 0;
  overflow: hidden;
`;

const Assignment = styled(Row)`
  display: flex;
  border-radius: 0;
  align-items: center;
  .module-checkbox {
    align-self: center;
  }
  @media only screen and (max-width: 845px) {
    align-items: flex-start;
    justify-items: flex-start;
    .module-checkbox {
      align-self: flex-start;
    }
  }
`;

const ModuleFooter = styled(Assignment)`
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: ${darkBlueSecondary};
  color: ${white};
  display: flex;
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 10px;
`;

const ModulesAssigned = styled.div`
  font-size: 10px;
  font-weight: 700;
  border-radius: 4px;
  background-color: ${lightBlue};
  display: flex;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  color: ${darkBlue};
  text-transform: uppercase;
  margin-left: auto;
  justify-self: flex-end;
  line-height: 2.4;
  @media only screen and (max-width: 845px) {
    justify-self: flex-start;
    margin-left: 0;
    margin-right: auto;
  }
`;

const AssignmentPrefix = styled(ModulesAssigned)`
  background-color: ${lightGreen};
  justify-self: flex-start;
  margin-left: 0;
  margin-right: 20px;
  color: ${green};
  min-width: 80px;
  line-height: 2.4;
  align-self: center;
  justify-content: center;
  @media only screen and (max-width: 845px) {
    margin-bottom: 10px;
    align-self: flex-start;
    order: 1;
  }
`;

const ModuleWrapper = styled.div`
  & {
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 0px;
    padding-right: ${({ padding }) => (padding ? "20px" : "0px")};
    margin-bottom: 20px;
    margin-top: 20px;
  }
  .module-checkbox {
    span {
      margin-right: 23px;
    }
  }
  .module-btn-assigned {
    background-color: ${lightBlue};
    margin-left: auto;
    justifyself: flex-end;
  }
  .module-btn-expand-collapse {
    border: none;
    box-shadow: none;
  }
`;

const ButtonText = styled.div`
  text-transform: uppercase;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 10px;
  font-weight: 600;
`;

export default ModuleRow;
