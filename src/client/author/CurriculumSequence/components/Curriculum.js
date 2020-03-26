import { themeColor, white } from "@edulastic/colors";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { Prompt } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { sortableContainer, sortableElement, sortableHandle } from "react-sortable-hoc";
import styled from "styled-components";
import DropContainer from "../../../assessment/components/DropContainer";
import { themes } from "../../../theme";
import CurriculumModuleRow from "./CurriculumModuleRow";

/**
 * @typedef CurriculumProps
 * @property {import('./CurriculumSequence').CurriculumSequenceType} curriculum
 * @property {function} onCollapseExpand
 * @property {string[]} expandedModules
 * @property {boolean} hideEditOptions
 */

export const SortableTestsHandle = sortableHandle(({ clickHandle, hasDescription }) => (
  <DragHandle onClick={e => clickHandle(e)}>
    <IconHandle hasDescription={hasDescription}>
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
    isReview,
    urlHasUseThis,
    summaryData,
    playlistMetrics,
    playlistClassList,
    isManageContentActive,
    hasEditAccess
  } = props;

  const handleTestSort = prop => handleTestsSort({ ...prop, mIndex: id });
  return (
    <AssignmentItemContainer>
      {isReview && <SortableTestsHandle hasDescription={moduleItem.description} />}
      <DropContainer
        theme={themes.default}
        key={`drop-${id}-${moduleItem._id}`}
        drop={(arg1, item) => {
          onDrop(id, item);
        }}
        isPlaylist
      >
        <CurriculumModuleRow
          mode={mode}
          status={status}
          curriculum={curriculum}
          collapsed={expandedModules.indexOf(id) === -1}
          onCollapseExpand={onCollapseExpand}
          key={moduleItem._id}
          playlistId={playlistId}
          module={moduleItem}
          moduleIndex={id}
          history={history}
          moduleStatus={modulesStatus.includes(moduleItem._id)}
          padding={padding}
          onBeginDrag={onBeginDrag}
          handleRemove={handleRemove}
          hideEditOptions={hideEditOptions}
          customize={customize}
          handleTestsSort={handleTestSort}
          urlHasUseThis={urlHasUseThis}
          isManageContentActive={isManageContentActive}
          summaryData={summaryData}
          playlistMetrics={playlistMetrics}
          playlistClassList={playlistClassList}
          hasEditAccess={hasEditAccess}
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

  const { curriculum: { modules } = {}, onSortEnd, manageContentDirty, resetDestination } = props;

  useEffect(() => () => resetDestination(), []);

  return (
    <SortableContainer onSortEnd={onSortEnd} lockAxis="y" lockOffset={["0%", "0%"]} lockToContainerEdges useDragHandle>
      <Prompt when={manageContentDirty} message={loc => "Changes done here are not saved. Do you want to leave?"} />
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
  z-index: 0;
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
  align-items: flex-start;
  justify-content: center;
  cursor: grab;
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
  margin-top: ${props => (props.hasDescription ? "34px" : "25px")};
`;

ModuleWrapper.displayName = "ModuleWrapper";

export default Curriculum;
