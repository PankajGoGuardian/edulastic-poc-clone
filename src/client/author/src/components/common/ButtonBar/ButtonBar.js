import { debounce, get } from "lodash";
import { themeColor, white } from "@edulastic/colors";
import { HeaderTabs, withWindowSizes, EduButton } from "@edulastic/common";
import { StyledTabs } from "@edulastic/common/src/components/HeaderTabs";
import { HeaderMidContainer } from "@edulastic/common/src/components/MainHeader";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import {
  IconCheck,
  IconClose,
  IconEraseText,
  IconEye,
  IconMetadata,
  IconPencilEdit,
  IconPreview,
  IconSaveNew
} from "@edulastic/icons";
import { withNamespaces } from "@edulastic/localization";
import { roleuser } from "@edulastic/constants";
import { Button } from "antd";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { ButtonLink } from "..";
import { clearEvaluationAction } from "../../../../../assessment/actions/evaluation";
import { Tooltip } from "../../../../../common/utils/helpers";
import { getCurrentQuestionSelector } from "../../../../sharedDucks/questions";
import { clearAnswersAction } from "../../../actions/answers";
import { MAX_TAB_WIDTH } from "../../../constants/others";
import {
  Container,
  CustomButton,
  HeadIcon,
  MenuItem,
  MenuList,
  MobileBottom,
  MobileContainer,
  MobileSecondContainer,
  MobileTopRight,
  RightSide
} from "./styled_components";
import { getUserRole } from "../../../selectors/user";

class ButtonBar extends Component {
  handleMenuClick = view => () => {
    const { onChangeView, clearEvaluation, onSaveScrollTop, view: currentView, changePreviewTab } = this.props;

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

  handleSave = debounce(() => {
    const { onSave } = this.props;
    onSave();
  }, 1000);

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
      permissions,
      qTitle,
      userRole
    } = this.props;
    return (
      <React.Fragment>
        {windowWidth > MAX_TAB_WIDTH ? (
          <Container>
            <HeaderMidContainer style={{ width: "100%" }}>
              <StyledTabs selectedKeys={[view]}>
                {hasAuthorPermission && (
                  <HeaderTabs
                    id={getFormattedAttrId(`${qTitle}-edit`)}
                    dataCy="editButton"
                    isActive={view === "edit"}
                    icon={<IconPencilEdit color={white} width={18} height={16} />}
                    linkLabel="Edit Mode"
                    onClickHandler={this.handleMenuClick("edit")}
                  />
                )}
                <HeaderTabs
                  id={getFormattedAttrId(`${qTitle}-preview-mode`)}
                  dataCy="previewButton"
                  isActive={view === "preview"}
                  icon={<IconEye color={white} width={18} height={16} />}
                  linkLabel="Preview mode"
                  onClickHandler={this.handleMenuClick("preview")}
                />
                {showMetaData && (
                  <HeaderTabs
                    id={getFormattedAttrId(`${qTitle}-metadata`)}
                    dataCy="metadataButton"
                    isActive={view === "metadata"}
                    icon={<IconMetadata color={white} width={18} height={16} />}
                    linkLabel="Meta data"
                    onClickHandler={this.handleMenuClick("metadata")}
                  />
                )}
                {hasAuthorPermission && showAuditTrail && !!permissions.length && (
                  <HeaderTabs
                    id={getFormattedAttrId(`${qTitle}-auditTrail`)}
                    dataCy="auditTrailButton"
                    isActive={view === "auditTrail"}
                    icon={<IconPencilEdit color={white} width={18} height={16} />}
                    linkLabel="Audit trail"
                    onClickHandler={this.handleMenuClick("auditTrail")}
                  />
                )}
              </StyledTabs>
            </HeaderMidContainer>

            {hasAuthorPermission && (
              <RightSide>
                {renderRightSide()}
                {(showPublishButton || showPublishButton === undefined) &&
                  (itemStatus === "draft" ? (
                    <>
                      {isTestFlow && (
                        <EduButton data-cy="saveCancel" onClick={onCancel}>
                          <IconClose />
                          CANCEL
                        </EduButton>
                      )}
                      <Tooltip title="Save">
                        <EduButton
                          id={getFormattedAttrId(`${qTitle}-save`)}
                          disabled={disableSave}
                          data-cy="saveButton"
                          onClick={this.handleSave}
                        >
                          <IconSaveNew />
                          SAVE
                        </EduButton>
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      {isTestFlow && (
                        <EduButton onClick={onCancel}>
                          <IconClose />
                          CANCEL
                        </EduButton>
                      )}
                      <EduButton
                        disabled={disableSave}
                        data-cy="saveButton"
                        onClick={onSave}
                        id={getFormattedAttrId(`${qTitle}-save`)}
                      >
                        <IconSaveNew />
                        SAVE
                      </EduButton>
                    </>
                  ))}
                {showPublishButton && itemStatus === "draft" && !isTestFlow && userRole !== roleuser.EDULASTIC_CURATOR && (
                  <EduButton disabled={disableSave} data-cy="publishItem" onClick={onPublishTestItem}>
                    PUBLISH
                  </EduButton>
                )}
                {!(showPublishButton || showPublishButton === undefined) && (
                  <EduButton data-cy="editItem" onClick={onEnableEdit} width="120px">
                    EDIT
                  </EduButton>
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
                id={getFormattedAttrId(`${qTitle}-save`)}
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
                  id={getFormattedAttrId(`${qTitle}-edit`)}
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
                  id={getFormattedAttrId(`${qTitle}-preview-mode`)}
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
                  id={getFormattedAttrId(`${qTitle}-metadata`)}
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
  onPublishTestItem: PropTypes.func,
  showPublishButton: PropTypes.bool,
  view: PropTypes.string.isRequired,
  hasAuthorPermission: PropTypes.bool,
  itemStatus: PropTypes.any,
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
    state => {
      const { multipartItem, isPassageWithQuestions, canAddMultipleItems, data = {} } = get(
        state,
        ["itemDetail", "item"],
        {}
      );
      const isMultipart = multipartItem || isPassageWithQuestions || canAddMultipleItems || data.questions?.length > 1;
      return {
        permissions: get(state, ["user", "user", "permissions"], []),
        qTitle: isMultipart ? "compination-multipart" : getCurrentQuestionSelector(state)?.title,
        userRole: getUserRole(state)
      };
    },
    {
      clearAnswers: clearAnswersAction,
      clearEvaluation: clearEvaluationAction
    }
  )
);

export default enhance(ButtonBar);
