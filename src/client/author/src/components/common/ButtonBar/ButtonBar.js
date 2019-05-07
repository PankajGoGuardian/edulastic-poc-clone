import React, { Component } from "react";
import PropTypes from "prop-types";
import { Menu, Button } from "antd";
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
import { white, newBlue } from "@edulastic/colors";
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
  MobileSecondContainer
} from "./styled_components";

class ButtonBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: "edit"
    };
  }

  handleMenuClick = view => {
    const { onChangeView } = this.props;
    onChangeView(view);
    this.setState({ current: view });
  };

  optionHandler = key => {
    const { onChangeView } = this.props;
    onChangeView(key);
    this.setState({ current: key });
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
      clearAnswers,
      showPublishButton,
      view,
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
              selectedKeys={[current]}
              style={{ marginLeft: 10, marginRight: 10, justifyContent: "center" }}
            >
              <MenuItem
                data-cy="editButton"
                className={current === "edit" && "active"}
                onClick={() => this.handleMenuClick("edit")}
              >
                <HeadIcon>
                  <IconPencilEdit color={white} width={18} height={16} />
                </HeadIcon>
                Edit Mode
              </MenuItem>
              <MenuItem
                data-cy="previewButton"
                className={current === "preview" && "active"}
                onClick={() => this.handleMenuClick("preview")}
              >
                <HeadIcon>
                  <IconEye color={white} width={18} height={16} />
                </HeadIcon>
                Preview mode
              </MenuItem>
              <MenuItem
                data-cy="metadataButton"
                className={current === "metadata" && "active"}
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
                {showPublishButton && itemStatus === "draft" && (
                  <Button data-cy="publish" onClick={onPublishTestItem}>
                    Publish
                  </Button>
                )}
                {(showPublishButton || showPublishButton === undefined) && (
                  <Button data-cy="saveButton" onClick={onSave}>
                    <HeadIcon>
                      <IconSaveNew color={newBlue} width={20.4} height={20.4} />
                    </HeadIcon>
                    Save
                  </Button>
                )}
                {!(showPublishButton || showPublishButton === undefined) && (
                  <Button data-cy="edit" style={{ width: 120 }} size="large" onClick={onEnableEdit}>
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
                onClick={() => this.optionHandler("edit")}
                className={`btn-edit ${current === "edit" && "active"}`}
              >
                <HeadIcon>
                  <IconPencilEdit color={white} width={18} height={16} />
                </HeadIcon>
                {withLabels ? "Edit Mode" : ""}
              </Button>
              <Button
                onClick={() => this.optionHandler("preview")}
                className={`btn-preview ${current === "preview" && "active"}`}
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
            {current === "preview" && (
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
                  onClick={() => {
                    clearAnswers();
                    changePreviewTab("clear");
                  }}
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
  onEnableEdit: PropTypes.func,
  clearAnswers: PropTypes.func.isRequired,
  renderExtra: PropTypes.func,
  renderRightSide: PropTypes.func,
  withLabels: PropTypes.bool
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
