import React, { Component } from "react";
import PropTypes from "prop-types";
import { Menu, Button } from "antd";
import {
  IconSave,
  IconSource,
  IconPreview,
  IconSettings,
  IconPencilEdit,
  IconEye,
  IconCheck,
  IconEraseText,
  IconMetadata,
  IconSelected
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
  handleMenuClick = view => {
    const { onChangeView } = this.props;
    onChangeView(view);
  };

  optionHandler = key => {
    const { onChangeView } = this.props;
    onChangeView(key);
  };

  render() {
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
      hasAuthorPermission
    } = this.props;
    return (
      <React.Fragment>
        {windowWidth > 468 ? (
          <Container>
            <Menu mode="horizontal" selectedKeys={[view]} style={{ marginLeft: 80 }}>
              {hasAuthorPermission && (
                <MenuItem
                  data-cy="editButton"
                  className={view === "edit" && "active"}
                  onClick={() => this.handleMenuClick("edit")}
                >
                  <HeadIcon>
                    <IconSelected color={white} width={18} height={16} />
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
            <RightSide>
              {showPublishButton && <Button onClick={onPublishTestItem}>Publish</Button>}
              {(showPublishButton || showPublishButton === undefined) && (
                <Button data-cy="saveButton" onClick={onSave}>
                  <HeadIcon>
                    <IconSave color={newBlue} width={18} height={16} />
                  </HeadIcon>
                  Save
                </Button>
              )}
              {!(showPublishButton || showPublishButton === undefined) && hasAuthorPermission && (
                <Button style={{ width: 120 }} size="large" onClick={onEnableEdit}>
                  Edit
                </Button>
              )}
            </RightSide>
          </Container>
        ) : (
          <MobileContainer>
            <MobileFirstContainer>
              <Button onClick={() => this.optionHandler("edit")}>
                <HeadIcon>
                  <IconPencilEdit color={white} width={18} height={16} />
                </HeadIcon>
              </Button>
              <Button onClick={() => this.optionHandler("preview")}>
                <HeadIcon>
                  <IconPreview color={white} width={18} height={16} />
                </HeadIcon>
              </Button>
              <Button data-cy="saveButton" onClick={onSave}>
                <HeadIcon>
                  <IconSave color={white} width={18} height={16} />
                </HeadIcon>
              </Button>
              <Button onClick={onShowSource}>
                <HeadIcon>
                  <IconSource color={white} width={18} height={16} />
                </HeadIcon>
              </Button>
              <Button onClick={onShowSettings}>
                <HeadIcon>
                  <IconSettings color={white} width={24} height={16} />
                </HeadIcon>
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
  onEnableEdit: PropTypes.func.isRequired,
  clearAnswers: PropTypes.func.isRequired
};

ButtonBar.defaultProps = {
  onShowSettings: () => {}
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
