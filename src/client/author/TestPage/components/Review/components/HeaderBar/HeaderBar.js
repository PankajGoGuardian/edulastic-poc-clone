import React, { useState } from "react";
import PropTypes from "prop-types";
import { Checkbox, message, Button } from "antd";

import { themeColor } from "@edulastic/colors";
import { IconClose, IconMoveTo, IconCollapse, IconEye } from "@edulastic/icons";

import Prompt from "../Prompt/Prompt";
import { ButtonLink } from "../../../../../src/components/common";
import { Item, Container, SelectAllCheckbox, ActionButton, MobileButtomContainer } from "./styled";

const HeaderBar = ({
  onSelectAll,
  onRemoveSelected,
  onCollapse,
  owner,
  isEditable,
  itemTotal,
  selectedItems,
  onMoveTo,
  windowWidth,
  setCollapse,
  onShowTestPreview,
  hasStickyHeader
}) => {
  const [showPrompt, setShowPrompt] = useState(false);

  const handleSuccess = position => {
    const post = position - 1;
    if (post > itemTotal - 1) {
      message.info("Value cannot be more than total questions count");
    } else if (post < 0) {
      message.info("Value cannot be less than total questions count");
    } else {
      onMoveTo(post);
      setShowPrompt(false);
    }
  };

  const handleMoveTo = () => {
    if (selectedItems.length === 1) {
      setShowPrompt(!showPrompt);
    } else {
      message.info("select one question at a time");
      setShowPrompt(false);
    }
  };

  return (
    <Container windowWidth={windowWidth} hasStickyHeader={hasStickyHeader}>
      {owner && isEditable ? (
        <Item>
          <SelectAllCheckbox data-cy="selectAllCh" onChange={onSelectAll}>
            Select All
          </SelectAllCheckbox>
        </Item>
      ) : (
        //this empty span can fix some alignment issues when there is no select all button exists. dont remove it.
        <span />
      )}
      <MobileButtomContainer>
        <ActionButton>
          <ButtonLink
            onClick={onShowTestPreview}
            color="primary"
            icon={<IconEye color={themeColor} width={12} height={12} />}
          >
            {windowWidth > 767 && <span>View as Student</span>}
          </ButtonLink>
        </ActionButton>
        {owner && isEditable && (
          <ActionButton data-cy="removeSelected">
            <ButtonLink
              onClick={onRemoveSelected}
              color="primary"
              icon={<IconClose color={themeColor} width={12} height={12} />}
            >
              {windowWidth > 767 && <span>Remove Selected</span>}
            </ButtonLink>
          </ActionButton>
        )}
        {owner && isEditable && (
          <ActionButton data-cy="moveto">
            <ButtonLink
              onClick={handleMoveTo}
              color="primary"
              icon={<IconMoveTo color={themeColor} width={12} height={12} />}
            >
              {windowWidth > 767 && <span>Move to</span>}
            </ButtonLink>
            {showPrompt && (
              <Prompt
                style={{ position: "absolute", left: 0, top: 25, zIndex: 1 }}
                maxValue={itemTotal}
                onSuccess={handleSuccess}
              />
            )}
          </ActionButton>
        )}
        <ActionButton data-cy="expandCollapseRow">
          <ButtonLink
            onClick={onCollapse}
            color="primary"
            icon={<IconCollapse color={themeColor} width={12} height={12} />}
          >
            {windowWidth > 767 && <span>{setCollapse ? "Expand Rows" : "Collapse Rows"}</span>}
          </ButtonLink>
        </ActionButton>
      </MobileButtomContainer>
    </Container>
  );
};

HeaderBar.propTypes = {
  onSelectAll: PropTypes.func.isRequired,
  onMoveTo: PropTypes.func.isRequired,
  onRemoveSelected: PropTypes.func.isRequired,
  onCollapse: PropTypes.func.isRequired,
  owner: PropTypes.bool,
  isEditable: PropTypes.bool,
  itemTotal: PropTypes.number.isRequired,
  selectedItems: PropTypes.array.isRequired,
  windowWidth: PropTypes.number.isRequired,
  setCollapse: PropTypes.bool.isRequired
};

export default HeaderBar;
