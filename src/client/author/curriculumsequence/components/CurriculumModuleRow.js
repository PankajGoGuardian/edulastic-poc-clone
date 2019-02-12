import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';
import { Button, Icon } from 'antd';
import {
  Paper,
  Checkbox
} from '@edulastic/common';
import { random } from 'lodash';
import { withNamespaces } from '@edulastic/localization';
import { darkBlue, mobileWidth, lightBlue, mainBlueColor, lightGreen, green, white, darkBlueSecondary, greenDarkSecondary } from '@edulastic/colors';
import { toggleCheckedUnitItemAction } from '../ducks';
import minusIcon from '../assets/minus.svg';
import plusIcon from '../assets/plus.svg';
import assignIcon from '../assets/assign.svg';
import visualizationIcon from '../assets/visualization-show.svg';
import assessmentRed from '../assets/assessment.svg';
import assessmentGreen from '../assets/concept-check.svg';
import moduleCompletedIcon from '../assets/module-completed.svg';


/**
 * @typedef {object} Props
 * @property {import('./CurriculumSequence').Module} module
 * @property {function} onCollapseExpand
 * @property {function} toggleUnitItem
 * @property {boolean} collapsed
 * @property {string[]} checkedUnitItems
 * @property {boolean} isContentExpanded
 */

 const IS_ASSIGNED = 'ASSIGNED';
 const NOT_ASSIGNED = 'ASSIGN';

