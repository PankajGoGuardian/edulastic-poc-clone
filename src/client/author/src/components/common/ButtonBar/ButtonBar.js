import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Button } from "antd";
import { get } from "lodash";
import {
  IconSaveNew,
  IconPreview,
  IconPencilEdit,
  IconEye,
  IconCheck,
  IconEraseText,
  IconMetadata,
  IconClose
} from "@edulastic/icons";
import { white, themeColor } from "@edulastic/colors";
import { withNamespaces } from "@edulastic/localization";
import { withWindowSizes } from "@edulastic/common";
import { connect } from "react-redux";
import { compose } from "redux";
import { Tooltip } from "../../../../../common/utils/helpers";
import { MAX_TAB_WIDTH } from "../../../constants/others";
import { clearAnswersAction } from "../../../actions/answers";
import { clearEvaluationAction } from "../../../../../assessment/actions/evaluation";
import { ButtonLink } from "..";
import {
  Container,
  RightSide,
  HeadIcon,
  MenuItem,
  MobileContainer,
  MobileTopRight,
  MobileBottom,
  MenuList,
  MobileSecondContainer,
  CustomButton
} from "./styled_components";

class ButtonBar extends Component {
  handleMenuClick = view => () => {
    const {
      onChangeView,
      clearEvaluation,
      onSaveScrollTop,
      view: currentView,
      changePreviewTab
    } = this.props;

    if (currentView === view) {
      return;
    }

    onChangeView(view);

    if (view !== "edit" && onSaveScrollTop) {
      onSaveScrollTop(window.pageYOffset);
    }

    if (view === "preview") {
      changePreviewTab("clear");
    }

    if (view === "edit") {
      clearEvaluation();
    }
  };

  setClearPreviewTab = () => {
    const { changePreviewTab, clearAnswers } = this.props;
    clearAnswers();
    changePreviewTab("clear");
  };

