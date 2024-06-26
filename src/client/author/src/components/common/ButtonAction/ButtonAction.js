/* eslint-disable react/prop-types */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { IconSettings, IconEye, IconCheck, IconClear } from "@edulastic/icons";
import { darkGrey, themeColorBlue } from "@edulastic/colors";
import { withNamespaces } from "@edulastic/localization";
import { withWindowSizes, EduButton } from "@edulastic/common";
import { connect } from "react-redux";
import { compose } from "redux";

import { clearAnswersAction } from "../../../actions/answers";
import { Container, PreviewBar, HeaderActionButton, LabelText } from "./styled_components";
import ScoreBlock from "../ScoreBlock";

class ButtonAction extends Component {
  constructor(props) {
    super(props);

    this.state = {
      attempts: 0
    };
  }

  handleCheckClick = () => {
    const { changePreviewTab, allowedAttempts } = this.props;
    const { attempts } = this.state;

    if (!window.location.pathname.includes("author")) {
      if (attempts < allowedAttempts) {
        this.setState({ attempts: attempts + 1 }, () => changePreviewTab("check"));
      } else {
        return null;
      }
    } else {
      changePreviewTab("check");
    }
  };

  render() {
    const { attempts } = this.state;
    const {
      view,
      onShowSettings,
      changePreviewTab,
      clearAnswers,
      showCheckButton,
      allowedAttempts,
      showPublishButton,
      showSettingsButton,
      isShowAnswerVisible,
      handleShowHints,
      showHints
    } = this.props;
    return (
      <Container showPublishButton={showPublishButton}>
        {view === "edit" && (
          <PreviewBar>
            {showSettingsButton && (
              <HeaderActionButton htmlType="button" onClick={onShowSettings}>
                <EduButton title="Layout" isGhost IconBtn isBlue>
                  <IconSettings color={themeColorBlue} width={20} height={20} />
                </EduButton>
              </HeaderActionButton>
            )}
          </PreviewBar>
        )}
        {view === "preview" && (
          <PreviewBar>
            <ScoreBlock />
            {/* we may need to bring hint button back */}
            {/* <RightActionButton
              style={showHints ? { background: themeColor } : null}
              hints
              onClick={handleShowHints}
              data-cy="show-hint-btn"
            >
              <LabelText style={showHints ? { color: white } : null}>HINTS</LabelText>
            </RightActionButton> */}
            {showCheckButton && (
              <EduButton height="28px" isGhost onClick={this.handleCheckClick} data-cy="check-answer-btn">
                <IconCheck width={12} height={12} />
                <LabelText style={{ color: attempts >= allowedAttempts ? darkGrey : null }}>CHECK ANSWER</LabelText>
              </EduButton>
            )}
            {isShowAnswerVisible && (
              <EduButton height="28px" isGhost onClick={() => changePreviewTab("show")} data-cy="show-answers-btn">
                <IconEye width={12} height={12} />
                <LabelText>SHOW ANSWER</LabelText>
              </EduButton>
            )}
            <EduButton
              height="28px"
              isGhost
              onClick={() => {
                clearAnswers();
                changePreviewTab("clear");
              }}
              data-cy="clear-btn"
            >
              <IconClear width={12} height={12} />
              <LabelText>CLEAR</LabelText>
            </EduButton>
          </PreviewBar>
        )}
      </Container>
    );
  }
}

ButtonAction.propTypes = {
  changePreviewTab: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  onShowSettings: PropTypes.func.isRequired,
  clearAnswers: PropTypes.func.isRequired,
  showCheckButton: PropTypes.bool,
  allowedAttempts: PropTypes.number,
  showPublishButton: PropTypes.bool,
  showSettingsButton: PropTypes.bool,
  isShowAnswerVisible: PropTypes.bool
};

ButtonAction.defaultProps = {
  showPublishButton: null,
  showCheckButton: null,
  allowedAttempts: null,
  showSettingsButton: true,
  isShowAnswerVisible: true
};

const enhance = compose(
  withWindowSizes,
  withNamespaces("author"),
  connect(
    null,
    { clearAnswers: clearAnswersAction }
  )
);

export default enhance(ButtonAction);
