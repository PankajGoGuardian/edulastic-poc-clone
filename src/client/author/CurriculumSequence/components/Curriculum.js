import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import DropContainer from "../../../assessment/components/DropContainer";
import CurriculumModuleRow from "./CurriculumModuleRow";
import { themes } from "../../../theme";
import { themeColor, white } from "@edulastic/colors";
import { FaBars } from "react-icons/fa";
import { sortableHandle, sortableElement, sortableContainer } from "react-sortable-hoc";

/**
 * @typedef CurriculumProps
 * @property {import('./CurriculumSequence').CurriculumSequenceType} curriculum
 * @property {function} onCollapseExpand
 * @property {string[]} expandedModules
 * @property {boolean} hideEditOptions
 */

export const SortableTestsHandle = sortableHandle(({ clickHandle }) => (
  <DragHandle onClick={e => clickHandle(e, moduleData, index)}>
    <IconHandle>
      <FaBars />
    </IconHandle>
  </DragHandle>
));

const SortableItem = sortableElement(props => {
  const {
    curriculum: { _id: playlistId } = {},
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
    padding,
    id,
    moduleItem,
    onDrop,
    handleTestsSort,
    isReview
  } = props;

  const handleTestSort = prop => handleTestsSort({ ...prop, mIndex: id });

  return (
    <AssignmentItemContainer>
      {isReview && <SortableTestsHandle />}
      <DropContainer theme={themes.default} key={`drop-${id}-${moduleItem._id}`} drop={() => onDrop(id)} borderNone>
        <CurriculumModuleRow
          mode={mode}
          status={status}
          curriculum={curriculum}
          collapsed={expandedModules.indexOf(id) === -1 && status !== "published"}
          onCollapseExpand={onCollapseExpand}
          key={moduleItem._id}
          playlistId={playlistId}
          module={moduleItem}
          moduleIndex={id}
          history={history}
          moduleStatus={modulesStatus[id]}
          padding={padding}
          onBeginDrag={onBeginDrag}
          handleRemove={handleRemove}
          hideEditOptions={hideEditOptions}
          customize={customize}
          handleTestsSort={handleTestSort}
        />
      </DropContainer>
    </AssignmentItemContainer>
  );
});

const SortableContainer = sortableContainer(({ children }) => <ModuleWrapper>{children}</ModuleWrapper>);

/** @extends Component<CurriculumProps> */
const Curriculum = props => {
  const onDrop = toModuleIndex => {
    const { onDrop } = props;
    onDrop(toModuleIndex);
  };

  const { curriculum: { modules } = {}, onSortEnd } = props;

  return (
    <SortableContainer onSortEnd={onSortEnd} lockAxis="y" lockOffset={["0%", "0%"]} lockToContainerEdges useDragHandle>
      {modules &&
        modules.map((moduleItem, index) => (
          <SortableItem moduleItem={moduleItem} index={index} id={index} onDrop={onDrop} {...props} />
        ))}
    </SortableContainer>
  );
};

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

const AssignmentItemContainer = styled.div`
  display: flex;
  width: 100%;
`;

const DragHandle = styled.div`
  color: ${themeColor};
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: ${white};
  padding-top: 0;
  padding-bottom: 0;
  padding-left: 0px;
  padding-right: 0px;
  margin-bottom: 10px;
  margin-top: 10px;
  border-radius: 10px 0 0 10px;
`;

const IconHandle = styled.span`
  font-size: 16px;
`;

ModuleWrapper.displayName = "ModuleWrapper";

export default Curriculum;