  render() {
    const {
      t,
      onSave,
      onCancel,
      onPublishTestItem,
      windowWidth,
      changePreviewTab,
      onEnableEdit,
      showPublishButton,
      view,
      isTestFlow,
      hasAuthorPermission,
      itemStatus,
      renderExtra,
      renderRightSide,
      withLabels,
      disableSave,
      showMetaData,
      showAuditTrail = false,
      permissions
    } = this.props;

    return (
      <React.Fragment>
        {windowWidth > MAX_TAB_WIDTH ? (
          <Container>
            <MenuList mode="horizontal" selectedKeys={[view]}>
              {hasAuthorPermission && (
                <MenuItem
                  data-cy="editButton"
                  className={view === "edit" && "active"}
                  onClick={this.handleMenuClick("edit")}
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
                onClick={this.handleMenuClick("preview")}
              >
                <HeadIcon>
                  <IconEye color={white} width={18} height={16} />
                </HeadIcon>
                Preview mode
              </MenuItem>
              {showMetaData && (
                <MenuItem
                  data-cy="metadataButton"
                  className={view === "metadata" && "active"}
                  onClick={this.handleMenuClick("metadata")}
                >
                  <HeadIcon>
                    <IconMetadata color={white} width={18} height={16} />
                  </HeadIcon>
                  Meta data
                </MenuItem>
              )}
              {hasAuthorPermission && showAuditTrail && !!permissions.length && (
                <MenuItem
                  data-cy="auditTrailButton"
                  className={view === "auditTrail" && "active"}
                  onClick={this.handleMenuClick("auditTrail")}
                >
                  <HeadIcon>
                    <IconPencilEdit color={white} width={18} height={16} />
                  </HeadIcon>
                  Audit trail
                </MenuItem>
              )}
            </MenuList>

            {hasAuthorPermission && (
              <RightSide>
                {renderRightSide()}
                {(showPublishButton || showPublishButton === undefined) &&
                  (itemStatus === "draft" ? (
                    <>
                      {isTestFlow && (
                        <CustomButton data-cy="saveCancel" onClick={onCancel}>
                          <HeadIcon mt="0px">
                            <IconClose color={themeColor} width="12" height="12" />
                          </HeadIcon>
                          Cancel
                        </CustomButton>
                      )}
                      <Tooltip title="Save">
                        <CustomButton
                          disabled={disableSave}
                          data-cy="saveButton"
                          regrade
                          className="save-btn"
                          onClick={onSave}
                        >
                          <HeadIcon>
                            <IconSaveNew color={themeColor} width={16} height={16} />
                          </HeadIcon>
                          Save
                        </CustomButton>
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      {isTestFlow && (
                        <CustomButton onClick={onCancel}>
                          <HeadIcon>
                            <IconClose color={themeColor} width="12" height="12" />
                          </HeadIcon>
                          Cancel
                        </CustomButton>
                      )}
                      <CustomButton disabled={disableSave} data-cy="saveButton" onClick={onSave}>
                        <HeadIcon>
                          <IconSaveNew color={themeColor} width={20.4} height={20.4} />
                        </HeadIcon>
                        Save
                      </CustomButton>
                    </>
                  ))}
                {showPublishButton && itemStatus === "draft" && !isTestFlow && (
                  <Button disabled={disableSave} data-cy="publishItem" onClick={onPublishTestItem}>
                    Publish
                  </Button>
                )}
                {!(showPublishButton || showPublishButton === undefined) && (
                  <Button
                    data-cy="editItem"
                    style={{ width: 120 }}
                    size="large"
                    onClick={onEnableEdit}
                  >
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
            <MobileTopRight>
              <CustomButton
                disabled={disableSave}
                data-cy="saveButton"
                onClick={onSave}
                className="btn-save"
              >
                <IconSaveNew color={white} width={18} height={16} />
              </CustomButton>
            </MobileTopRight>
            <MobileBottom>
              <MenuList selectedKeys={[view]}>
                <MenuItem
                  onClick={this.handleMenuClick("edit")}
                  className={view === "edit" && "active"}
                  data-cy="editButton"
                >
                  <HeadIcon>
                    <IconPencilEdit color={white} width={18} height={16} />
                  </HeadIcon>
                  {withLabels ? "Edit Mode" : ""}
                </MenuItem>
                <MenuItem
                  onClick={this.handleMenuClick("preview")}
                  className={view === "preview" && "active"}
                  data-cy="previewButton"
                >
                  <HeadIcon>
                    <IconPreview color={white} width={18} height={16} />
                  </HeadIcon>
                  {withLabels ? "Preview mode" : ""}
                </MenuItem>

                <MenuItem
                  data-cy="metadataButton"
                  className={view === "metadata" && "active"}
                  onClick={this.handleMenuClick("metadata")}
                >
                  <HeadIcon>
                    <IconMetadata color={white} width={18} height={16} />
                  </HeadIcon>
                  Meta data
                </MenuItem>
              </MenuList>
            </MobileBottom>
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
  clearAnswers: PropTypes.func.isRequired,
  changePreviewTab: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  isTestFlow: PropTypes.bool,
  onEnableEdit: PropTypes.func,
  clearEvaluation: PropTypes.func.isRequired,
  renderExtra: PropTypes.func,
  renderRightSide: PropTypes.func,
  withLabels: PropTypes.bool,
  onSaveScrollTop: PropTypes.func.isRequired,
  disableSave: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
  onPublishTestItem: PropTypes.func.isRequired,
  showPublishButton: PropTypes.bool.isRequired,
  view: PropTypes.string.isRequired,
  hasAuthorPermission: PropTypes.bool,
  itemStatus: PropTypes.any.isRequired,
  showMetaData: PropTypes.bool,
  showAuditTrail: PropTypes.bool,
  permissions: PropTypes.object.isRequired
};

ButtonBar.defaultProps = {
  renderRightSide: () => {},
  onEnableEdit: () => {},
  renderExtra: () => null,
  disableSave: false,
  showMetaData: false,
  showAuditTrail: false,
  isTestFlow: false,
  withLabels: false,
  hasAuthorPermission: true
};

const enhance = compose(
  withRouter,
  withWindowSizes,
  withNamespaces("author"),
  connect(
    state => ({
      permissions: get(state, ["user", "user", "permissions"], [])
    }),
    {
      clearAnswers: clearAnswersAction,
      clearEvaluation: clearEvaluationAction
    }
  )
);

export default enhance(ButtonBar);
