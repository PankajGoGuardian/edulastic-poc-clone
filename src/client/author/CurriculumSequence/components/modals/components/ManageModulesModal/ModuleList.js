import React, { useState } from "react";
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";
import { themeColor } from "@edulastic/colors";
import { FaBars } from "react-icons/fa";
import { IconTrash } from "@edulastic/icons";

import ModuleForm from "./ModuleForm";
import {
  Label,
  ModuleContainer,
  DragHandle,
  ModuleContent,
  ModuleID,
  ModuleGroup,
  ModuleTitle,
  ModuleDescription,
  ModuleActions,
  StyledModuleList,
  StyledButton
} from "../styled";

const ModuleResequenceHandle = SortableHandle(() => (
  <DragHandle>
    <FaBars />
  </DragHandle>
));

const ModuleItem = SortableElement(props => {
  const {
    id,
    deleteModule,
    updateModule,
    module: { mIndex, moduleId, moduleGroupName, title: moduleName, description: moduleDescription } = {}
  } = props;

  const [isEdit, toggleEdit] = useState(false);
  /*
   * TODO: On SortElement Click Highlight Container
   */
  const [dragging] = useState(false);

  const openEditModuleForm = () => toggleEdit(true);

  const handleUpdateModule = moduleData => {
    if (updateModule(id, moduleData)) {
      toggleEdit(false);
    }
  };

  const handleCancleUpdate = () => toggleEdit(false);

  if (isEdit) {
    return (
      <ModuleForm
        isEdit={isEdit}
        moduleIndex={id}
        onCancel={handleCancleUpdate}
        onSave={handleUpdateModule}
        module={{ moduleId, moduleGroupName, moduleName, moduleDescription }}
      />
    );
  }

  return (
    <ModuleContainer dragging={dragging} data-cy={`module-${mIndex || id + 1}`}>
      <ModuleResequenceHandle />
      <ModuleID>
        <span>{moduleId || mIndex || id + 1}</span>
      </ModuleID>
      <ModuleContent>
        <ModuleGroup>{moduleGroupName}</ModuleGroup>
        <ModuleTitle>
          <Label>{moduleName}</Label>
        </ModuleTitle>
        <ModuleDescription dangerouslySetInnerHTML={{ __html: moduleDescription }} />
      </ModuleContent>
      <ModuleActions>
        <StyledButton onClick={openEditModuleForm}>EDIT</StyledButton>
        <StyledButton IconBtn isGhost onClick={() => deleteModule(id)}>
          <IconTrash color={themeColor} width={15} height={15} />
        </StyledButton>
      </ModuleActions>
    </ModuleContainer>
  );
});

const SortableModules = SortableContainer(props => (
  <StyledModuleList>
    {props.modulesList.map((mod, i) => (
      <ModuleItem id={i} key={`module-${mod.title}-${mod.description}`} module={mod} index={i} {...props} />
    ))}
  </StyledModuleList>
));

export default SortableModules;
