import React, { Component } from 'react';
import styled from 'styled-components';
import DropContainer from '../../../assessment/components/DropContainer';
import CurriculumModuleRow from './CurriculumModuleRow';

/**
 * @typedef CurriculumProps
 * @property {import('./CurriculumSequence').CurriculumSequenceType} curriculum
 * @property {function} onCollapseExpand
 * @property {string[]} expandedModules
 */

/** @extends Component<CurriculumProps> */
class Curriculum extends Component {
  onDrop = (toModule) => {
    this.props.onDrop(toModule);
  }

  render() {
    const { curriculum: { title, modules } } = this.props;
    const { expandedModules, onCollapseExpand, padding } = this.props;

    return (
      <ModuleWrapper>
          {modules.map(moduleItem => (
            <DropContainer key={`drop-${moduleItem.id}`} drop={() => this.onDrop(moduleItem)}>
              <CurriculumModuleRow
                collapsed={expandedModules.indexOf(moduleItem.id) === -1}
                onCollapseExpand={onCollapseExpand}
                key={moduleItem.id}
                module={moduleItem}
                padding={padding}
              />
            </DropContainer>
          ))}
      </ModuleWrapper>
    );
  }
}

const ModuleWrapper = styled.div`
  flex-grow: 1;
  width: 60%;
`;

export default Curriculum;
