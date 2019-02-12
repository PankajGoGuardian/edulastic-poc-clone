import React, { Component } from 'react';
import styled from 'styled-components';
import { Menu } from 'antd';
import { Paper } from '@edulastic/common';
import { mobileWidth, lightBlue } from '@edulastic/colors';
import AssignmentDragItem from './AssignmentDragItem';
import triangleIcon from '../assets/triangle.svg';

/**
 * @typedef {object} Props
 * @property {import('./CurriculumSequence').Module} module
 * @property {import('./CurriculumSequence').CurriculumSequence} destinationCurriculum
 * @property {function} onCollapseExpand
 * @property {boolean} collapsed
 * @property {function} addContentToCurriculumSequence
 */

/**
 * @param {Props} props
 */

/** @extends Component<Props> */
class ModuleRow extends Component {
  // NOTE: temporary
  state = {
    checked: false,
    unitExpanded: false, 
    selectedContent: null
  }

  handleChecked = () => {
    this.setState((prevState) => ({ checked: !prevState.checked }));
  }

  handleUnitExpandCollapse = () => {
    this.setState((prevState) => ({ unitExpanded: !prevState.unitExpanded }));
  }

  handleAddContentClick = (moduleData) => {
    this.setState({ selectedContent: moduleData });
  }

  addContentToCurriculumSequence = (toUnit) => {
    const { addContentToCurriculumSequence } = this.props;
    const { selectedContent } = { ...this.state };
    addContentToCurriculumSequence(selectedContent, toUnit);
  }

  render() {
    const { checked, unitExpanded } = this.state;
    const { collapsed, destinationCurriculum, dropContent, module } = this.props;
    const { data, name } = module;
    
    const menu = (
      <Menu>
        {destinationCurriculum.modules.map(moduleItem => (
          <Menu.Item key={`menu-${moduleItem.id}`} onClick={() => this.addContentToCurriculumSequence(moduleItem)}>
            <span>{moduleItem.name}</span>
          </Menu.Item>
        ))}
      </Menu>
    );

    return (
      <ModuleWrapper>
        <Container>
          <Module>
            <ModuleHeader collapsed={collapsed}>
              <span>{name}</span>
              <UnitIcon onClick={this.handleUnitExpandCollapse} rotated={unitExpanded}><img src={triangleIcon} alt="triangle icon " /></UnitIcon>
            </ModuleHeader>
            {unitExpanded && (
              <div>
                {data.map((moduleData, index) => (
                  <AssignmentDragItem
                    key={`${index}-${moduleData.id}`}
                    moduleData={moduleData}
                    handleContentClicked={this.handleAddContentClick}
                    onCheckbox={this.handleChecked}
                    checked={checked}
                    menu={menu}
                    handleDrop={dropContent}
                    onBeginDrag={this.props.onBeginDrag}
                  />
                ))}
              </div>
            )}
          </Module>
        </Container>
      </ModuleWrapper>
    );
  }
}


ModuleRow.defaultProps = {
  module: null,
  onCollapseExpand: () => {},
  collapsed: false,
  padding: false,
  destinationCurriculum: null,
  addContentToCurriculumSequence: () => {}
};

const AssignmentIcon = styled.span`
  border-radius: 4px;
  margin-left: 20px;
  justify-self: flex-end;
  min-width: 19px;
  cursor: pointer;
`;
AssignmentIcon.displayName = 'AssignmentIcon';

const UnitIcon = styled.span`
  border-radius: 4px;
  margin-left: auto;
  min-width: 19px;
  display: flex;
  justify-content: center;
  transition: 0.3s transform;
  transform: ${({ rotated }) => (rotated ? 'rotate(-90deg)' : 'rotate(0deg)')};
  cursor: pointer
`;
UnitIcon.displayName = 'UnitIcon';

const Row = styled(Paper)`
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 20px;
  padding-right: 10px;
  box-shadow: none;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  overflow: auto;
  height: 100%;

  @media (max-width: ${mobileWidth}) {
    margin-right: ${props => !props.value && '20px !important'};
    margin-left: ${props => props.value && '20px !important'};
  }
`;
Container.displayName = 'SelectContentRowModuleContainer';

const Module = styled.div`
  font-size: 13px;
  font-weight: 600;
  border-top: 1px solid ${lightBlue};
`;
Module.displayName = 'SelectContentRowModule';

const ModuleHeader = styled(Row)`
  box-shadow: none;
  display: flex;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const ModuleWrapper = styled.div`
  & {
    padding: 0;
    padding-top: 0;
    padding-bottom: 0;
    padding-right: 20px;
    padding-left: 20px;
  }
  .module-checkbox {
    span {
      margin-right: 23px;
    }
  }
  .module-btn-assigned {
    background-color: ${lightBlue};
    margin-left: auto;
    justifySelf: flex-end;
  }
  .module-btn-expand-collapse {
    border: none;
    box-shadow: none;

  }
`;

export default ModuleRow;
