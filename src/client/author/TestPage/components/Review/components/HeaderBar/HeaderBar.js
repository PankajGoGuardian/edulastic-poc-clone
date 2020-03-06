import React, { useState } from "react";
import PropTypes from "prop-types";
import { message } from "antd";

import { themeColor, white } from "@edulastic/colors";
import { IconClose, IconMoveTo, IconCollapse, IconEye, IconDescription } from "@edulastic/icons";
import { test as testContatns } from "@edulastic/constants";

import Prompt from "../Prompt/Prompt";
import { ButtonLink } from "../../../../../src/components/common";
import { Item, Container, SelectAllCheckbox, ActionButton, MobileButtomContainer } from "./styled";
import { EduCheckBox } from "@edulastic/common";

const { ITEM_GROUP_TYPES } = testContatns;
const HeaderBar = ({
  onSelectAll,
  onRemoveSelected,
  onCollapse,
  toggleSummary,
  owner,
  isEditable,
  itemTotal,
  selectedItems,
  onMoveTo,
  windowWidth,
  setCollapse,
  isShowSummary,
  onShowTestPreview,
  hasStickyHeader,
  itemGroups
}) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const disableRMbtns = itemGroups.some(group => group.type === ITEM_GROUP_TYPES.AUTOSELECT);

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
    if (disableRMbtns) return;
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
          <EduCheckBox data-cy="selectAllCh" onChange={onSelectAll}>
            Select All
          </EduCheckBox>
        </Item>
      ) : (
        // this empty span can fix some
        // alignment issues when there is no select all button exists. dont remove it.
        <span />
      )}
      <MobileButtomContainer>
        <ActionButton data-cy="viewAsStudent">
          <ButtonLink
            onClick={onShowTestPreview}
            color="primary"
            icon={<IconEye color={themeColor} width={12} height={12} />}
          >
            {windowWidth > 767 && <span>View as Student</span>}
          </ButtonLink>
        </ActionButton>
        {owner && isEditable && (
          <ActionButton data-cy="removeSelected" disabled={disableRMbtns}>
            <ButtonLink
              onClick={!disableRMbtns ? onRemoveSelected : () => null}
              color="primary"
              icon={<IconClose color={themeColor} width={12} height={12} />}
            >
              {windowWidth > 767 && <span>Remove Selected</span>}
            </ButtonLink>
          </ActionButton>
        )}
        {owner && isEditable && (
          <ActionButton data-cy="moveto" disabled={disableRMbtns}>
            <ButtonLink
              onClick={!disableRMbtns ? handleMoveTo : () => null}
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
                setShowPrompt={setShowPrompt}
              />
            )}
          </ActionButton>
        )}
        <ActionButton data-cy={setCollapse ? "expand-rows" : "collapse-rows"}>
          <ButtonLink
            onClick={onCollapse}
            color="primary"
            icon={<IconCollapse color={themeColor} width={12} height={12} />}
          >
            {windowWidth > 767 && <span>{setCollapse ? "Expand Rows" : "Collapse Rows"}</span>}
          </ButtonLink>
        </ActionButton>

        {windowWidth < 1200 && (
          <ActionButton>
            <ButtonLink
              style={{
                background: !isShowSummary ? themeColor : "",
                color: !isShowSummary ? white : "",
                borderRadius: "4px",
                maxHeight: "32px"
              }}
              onClick={toggleSummary}
              color="primary"
              icon={<IconDescription color={isShowSummary ? themeColor : white} width={13} height={13} />}
            >
              {windowWidth > 767 && <span>{isShowSummary ? "Show Summary" : "Hide Summary"}</span>}
            </ButtonLink>
          </ActionButton>
        )}
      </MobileButtomContainer>
    </Container>
  );
};

HeaderBar.propTypes = {
  onSelectAll: PropTypes.func.isRequired,
  onMoveTo: PropTypes.func.isRequired,
  onRemoveSelected: PropTypes.func.isRequired,
  onCollapse: PropTypes.func.isRequired,
  owner: PropTypes.bool.isRequired,
  isEditable: PropTypes.bool.isRequired,
  itemTotal: PropTypes.number.isRequired,
  selectedItems: PropTypes.array.isRequired,
  windowWidth: PropTypes.number.isRequired,
  setCollapse: PropTypes.bool.isRequired,
  isShowSummary: PropTypes.bool.isRequired,
  toggleSummary: PropTypes.func.isRequired
};

export default HeaderBar;
