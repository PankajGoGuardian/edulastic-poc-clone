import React, { useRef, useEffect, useState } from "react";
import { find, get } from "lodash";
import styled from "styled-components";
import { Popover } from "antd";
import PropTypes from "prop-types";
import { measureText } from "@edulastic/common";

import CheckMark from "./CheckMark";
import { AnswerBox } from "../../styled/AnswerBox";
import { IndexBox } from "../../styled/IndexBox";
import { AnswerContent } from "../../styled/AnswerContent";

import { CLEAR } from "../../../../constants/constantsForQuestions";

const CheckboxTemplateBoxLayout = ({ resprops, id }) => {
  if (!id) {
    return null;
  }
  const answerBoxRef = useRef();
  const { evaluation, checkAnswer, userSelections, responseIds, previewTab, getUiStyles, changePreviewTab } = resprops;

  const { id: choiceId, index } = find(responseIds, res => res.id === id);
  const { btnStyle, stemNumeration } = getUiStyles(id, index);
  const [boxWidth, updateBoxWidth] = useState(btnStyle.width);
  const [showPopover, togglePopover] = useState(false);

  const handleClick = () => previewTab !== CLEAR && changePreviewTab(CLEAR);

  const userAnswer = get(userSelections, `[${index}].value`);

  useEffect(() => {
    if (answerBoxRef.current) {
      const { width } = measureText(userAnswer, getComputedStyle(answerBoxRef.current));
      if (boxWidth < width) {
        updateBoxWidth(width);
      }
    }
  }, [userAnswer]);

  const popoverContent = <PopoverContent>{userAnswer}</PopoverContent>;

  return (
    <Popover content={popoverContent} visible={showPopover && btnStyle.width < boxWidth}>
      <AnswerBox
        ref={answerBoxRef}
        onMouseEnter={() => togglePopover(true)}
        onMouseLeave={() => togglePopover(false)}
        style={{ ...btnStyle, width: boxWidth }}
        checked={!!userAnswer}
        correct={evaluation[choiceId]}
        onClick={handleClick}
      >
        {!checkAnswer && (
          <IndexBox checked={!!userAnswer} correct={evaluation[choiceId]}>
            {stemNumeration}
          </IndexBox>
        )}
        <AnswerContent showIndex={!checkAnswer}>{userAnswer}</AnswerContent>
        {userAnswer && <CheckMark correct={evaluation[choiceId]} />}
      </AnswerBox>
    </Popover>
  );
};

CheckboxTemplateBoxLayout.propTypes = {
  resprops: PropTypes.object,
  id: PropTypes.string.isRequired
};

CheckboxTemplateBoxLayout.defaultProps = {
  resprops: {}
};

export default React.memo(CheckboxTemplateBoxLayout);

const PopoverContent = styled.div`
  max-width: 600px;
  overflow-wrap: break-word;
  word-break: break-all;
  white-space: normal;
`;
