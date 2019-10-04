/* eslint-disable react/prop-types */
import React from "react";
import { compose } from "redux";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button, Tooltip } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { IconCheck, IconLightBulb, IconBookmark } from "@edulastic/icons";
import get from "lodash/get";
import ButtonLink from "./ButtonLink";

const customizeIcon = icon => styled(icon)`
  fill: ${props => props.theme.header.headerButtonColor};
`;

const TestButton = ({
  t,
  checkAnswer,
  settings,
  answerChecksUsedForItem,
  isNonAutoGradable = false,
  toggleBookmark,
  isBookmarked = false,
  items,
  currentItem: currentItemIndex,
  handleClick
}) => {
  const questions = get(items, [`${currentItemIndex}`, `data`, `questions`], []);
  /**
   * input
   * questions: [
   * {
   *  ...restProps,
   *  hints: [{label: "", value: ""}]
   * },
   * {
   *  ...restProps,
   *  hints: [{label: "", value: ""}]
   * }
   * ]
   *
   * output: a number >= 0
   *
   * logic:
   * for all questions, check if there are hints
   * for all hints check if the label is not empty
   * empty label is possible when a user entered something in the hint and then cleared it (obj is not removed)
   *
   * a number > 0 would indicate the current item has hints which have non empty label
   */

  //  TODO :  need to remove the object if the hint is cleared
  const showHintButton = questions.reduce((acc, question) => {
    if (question.hints) {
      // handling cases when hints are undefined
      acc += question.hints.filter(hint => hint.label.length > 0).length;
    }
    return acc;
  }, 0);
  return (
    <Container>
      {settings.maxAnswerChecks > 0 && !isNonAutoGradable && (
        <Tooltip placement="top" title="Check Answer">
          <StyledButton
            onClick={answerChecksUsedForItem >= settings.maxAnswerChecks ? "" : checkAnswer}
            data-cy="checkAnswer"
            title={answerChecksUsedForItem >= settings.maxAnswerChecks ? "Usage limit exceeded" : ""}
          >
            <StyledButtonLink color="primary" icon={<StyledIconCheck />}>
              {t("common.test.checkanswer")}
            </StyledButtonLink>
          </StyledButton>
        </Tooltip>
      )}
      {showHintButton ? (
        <Tooltip placement="top" title="Hint">
          <StyledButton onClick={handleClick}>
            <StyledButtonLink color="primary" icon={<StyledIconLightBulb />}>
              {t("common.test.hint")}
            </StyledButtonLink>
          </StyledButton>
        </Tooltip>
      ) : null}
      <Tooltip placement="top" title="Bookmark">
        <StyledButton style={{ background: isBookmarked ? "white" : "" }}>
          <StyledButtonLink
            color={isBookmarked ? "success" : "primary"}
            isBookmarked={isBookmarked}
            onClick={toggleBookmark}
            icon={<StyledIconBookmark color={isBookmarked ? "#f8c165" : ""} width={10} height={16} />}
            style={{ color: isBookmarked ? "#f8c165" : "" }}
          >
            {t("common.test.bookmark")}
          </StyledButtonLink>
        </StyledButton>
      </Tooltip>
    </Container>
  );
};

TestButton.propTypes = {
  t: PropTypes.func.isRequired
};

const enhance = compose(withNamespaces("student"));

export default enhance(TestButton);

const Container = styled.div`
  margin-left: 60px;
`;

const StyledButton = styled(Button)`
  margin-right: 10px;
  background: transparent;
  height: auto;
  &[disabled] {
    cursor: pointer;
    &:hover {
      background: transparent;
    }
    background: transparent;
  }
  border-color: ${props => props.theme.default.headerButtonBorderColor};
  &:hover,
  &:focus,
  &:active {
    background: ${props => props.theme.default.headerButtonActiveBgColor};
    border-color: ${props => props.theme.default.headerButtonActiveBgColor};
  }
  ${({ theme }) => theme.zoomedCss`
      height: ${props => props.theme.default.headerToolbarButtonWidth};
     width: ${theme.default.headerToolbarButtonHeight};
  `}
`;

const StyledButtonLink = styled(ButtonLink)`
  font-size: ${props => props.theme.default.headerButtonFontSize};
  color: ${props => props.theme.header.headerButtonColor};
  span {
    svg {
      width: ${props => props.theme.default.headerButtonFontIconWidth};
      height: ${props => props.theme.default.headerButtonFontIconHeight};
    }
  }
  &:hover {
    color: ${props => props.theme.header.headerButtonHoverColor};
  }
`;

const StyledIconCheck = customizeIcon(IconCheck);
const StyledIconLightBulb = customizeIcon(IconLightBulb);
const StyledIconBookmark = customizeIcon(IconBookmark);
