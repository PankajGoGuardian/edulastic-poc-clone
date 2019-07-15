import React, { Component } from "react";
import PropTypes from "prop-types";
import { Menu, Button, Tooltip } from "antd";
import {
  IconSaveNew,
  IconSource,
  IconPreview,
  IconSettings,
  IconPencilEdit,
  IconEye,
  IconCheck,
  IconEraseText,
  IconMetadata
} from "@edulastic/icons";
import { white } from "@edulastic/colors";
import { withNamespaces } from "@edulastic/localization";
import { withWindowSizes } from "@edulastic/common";
import { connect } from "react-redux";
import { compose } from "redux";

import { clearAnswersAction } from "../../../actions/answers";
import { ButtonLink } from "..";
import {
  Container,
  RightSide,
  HeadIcon,
  MenuItem,
  MobileContainer,
  MobileFirstContainer,
  MobileSecondContainer,
  CustomButton
} from "./styled_components";

class ButtonBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: "edit"
    };
  }

  handleMenuClick = view => {
    const { onChangeView, onSaveScrollTop } = this.props;

    onChangeView(view);

    if (view !== "edit" && onSaveScrollTop) {
      onSaveScrollTop(window.pageYOffset);
    }

    if (view === "preview") {
      this.setClearPreviewTab();
    }
  };

  setClearPreviewTab = () => {
    const { changePreviewTab, clearAnswers } = this.props;
    clearAnswers();
    changePreviewTab("clear");
  };

  render() {
    const { current } = this.state;
    const {
      t,
      onSave,
      onPublishTestItem,
      onShowSource,
      onShowSettings,
      windowWidth,
      changePreviewTab,
      onEnableEdit,
      showPublishButton,
      view,
      isTestFlow = false,
      hasAuthorPermission = true,
      itemStatus,
      renderExtra,
      renderRightSide,
      withLabels
    } = this.props;

    return (
      <React.Fragment>
        {windowWidth > 468 ? (
          <Container>
            <Menu
              mode="horizontal"
              selectedKeys={[view]}
              style={{ marginLeft: 10, marginRight: 10, justifyContent: "center" }}
            >
              {hasAuthorPermission && (
                <MenuItem
                  data-cy="editButton"
                  className={view === "edit" && "active"}
                  onClick={() => this.handleMenuClick("edit")}
                >
                  <HeadIcon>
                    <IconPencilEdit color={white} width={18} height={16} />
                  </HeadIcon>
                  Edit Mode
                </MenuItem>
              )}
              <MenuItem
                data-cy="previewButton"
                className={view === "preview" && "active"}
                onClick={() => this.handleMenuClick("preview")}
              >
                <HeadIcon>
                  <IconEye color={white} width={18} height={16} />
                </HeadIcon>
                Preview mode
              </MenuItem>
              <MenuItem
                data-cy="metadataButton"
                className={view === "metadata" && "active"}
                onClick={() => this.handleMenuClick("metadata")}
              >
                <HeadIcon>
                  <IconMetadata color={white} width={18} height={16} />
                </HeadIcon>
                Meta data
              </MenuItem>
            </Menu>

            {hasAuthorPermission && (
              <RightSide>
                {renderRightSide()}
                {(showPublishButton || showPublishButton === undefined) &&
                  (itemStatus === "draft" ? (
                    <Tooltip title={"Save"}>
                      <CustomButton data-cy="saveButton" className="save-btn" onClick={onSave}>
                        <HeadIcon>
                          <IconSaveNew color="#00AD50" width={20.4} height={20.4} />
                        </HeadIcon>
                      </CustomButton>
                    </Tooltip>
                  ) : (
                    <CustomButton data-cy="saveButton" onClick={onSave}>
                      <HeadIcon>
                        <IconSaveNew color="#00AD50" width={20.4} height={20.4} />
                      </HeadIcon>
                      Save
                    </CustomButton>
                  ))}
                {showPublishButton && itemStatus === "draft" && !isTestFlow && (
                  <Button data-cy="publishItem" onClick={onPublishTestItem}>
                    Publish
                  </Button>
                )}
                {!(showPublishButton || showPublishButton === undefined) && (
                  <Button data-cy="editItem" style={{ width: 120 }} size="large" onClick={onEnableEdit}>
                    Edit
                  </Button>
                )}
                {renderExtra()}
              </RightSide>
            )}
            {!hasAuthorPermission && <RightSide>{renderExtra()}</RightSide>}
          </Container>
        ) : (
          <MobileContainer>
            <MobileFirstContainer>
              <Button
                onClick={() => this.handleMenuClick("edit")}
                className={`btn-edit ${view === "edit" && "active"}`}
              >
                <HeadIcon>
                  <IconPencilEdit color={white} width={18} height={16} />
                </HeadIcon>
                {withLabels ? "Edit Mode" : ""}
              </Button>
              <Button
                onClick={() => this.handleMenuClick("preview")}
                className={`btn-preview ${view === "preview" && "active"}`}
              >
                <HeadIcon>
                  <IconPreview color={white} width={18} height={16} />
                </HeadIcon>
                {withLabels ? "Preview mode" : ""}
              </Button>
              <Button data-cy="saveButton" onClick={onSave} className="btn-save">
                <HeadIcon>
                  <IconSaveNew color={white} width={18} height={16} />
                </HeadIcon>
                {withLabels ? "Save" : ""}
              </Button>
              <Button onClick={onShowSource} className="btn-source">
                <HeadIcon>
                  <IconSource color={white} width={18} height={16} />
                </HeadIcon>
                {withLabels ? "Source" : ""}
              </Button>
              <Button onClick={onShowSettings} className="btn-settings">
                <HeadIcon>
                  <IconSettings color={white} width={24} height={16} />
                </HeadIcon>
                {withLabels ? "Settings" : ""}
              </Button>
            </MobileFirstContainer>
            {view === "preview" && (
              <MobileSecondContainer>
                <Button
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0
                  }}
                  onClick={() => changePreviewTab("check")}
                >
                  <ButtonLink
                    color="primary"
                    icon={<IconCheck color={white} width={16} height={16} />}
                    style={{ color: white }}
                  >
                    {t("component.questioneditor.buttonbar.checkanswer")}
                  </ButtonLink>
                </Button>
                <Button
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0
                  }}
                  onClick={() => changePreviewTab("show")}
                >
                  <ButtonLink
                    color="primary"
                    style={{ color: white }}
                    icon={<IconEye color={white} width={16} height={16} />}
                  >
                    {t("component.questioneditor.buttonbar.showanswers")}
                  </ButtonLink>
                </Button>
                <Button
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0
                  }}
                  onClick={() => this.setClearPreviewTab()}
                >
                  <ButtonLink
                    color="primary"
                    style={{ color: white }}
                    icon={<IconEraseText color={white} width={16} height={16} />}
                  >
                    {t("component.questioneditor.buttonbar.clear")}
                  </ButtonLink>
                </Button>
              </MobileSecondContainer>
            )}
          </MobileContainer>
        )}
      </React.Fragment>
    );
  }
}

ButtonBar.propTypes = {
  onChangeView: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  onShowSource: PropTypes.func.isRequired,
  onShowSettings: PropTypes.func,
  changePreviewTab: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  isTestFlow: PropTypes.bool,
  onEnableEdit: PropTypes.func,
  clearAnswers: PropTypes.func.isRequired,
  renderExtra: PropTypes.func,
  renderRightSide: PropTypes.func,
  withLabels: PropTypes.bool,
  savedWindowScrollTop: PropTypes.number.isRequired,
  onSaveScrollTop: PropTypes.func.isRequired
};

ButtonBar.defaultProps = {
  onShowSettings: () => {},
  renderRightSide: () => {},
  onEnableEdit: () => {},
  renderExtra: () => null,

  withLabels: false
  // saving: false,
};

const enhance = compose(
  withWindowSizes,
  withNamespaces("author"),
  connect(
    null,
    { clearAnswers: clearAnswersAction }
  )
);

export default enhance(ButtonBar);
