import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Menu, Button } from "antd";
import { get } from "lodash";
import { Tooltip } from "../../../../../common/utils/helpers";
import {
  IconSaveNew,
  IconSource,
  IconPreview,
  IconSettings,
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
import { MAX_TAB_WIDTH } from "../../../constants/others";

import { clearAnswersAction } from "../../../actions/answers";
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
  DropMenuList,
  RightDropdown,
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
    const {
      t,
      onSave,
      onCancel,
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
      withLabels,
      disableSave = false,
      showMetaData = false,
      showAuditTrail = false,
      permissions
    } = this.props;
    const MobileDropMenu = (
      <DropMenuList>
        <Menu.Item onClick={onShowSource} key="0">
          <HeadIcon>
            <IconSource color={white} width={18} height={16} />
          </HeadIcon>
          {withLabels ? "Source" : ""}
        </Menu.Item>
        <Menu.Item onClick={onShowSettings} key="1">
          <HeadIcon>
            <IconSettings color={white} width={24} height={16} />
          </HeadIcon>
          {withLabels ? "Settings" : ""}
        </Menu.Item>
      </DropMenuList>
    );

    return (
      <React.Fragment>
        {windowWidth > MAX_TAB_WIDTH ? (
          <Container>
            <MenuList mode="horizontal" selectedKeys={[view]}>
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
              {showMetaData && (
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
              )}
              {hasAuthorPermission && showAuditTrail && !!permissions.length && (
                <MenuItem
                  data-cy="auditTrailButton"
                  className={view === "auditTrail" && "active"}
                  onClick={() => this.handleMenuClick("auditTrail")}
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
            <MobileTopRight>
              <CustomButton disabled={disableSave} data-cy="saveButton" onClick={onSave} className="btn-save">
                <IconSaveNew color={white} width={18} height={16} />
              </CustomButton>
            </MobileTopRight>
            <MobileBottom>
              <MenuList selectedKeys={[view]}>
                <MenuItem
                  onClick={() => this.handleMenuClick("edit")}
                  className={view === "edit" && "active"}
                  data-cy="editButton"
                >
                  <HeadIcon>
                    <IconPencilEdit color={white} width={18} height={16} />
                  </HeadIcon>
                  {withLabels ? "Edit Mode" : ""}
                </MenuItem>
                <MenuItem
                  onClick={() => this.handleMenuClick("preview")}
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
                  onClick={() => this.handleMenuClick("metadata")}
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
  onSaveScrollTop: PropTypes.func.isRequired,
  disableSave: PropTypes.func.isRequired // to disable/enable save and publish button
};

ButtonBar.defaultProps = {
  onShowSettings: () => {},
  renderRightSide: () => {},
  onEnableEdit: () => {},
  renderExtra: () => null,
  isTestFlow: false,
  withLabels: false
  // saving: false,
};

const enhance = compose(
  withRouter,
  withWindowSizes,
  withNamespaces("author"),
  connect(
    state => ({
      permissions: get(state, ["user", "user", "permissions"])
    }),
    {
      clearAnswers: clearAnswersAction
    }
  )
);

export default enhance(ButtonBar);
