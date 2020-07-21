/* eslint-disable react/prop-types */
import { smallDesktopWidth } from "@edulastic/colors";
import { IconBookmark, IconCheck } from "@edulastic/icons";
import { withNamespaces } from "@edulastic/localization";
import PropTypes from "prop-types";
import React from "react";
import { compose } from "redux";
import styled from "styled-components";
import { Tooltip } from "../../../common/utils/helpers";

const TestButton = ({ t, checkAnswer, settings, answerChecksUsedForItem, toggleBookmark, isBookmarked = false }) => (
  <Container>
    <Tooltip placement="top" title="Bookmark">
      <StyledButton onClick={toggleBookmark} active={isBookmarked}>
        <StyledIconBookmark />
        <span>{t("common.test.bookmark")}</span>
      </StyledButton>
    </Tooltip>
    {settings.maxAnswerChecks > 0 && (
      <Tooltip
        placement="top"
        title={answerChecksUsedForItem >= settings.maxAnswerChecks ? "Usage limit exceeded" : "Check Answer"}
      >
        <StyledButton onClick={checkAnswer} data-cy="checkAnswer">
          <StyledIconCheck />
          <span> {t("common.test.checkanswer")}</span>
        </StyledButton>
      </Tooltip>
    )}

    {/* {showHintButton(questions) ? (
        <Tooltip placement="top" title="Hint">
          <StyledButton onClick={handletoggleHints}>
            <StyledIconLightBulb />
            <span>{t("common.test.hint")}</span>
          </StyledButton>
        </Tooltip>
      ) : null} */}
  </Container>
);

TestButton.propTypes = {
  t: PropTypes.func.isRequired
};

const enhance = compose(withNamespaces("student"));

export default enhance(TestButton);

const Container = styled.div`
  margin-left: 5px;
  display: flex;
`;

const StyledButton = styled.div`
  margin-right: 5px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  padding: 5px 10px;
  letter-spacing: 0.5px;
  border-radius: 4px;
  border: 1px solid;
  cursor: pointer;
  font-weight:600;
  ${({ theme, active }) => `
    height: ${theme.default.headerLeftButtonHeight};
    font-size: ${theme.default.headerButtonFontSize};
    color: ${active ? theme.header.headerButtonHoverColor : theme.header.headerButtonColor};
    background: ${active ? theme.default.headerLeftButtonBgHoverColor : "transparent"};
    border-color: ${theme.default.headerButtonBorderColor};
    
    &:hover,
    &:focus,
    &:active {
      background: ${theme.default.headerLeftButtonBgHoverColor};
      border-color: ${theme.default.headerLeftButtonBgHoverColor};
      color: ${theme.header.headerButtonHoverColor};
      svg {
        fill: ${theme.header.headerButtonHoverColor};
      }
    }
    svg {
      margin-right: 10px;
      fill: ${active ? theme.header.headerButtonHoverColor : theme.header.headerButtonColor};
      &:hover {
        fill: ${theme.header.headerButtonHoverColor};
      }
    }
  `}

  @media (max-width: ${smallDesktopWidth}) {
    span {
      display: none;
    }
    svg {
      margin-right: 0px;
    }
  }
`;

const StyledIconCheck = styled(IconCheck)`
  ${({ theme }) => `
    width: ${theme.default.headerCheckIconWidth};
    height: ${theme.default.headerCheckIconHeight};
  `}
`;
const StyledIconBookmark = styled(IconBookmark)`
  ${({ theme }) => `
    width: ${theme.default.headerBookmarkIconWidth};
    height: ${theme.default.headerBookmarkIconHeight};
  `}
`;