/** @extends Component<Props> */
class ModuleRow extends Component {
  render() {
    const { completed, data, name, id } = this.props.module;
    const { onCollapseExpand, collapsed, padding, checkedUnitItems, toggleUnitItem, isContentExpanded } = this.props;
    const totalAssigned = data.length;
    const numberOfAssigned = data.filter(item => item.assigned).length;
    const [whichModule, moduleName ] = name.split(':');

    return (
      <ModuleWrapper padding={padding}>
        <Container>
          <Module>
            <ModuleHeader collapsed={collapsed}>
              <ModuleInfo>
                <Button type="primary" ghost className="module-btn-expand-collapse" onClick={() => onCollapseExpand(id)}>
                  {!collapsed
                    ? <img src={minusIcon} alt="collapse module " />
                    : <img src={plusIcon} alt="expand module " />
                  }
                </Button>
                <ModuleTitleAssignedWrapper>
                  <ModuleTitleWrapper>
                  <ModuleTitlePrefix>{whichModule}</ModuleTitlePrefix>
                  <ModuleTitle>{moduleName}</ModuleTitle>
                </ModuleTitleWrapper>

                {completed && 
                  <React.Fragment>
                    <ModuleCompleted>
                    <ModuleCompletedLabel> 
                    MODULE COMPLETED 
                    </ModuleCompletedLabel> 
                    <ModuleCompletedIcon>
                    <img src={moduleCompletedIcon} alt=""/>
                    </ModuleCompletedIcon>
                    </ModuleCompleted>
                  </React.Fragment>
                }
                {!completed && 
                  <React.Fragment>
                    <ModulesAssigned>
                      Assigned
                      <NumberOfAssigned>{numberOfAssigned}</NumberOfAssigned>
                      of
                      <TotalAssigned>{totalAssigned}</TotalAssigned>
                    </ModulesAssigned>
                    <AssignModuleButton>
                      <Button type="primary" ghost>ASSIGN MODULE</Button>
                    </AssignModuleButton>
                  </React.Fragment>
                }
                 

                </ModuleTitleAssignedWrapper>

              </ModuleInfo>
            </ModuleHeader>
            {!collapsed &&
            // eslint-disable-next-line
              <div>
                {data.map((moduleData, index) => {
                  return (
                    <Assignment key={`${index}-${moduleData.id}`}>
                      <AssignmentInnerWrapper>
                        <ModuleFocused />
                        <Checkbox
                          onChange={() => toggleUnitItem(moduleData.id)}
                          checked={checkedUnitItems.indexOf(moduleData.id) !== -1}
                          className="module-checkbox"
                        />
                        <AssignmentContent expanded={isContentExpanded}>
                          <ModuleDataName>{moduleData.name}</ModuleDataName>
                        </AssignmentContent>
                        <AssignmentIconsWrapper expanded={isContentExpanded}>
                          <ModuleAssignedUnit>
                            {moduleData.assigned && !moduleData.completed &&
                              <img src={assessmentRed} alt="Module item is assigned" />
                            }
                            {moduleData.completed &&
                              <img src={assessmentGreen} alt="Module item is completed" />
                            }
                          </ModuleAssignedUnit>
                          <AssignmentIcon><img src={visualizationIcon} alt="visualize " /></AssignmentIcon>
                          <AssignmentButton><Button onClick={this.handleAssigned} type="primary" icon={moduleData.assigned ? 'check' : 'arrow-right'} ghost={!moduleData.assigned}>{moduleData.assigned ? IS_ASSIGNED : NOT_ASSIGNED}</Button></AssignmentButton>
                          <AssignmentIcon><Icon type="ellipsis" style={{ fontSize: '16px', color: '#08c' }} /></AssignmentIcon>
                        </AssignmentIconsWrapper>
                      </AssignmentInnerWrapper>
                    </Assignment>
                  )
                })}
                <ModuleFooter />
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
  onCollapseExpand: () => { },
  collapsed: false,
  isContentExpanded: false,
  padding: false,
  checkedUnitItems: []
};

const ModuleFocused = styled.div`
  border-left: 5px solid ${greenDarkSecondary};
  width: 5px;
  position: absolute;
  height: 100%;
  left: 0;
  margin: 0;
  padding: 0;
  top: 0;
  opacity: 0;
`;

const ModuleAssignedUnit = styled.span`
  justify-self: flex-start;
  margin-right: auto;
`;

const ModuleTitleWrapper = styled.div`
display: flex;
flex-direction: column;
`;

const ModuleCompletedLabel = styled.div`
color: #4aac8b;
`;

const ModuleCompletedIcon = styled.div`
padding-left: 30px;
padding-right: 30px;
`;

const ModuleCompleted = styled.div`
display: flex;
justify-content: flex-end;
margin-left: auto;
width: auto;
align-items: center;
`;

const NumberOfAssigned = styled.strong`
  padding-left: 4px;
  padding-right: 4px;
  font-weight: bolder;
`;

const TotalAssigned = styled.strong`
  padding-left: 4px;
  font-weight: bolder;
`;

const AssignmentButton = styled.div`
  min-width: 121px;
  .ant-btn {
    min-width: 121px;
    display: flex;
    align-items: center;
    i {
      position: absolute;
      position: absolute;
      left: 6px;
      display: flex;
      align-items: center;
    }
    span {
      margin-left: auto;
      margin-right: auto;
      font-size: 12px;
      font-weight: 600;
    }
  }
`;

const AssignModuleButton = styled.div`
  align-self: center;
  .ant-btn {
    min-height: 30px;
    font-size: 10px;
    margin-right: 20px;
  }
`;

const AssignmentContent = styled.div`
  flex-direction: row;
  display: flex;
  min-width: ${(props) => !props.expanded ? '30%' : '45%'};
  @media only screen and (max-width: 845px) {
    flex-direction: column;
  }
`;

const ModuleTitle = styled.div`
  display: flex;
  justify-self: flex-start;
  align-items: center;
`;

const ModuleTitleAssignedWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  @media only screen and (max-width: 845px) {
    flex-direction: column;
  }
`;

const ModuleTitlePrefix = styled.div`
    font-weight: 300;
`;

const ModuleDataName = styled.div`
      min-width: 280px;
      font-weight: 300;
  @media only screen and (max-width: 845px) {
    order: 2;
  }
`;

const ModuleInfo = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  padding-bottom: 15px;
`;

const AssignmentIconsWrapper = styled.div`
  margin-left: auto;
  padding: 0px;
  display: inline-flex;
  width: ${(props) => !props.expanded ? '70%' : '55%'};
  display: flex;
  justify-content: flex-end;

`;

const AssignmentIcon = styled.span`
  margin-left: 10px;
  margin-right: 10px;
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
  position: relative;
`;

const Assignment = styled(Row)`
  border-radius: 0;
  padding-left: 30px;
  padding-right: 30px;
  padding-top: 0;
  &:active ${ModuleFocused},
  &:focus ${ModuleFocused},
  &:hover ${ModuleFocused} {
    opacity: 1;
  }
`;
Assignment.displayName = 'Assignment';

const AssignmentInnerWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background-color: #FBFBFB;
  border: 1px solid #F5F5F5;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  .module-checkbox {
    align-self: center;
  }
  & div, & span {
    align-items: center;
  }
  @media only screen and (max-width: 845px) {
    align-items: flex-start;
    justify-items: flex-start;
    .module-checkbox {
      align-self: flex-start;
    }
  }
`;
AssignmentInnerWrapper.displayName = 'AssignmentInnerWrapper';


const ModuleFooter = styled(Assignment)`
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  color: ${white};
  display: flex;
  /* padding-bottom: 0; */
`;

const ModulesAssigned = styled.div`
  font-size: 12px;
  display: flex;
  align-items: center;
  padding-right: 20px;
  padding-left: 20px;
  font-weight: 100;
  color: #000;
  margin-left: auto;
  justify-self: flex-end;
  line-height: 2.4;
  min-width: 123px;
  max-height: 30px;
  margin-top: auto;
  margin-bottom: auto;
  @media only screen and (max-width: 845px) {
    justify-self: flex-start;
    margin-left: 0;
    margin-right: auto;
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

const mapDispatchToProps = dispatch => ({
  toggleUnitItem(id) {
    dispatch(toggleCheckedUnitItemAction(id));
  }
});

const enhance = compose(
  connect(
    ({ curriculumSequence }) => ({
      checkedUnitItems: curriculumSequence.checkedGuideUnits,
      isContentExpanded: curriculumSequence.isContentExpanded
    }),
    mapDispatchToProps
  )
);

export default enhance(ModuleRow);
