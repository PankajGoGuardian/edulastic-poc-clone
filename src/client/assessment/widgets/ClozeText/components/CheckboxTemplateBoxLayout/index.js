import React, { useRef, useEffect, useState } from "react";
import { find, get } from "lodash";
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
  const {
    evaluation,
    checkAnswer,
    userSelections,
    responseIds,
    previewTab,
    getUiStyles,
    changePreviewTab,
    isPrintPreview
  } = resprops;

  const { id: choiceId, index } = find(responseIds, res => res.id === id);
  const { btnStyle: style, stemNumeration } = getUiStyles(id, index);
  const { disableAutoExpend, ...btnStyle } = style;
  const [boxWidth, updateBoxWidth] = useState(btnStyle.width);
  const [showPopover, togglePopover] = useState(false);

  const handleClick = () => previewTab !== CLEAR && changePreviewTab(CLEAR);

  const userAnswer = get(userSelections, `[${index}].value`);

  useEffect(() => {
    if (answerBoxRef.current) {
      const { width } = measureText(userAnswer, getComputedStyle(answerBoxRef.current));
      if (boxWidth < width && !disableAutoExpend) {
        updateBoxWidth(width);
      }
    }
  }, [userAnswer]);

  const attempt = !!userAnswer && evaluation[choiceId] !== undefined;
  const popoverContent = (
    <AnswerBox
      checked={attempt}
      style={{ ...btnStyle, whiteSpace: "normal", wordBreak: "break-all", width: "unset", height: "auto" }}
      correct={evaluation[choiceId]}
      onClick={handleClick}
      isPrintPreview={isPrintPreview}
    >
      {!checkAnswer && (
        <IndexBox checked={!!userAnswer} correct={evaluation[choiceId]}>
          {stemNumeration}
        </IndexBox>
      )}
      <AnswerContent
        style={{ whiteSpace: "normal", width: "unset", marginRight: "1rem" }}
        showIndex={!checkAnswer}
        inPopover
        dangerouslySetInnerHTML={{ __html: userAnswer || "" }}
      />
      {attempt && <CheckMark correct={evaluation[choiceId]} />}
    </AnswerBox>
  );

  const padding = 15;
  const indexWidth = checkAnswer ? 0 : 40;
  const totalContentWidth = boxWidth + padding + indexWidth;
  return (
    <Popover content={popoverContent} visible={showPopover && btnStyle.width < totalContentWidth && userAnswer}>
      <AnswerBox
        ref={answerBoxRef}
        onMouseEnter={() => togglePopover(true)}
        onMouseLeave={() => togglePopover(false)}
        style={{ ...btnStyle, width: boxWidth }}
        checked={attempt}
        correct={evaluation[choiceId]}
        onClick={handleClick}
        isPrintPreview={isPrintPreview}
      >
        {!checkAnswer && (
          <IndexBox checked={!!userAnswer} correct={evaluation[choiceId]}>
            {stemNumeration}
          </IndexBox>
        )}
        <AnswerContent showIndex={!checkAnswer} dangerouslySetInnerHTML={{ __html: userAnswer || "" }} />
        {attempt && <CheckMark correct={evaluation[choiceId]} />}
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
