import React from "react";
import { compose } from "redux";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";
import { Button } from "antd";
import { white } from "@edulastic/colors";
import { withNamespaces } from "@edulastic/localization";
import { IconCheck, IconLightBulb, IconBookmark } from "@edulastic/icons";
import ButtonLink from "./ButtonLink";
import get from "lodash/get";

const TestButton = ({
  t,
  checkAnswer,
  settings,
  answerChecksUsedForItem,
  isNonAutoGradable = false,
  toggleBookmark,
  isBookmarked = false,
  items,
  currentItem: currentItemIndex
}) => {
  const showHintButton = get(items, [`${currentItemIndex}`, `data`, `questions`, `0`, `hints`], []).length > 0;
  return (
    <Container>
      {settings.maxAnswerChecks > 0 && !isNonAutoGradable && (
        <StyledButton
          onClick={answerChecksUsedForItem >= settings.maxAnswerChecks ? "" : checkAnswer}
          data-cy="checkAnswer"
          title={answerChecksUsedForItem >= settings.maxAnswerChecks ? "Usage limit exceeded" : ""}
        >
          <ButtonLink color="primary" icon={<IconCheck color={white} />} style={{ color: white }}>
            {t("common.test.checkanswer")}
          </ButtonLink>
        </StyledButton>
      )}
      {showHintButton && (
        <StyledButton>
          <ButtonLink color="primary" icon={<IconLightBulb color={white} />} style={{ color: white }}>
            {t("common.test.hint")}
          </ButtonLink>
        </StyledButton>
      )}
      <StyledButton style={{ background: isBookmarked ? "white" : "" }}>
        <ButtonLink
          color={isBookmarked ? "success" : "primary"}
          isBookmarked={isBookmarked}
          onClick={toggleBookmark}
          icon={<IconBookmark color={isBookmarked ? "#f8c165" : "white"} width={10} height={16} />}
          style={{ color: isBookmarked ? "#f8c165" : "white" }}
        >
          {t("common.test.bookmark")}
        </ButtonLink>
      </StyledButton>
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
  height: 24px;
  &[disabled] {
    cursor: pointer;
    &:hover {
      background: transparent;
    }
    background: transparent;
  }
  &:hover,
  &:focus,
  &:active {
    background: ${props => props.theme.default.headerButtonActiveBgColor};
    border-color: ${props => props.theme.default.headerButtonActiveBgColor};
  }
`;
