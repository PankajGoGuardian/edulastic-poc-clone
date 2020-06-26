import { themeColor, white } from "@edulastic/colors";
import { CheckboxLabel, EduButton, notification } from "@edulastic/common";
import { test as testContatns } from "@edulastic/constants";
import { IconClose, IconCollapse, IconDescription, IconExpand, IconEye, IconMoveTo } from "@edulastic/icons";
import PropTypes from "prop-types";
import React, { useState } from "react";
import Prompt from "../Prompt/Prompt";
import { Container, Item, MobileButtomContainer } from "./styled";

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
      notification({ type: "info", messageKey: "valueMoreThanQuestions" });
    } else if (post < 0) {
      notification({ type: "info", messageKey: "valueLessThanQuestions" });
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
      notification({ type: "info", messageKey: "selectQuestionOne" });
      setShowPrompt(false);
    }
  };

  return (
    <Container windowWidth={windowWidth} hasStickyHeader={hasStickyHeader}>
      {owner && isEditable ? (
        <Item>
          <CheckboxLabel data-cy="selectAllCh" onChange={onSelectAll}>
            Select All
          </CheckboxLabel>
        </Item>
      ) : (
        // this empty span can fix some
        // alignment issues when there is no select all button exists. dont remove it.
        <span />
      )}
      <MobileButtomContainer style={{ display: "flex" }}>
        <EduButton height="32px" data-cy="viewAsStudent" isGhost onClick={onShowTestPreview} color="primary">
          <IconEye color={themeColor} width={12} height={12} />
          {windowWidth > 767 && <span>View as Student</span>}
        </EduButton>
        {owner && isEditable && (
          <EduButton
            height="32px"
            isGhost
            data-cy="removeSelected"
            disabled={disableRMbtns}
            onClick={!disableRMbtns ? onRemoveSelected : () => null}
            color="primary"
          >
            <IconClose color={themeColor} width={12} height={12} />
            {windowWidth > 767 && <span>Remove Selected</span>}
          </EduButton>
        )}
        {owner && isEditable && (
          <div style={{ position: "relative", marginLeft: "5px" }}>
            <EduButton
              data-cy="moveto"
              disabled={disableRMbtns}
              height="32px"
              isGhost
              onClick={!disableRMbtns ? handleMoveTo : () => null}
              color="primary"
            >
              <IconMoveTo color={themeColor} width={12} height={12} />
              {windowWidth > 767 && <span>Move to</span>}
            </EduButton>
            {showPrompt && (
              <Prompt
                style={{ position: "absolute", left: 0, top: 32, zIndex: 2 }}
                maxValue={itemTotal}
                onSuccess={handleSuccess}
                setShowPrompt={setShowPrompt}
              />
            )}
          </div>
        )}
        <EduButton
          data-cy={setCollapse ? "expand-rows" : "collapse-rows"}
          height="32px"
          isGhost
          onClick={onCollapse}
          color="primary"
        >
          {setCollapse ? (
            <IconExpand color={themeColor} width={12} height={12} />
          ) : (
            <IconCollapse color={themeColor} width={12} height={12} />
          )}
          {windowWidth > 767 && <span>{setCollapse ? "Expand Rows" : "Collapse Rows"}</span>}
        </EduButton>

        {windowWidth < 1200 && (
          <EduButton
            height="32px"
            isGhost
            style={{
              background: !isShowSummary ? themeColor : "",
              color: !isShowSummary ? white : "",
              borderRadius: "4px",
              maxHeight: "32px"
            }}
            onClick={toggleSummary}
            color="primary"
          >
            <IconDescription color={isShowSummary ? themeColor : white} width={13} height={13} />
            {windowWidth > 767 && <span>{isShowSummary ? "Show Summary" : "Hide Summary"}</span>}
          </EduButton>
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
