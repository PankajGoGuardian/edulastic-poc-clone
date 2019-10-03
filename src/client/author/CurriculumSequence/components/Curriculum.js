import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import DropContainer from "../../../assessment/components/DropContainer";
import CurriculumModuleRow from "./CurriculumModuleRow";
import { themes } from "../../../theme";

/**
 * @typedef CurriculumProps
 * @property {import('./CurriculumSequence').CurriculumSequenceType} curriculum
 * @property {function} onCollapseExpand
 * @property {string[]} expandedModules
 * @property {boolean} hideEditOptions
 */

/** @extends Component<CurriculumProps> */
class Curriculum extends Component {
  onDrop = toModuleIndex => {
    const { onDrop } = this.props;
    onDrop(toModuleIndex);
  };

  render() {
    const {
      curriculum: { modules, _id: playlistId },
      curriculum,
      hideEditOptions,
      expandedModules,
      onCollapseExpand,
      mode,
      status,
      history,
      customize,
      handleRemove,
      onBeginDrag,
      modulesStatus,
      padding
    } = this.props;

    return (
      <ModuleWrapper>
        {modules &&
          modules.map((moduleItem, index) => (
            <DropContainer
              theme={themes.default}
              key={`drop-${index}-${moduleItem._id}`}
              drop={() => this.onDrop(index)}
            >
              <CurriculumModuleRow
                mode={mode}
                status={status}
                curriculum={curriculum}
                collapsed={expandedModules.indexOf(index) === -1}
                onCollapseExpand={onCollapseExpand}
                key={moduleItem._id}
                playlistId={playlistId}
                module={moduleItem}
                moduleIndex={index}
                history={history}
                moduleStatus={modulesStatus[index]}
                padding={padding}
                onBeginDrag={onBeginDrag}
                handleRemove={handleRemove}
                hideEditOptions={hideEditOptions}
                customize={customize}
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
  customize: PropTypes.bool,
  onBeginDrag: PropTypes.func,
  handleRemove: PropTypes.func,
  modulesStatus: PropTypes.array,
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
