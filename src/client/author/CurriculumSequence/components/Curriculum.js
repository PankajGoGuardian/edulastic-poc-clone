import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import DropContainer from "../../../assessment/components/DropContainer";
import CurriculumModuleRow from "./CurriculumModuleRow";
import { theme } from "../theme";

/**
 * @typedef CurriculumProps
 * @property {import('./CurriculumSequence').CurriculumSequenceType} curriculum
 * @property {function} onCollapseExpand
 * @property {string[]} expandedModules
 * @property {boolean} hideEditOptions
 */

/** @extends Component<CurriculumProps> */
class Curriculum extends Component {
  onDrop = toModule => {
    const { onDrop } = this.props;
    onDrop(toModule);
  };

  render() {
    const {
      curriculum: { modules, _id: playlistId },
      hideEditOptions,
      expandedModules,
      onCollapseExpand,
      mode,
      status,
      history,
      padding
    } = this.props;

    return (
      <ModuleWrapper>
        {modules &&
          modules.map((moduleItem, index) => (
            <DropContainer theme={theme} key={`drop-${index}-${moduleItem.id}`} drop={() => this.onDrop(moduleItem)}>
              <CurriculumModuleRow
                mode={mode}
                status={status}
                collapsed={expandedModules.indexOf(index) === -1}
                onCollapseExpand={onCollapseExpand}
                key={moduleItem._id}
                playlistId={playlistId}
                module={moduleItem}
                moduleIndex={index}
                history={history}
                padding={padding}
                hideEditOptions={hideEditOptions}
              />
            </DropContainer>
          ))}
      </ModuleWrapper>
    );
  }
}

Curriculum.propTypes = {
  onDrop: PropTypes.func.isRequired,
  curriculum: PropTypes.object.isRequired,
  expandedModules: PropTypes.array.isRequired,
  padding: PropTypes.bool.isRequired,
  mode: PropTypes.string,
  status: PropTypes.string,
  history: PropTypes.object,
  onCollapseExpand: PropTypes.func.isRequired
};

const ModuleWrapper = styled.div`
  flex-grow: 1;
  width: 60%;
  z-index: 1;
  margin-top: -1px;
`;
ModuleWrapper.displayName = "ModuleWrapper";

export default Curriculum;
