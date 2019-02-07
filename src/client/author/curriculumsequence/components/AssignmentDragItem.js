import React, { Component  } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'antd';
import styled from 'styled-components';
import { DragSource } from 'react-dnd';
import {
  Checkbox,
  Paper
} from '@edulastic/common';
import { darkBlue, lightBlue, lightGreen, green } from '@edulastic/colors';
import addUnit from '../assets/add-unit.svg';
import visualizationIcon from '../assets/visualization-show.svg';

/**
 * @typedef Props
 * @property {function} onCheckbox
 * @property {Object} moduleData
 * @property {boolean} checked
 * @property {function} handleContentClicked
 * @property {Component} menu
 */

const itemSource = {
  beginDrag(props) {
    const { moduleData, onBeginDrag } = props;
    onBeginDrag({ ...moduleData });
    return { moduleData };
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()

  }
}

/** @extends Component<Props> */
class AssignmentDragItem extends Component {
  render() {
    const { moduleData, checked, onCheckbox, handleContentClicked, menu } = this.props;
    const { connectDragSource } = this.props;
    return (
      connectDragSource(
        <div className="item">
          <Assignment key={moduleData.id}>
            <Checkbox checked={checked} onChange={onCheckbox} className="module-checkbox" />
            <AssignmentPrefix>{moduleData.standards}</AssignmentPrefix>
            <span>{moduleData.name}</span>
            <AssignmentIconsWrapper>
              <Dropdown overlay={menu} placement="bottomCenter">
                <AddContentIcon onMouseOver={() => handleContentClicked(moduleData)} onClick={() => this.handleAddContentClick(moduleData)}><img src={addUnit} alt="Add content " /></AddContentIcon>
              </Dropdown>
              <AssignmentIcon><img src={visualizationIcon} alt="visualize " /></AssignmentIcon>
            </AssignmentIconsWrapper>
          </Assignment>
        </div>
      )
    );
  }
}

export default DragSource('item', itemSource, collect)(AssignmentDragItem);

const AddContentIcon = styled.div`
  border-radius: 4px;
  margin-left: 20px;
  justify-self: flex-end;
  min-width: 19px;
  cursor: pointer;
`;


const AssignmentIconsWrapper = styled.div`
  margin-left: auto;
  justify-self: flex-end;
  padding-right: 0;
  display: inline-flex;
`;

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

const Module = styled.div`
  font-size: 13px;
  font-weight: 600;
  border-top: 1px solid ${lightBlue};
}
`;
Module.displayName = 'SelectContentRowModule';

const ModuleHeader = styled(Row)`
  box-shadow: none;
  display: flex;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const Assignment = styled(Row)`
    display: flex;
    align-items: center;
    border: 0;
    border-radius: 0;
    padding-top: 10px;
    padding-bottom: 10px;
`;


const ModulesAssigned = styled.div`
  font-size: 10px;
  font-weight: 700;
  background-color: ${lightBlue}
  display: flex;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  color: ${darkBlue};
  text-transform: uppercase;
  margin-left: auto;
  justify-self: flex-end;
`;

const AssignmentPrefix = styled(ModulesAssigned)`
  font-size: 10px;
  font-weight: 700;
  min-width: 80px;
  justify-content: center;
  background-color: ${lightGreen};
  justify-self: flex-start;
  margin-left: 0;
  margin-right: 20px;
  color: ${green}
  border-radius: 4px;
  line-height: 2.4;
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