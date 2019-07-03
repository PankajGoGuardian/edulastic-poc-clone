import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import { IconEye, IconCheck, IconSource, IconSettings, IconEraseText } from "@edulastic/icons";
import { darkGrey } from "@edulastic/colors";
import { withNamespaces } from "@edulastic/localization";
import { withWindowSizes } from "@edulastic/common";
import { connect } from "react-redux";
import { compose } from "redux";
import styled from "styled-components";

import { clearAnswersAction } from "../../../actions/answers";
import { Container, PreviewBar, DisplayBlock } from "./styled_components";
import { ButtonLink } from "..";

class ButtonAction extends Component {
  constructor(props) {
    super(props);

    this.state = {
      attempts: 0,
      option: false,
      manuallyGradableQn: ["formulaessay", "highlightImage", "essayRichText", "essayPlainText"]
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
    const { option, attempts, manuallyGradableQn } = this.state;
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
      authorQuestions
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
              <Button htmlType="button" onClick={onShowSource} data-cy="source" style={{ height: 45, width: 45 }}>
                <ButtonLink
                  color="primary"
                  icon={<IconSource color="#00AD50" width={20} height={11} />}
                  style={{ color: "#00AD50" }}
                />
              </Button>
              {showSettingsButton && (
                <Button htmlType="button" onClick={onShowSettings} style={{ height: 45, width: 45 }}>
                  <ButtonLink
                    color="primary"
                    icon={<IconSettings color="#00AD50" width={20} height={20} />}
                    style={{ color: "#00AD50" }}
                  />
                </Button>
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
              {(showCheckButton || window.location.pathname.includes("author")) && (
                <Button
                  style={{ height: "25px" }}
                  htmlType="button"
                  onClick={this.handleCheckClick}
                  data-cy="check-answer-btn"
                >
                  <ButtonLink color="primary" style={{ color: attempts >= allowedAttempts ? darkGrey : "#00AD50" }}>
                    <LabelText>CHECK ANSWER</LabelText>
                  </ButtonLink>
                </Button>
              )}
              {!manuallyGradableQn.includes(authorQuestions.type) && (
                <Button
                  style={{ height: "25px" }}
                  htmlType="button"
                  onClick={() => changePreviewTab("show")}
                  data-cy="show-answers-btn"
                >
                  <ButtonLink color="primary" style={{ color: "#00AD50" }}>
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
                <ButtonLink color="primary" active={previewTab === "clear"} style={{ color: "#00AD50" }}>
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
  authorQuestions: PropTypes.object.isRequired
};

ButtonAction.defaultProps = {
  showPublishButton: null,
  showCheckButton: null,
  allowedAttempts: null,
  showSettingsButton: true
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
