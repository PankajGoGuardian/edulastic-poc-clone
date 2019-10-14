import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import { IconSettings } from "@edulastic/icons";
import { darkGrey, themeColor, white } from "@edulastic/colors";
import { withNamespaces } from "@edulastic/localization";
import { withWindowSizes } from "@edulastic/common";
import { connect } from "react-redux";
import { compose } from "redux";
import styled from "styled-components";

import { clearAnswersAction } from "../../../actions/answers";
import { Container, PreviewBar, DisplayBlock, HeaderActionButton } from "./styled_components";
import { ButtonLink } from "..";

class ButtonAction extends Component {
  constructor(props) {
    super(props);

    this.state = {
      attempts: 0,
      option: false
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
    const { option, attempts } = this.state;
    const {
      t,
      view,
      previewTab,
      onShowSource,
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
        <DisplayBlock>
          {view === "edit" && (
            <PreviewBar
              style={{
                width: "100%",
                justifyContent: "flex-end"
              }}
            >
              {showSettingsButton && (
                <HeaderActionButton htmlType="button" onClick={onShowSettings}>
                  <ButtonLink
                    color="primary"
                    icon={<IconSettings color={themeColor} width={20} height={20} />}
                    style={{ color: themeColor }}
                  />
                </HeaderActionButton>
              )}
            </PreviewBar>
          )}
          {view === "preview" && (
            <PreviewBar
              style={{
                width: "100%",
                justifyContent: "flex-end"
              }}
            >
              <Button
                style={showHints ? { background: themeColor, height: "25px" } : { height: "25px" }}
                htmlType="button"
                onClick={handleShowHints}
                data-cy="show-answers-btn"
              >
                <ButtonLink color="primary" style={showHints ? { color: white } : { color: themeColor }}>
                  <LabelText>HINTS</LabelText>
                </ButtonLink>
              </Button>
              {showCheckButton && (
                <Button
                  style={{ height: "25px" }}
                  htmlType="button"
                  onClick={this.handleCheckClick}
                  data-cy="check-answer-btn"
                >
                  <ButtonLink color="primary" style={{ color: attempts >= allowedAttempts ? darkGrey : themeColor }}>
                    <LabelText>CHECK ANSWER</LabelText>
                  </ButtonLink>
                </Button>
              )}
              {isShowAnswerVisible && (
                <Button
                  style={{ height: "25px" }}
                  htmlType="button"
                  onClick={() => changePreviewTab("show")}
                  data-cy="show-answers-btn"
                >
                  <ButtonLink color="primary" style={{ color: themeColor }}>
                    <LabelText>SHOW ANSWER</LabelText>
                  </ButtonLink>
                </Button>
              )}
              <Button
                style={{ height: "25px" }}
                htmlType="button"
                onClick={() => {
                  clearAnswers();
                  changePreviewTab("clear");
                }}
                data-cy="clear-btn"
              >
                <ButtonLink color="primary" active={previewTab === "clear"} style={{ color: themeColor }}>
                  <LabelText>CLEAR</LabelText>
                </ButtonLink>
              </Button>
            </PreviewBar>
          )}
        </DisplayBlock>
      </Container>
    );
  }
}

ButtonAction.propTypes = {
  changePreviewTab: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string.isRequired,
  onShowSource: PropTypes.func.isRequired,
  onShowSettings: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
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

const LabelText = styled.label`
  font-size: 10px;
  cursor: pointer;
`;
