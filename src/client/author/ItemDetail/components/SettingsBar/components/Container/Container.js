import { themeColor, title } from "@edulastic/colors";
import { Button, CheckboxLabel } from "@edulastic/common";
import { IconClose } from "@edulastic/icons";
import { withNamespaces } from "@edulastic/localization";
import { Col, Row, Switch } from "antd";
import PropTypes from "prop-types";
import React, { Component } from "react";
import ReactOutsideEvent from "react-outside-event";
import SettingsBarItem from "../SettingsBarItem/SettingsBarItem";
import SettingsBarUseTabs from "../SettingsBarUseTabs/SettingsBarUseTabs";
import SettingsFlowLayout from "../SettingsFlowLayout/SettingFlowLayout";
import { Checkboxes, Content, Heading, Items, SettingsButtonWrapper } from "./styled";

const layouts = [
  {
    value: "100-100",
    text: "Single column"
  },
  {
    value: "30-70",
    text: "30 | 70"
  },
  {
    value: "70-30",
    text: "70 | 30"
  },
  {
    value: "50-50",
    text: "50 | 50"
  },
  {
    value: "40-60",
    text: "40 | 60"
  },
  {
    value: "60-40",
    text: "60 | 40"
  }
];

class Container extends Component {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    onApply: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    useFlowLayout: PropTypes.func.isRequired,
    useTabs: PropTypes.func.isRequired,
    useTabsLeft: PropTypes.bool.isRequired,
    useTabsRight: PropTypes.bool.isRequired,
    useFlowLayoutLeft: PropTypes.bool.isRequired,
    verticalDivider: PropTypes.bool.isRequired,
    scrolling: PropTypes.bool.isRequired,
    onVerticalDividerChange: PropTypes.func.isRequired,
    onScrollingChange: PropTypes.func.isRequired,
    useFlowLayoutRight: PropTypes.bool,
    itemLevelScoring: PropTypes.bool,
    setItemLevelScoring: PropTypes.func.isRequired,
    isSingleQuestion: PropTypes.bool
  };

  static defaultProps = {
    useFlowLayoutRight: false,
    itemLevelScoring: true,
    isSingleQuestion: false
  };

  handleCheckboxChange = name => () => {
    this.setState(state => ({
      [name]: !state[name]
    }));
  };

  handleRemoveTag = () => {};

  handleChangeLeftTab = () => {
    const { useTabs, useTabsLeft } = this.props;
    useTabs({ rowIndex: 0, isUseTabs: !useTabsLeft });
  };

  handleChangeRightTab = () => {
    const { useTabs, useTabsRight } = this.props;
    useTabs({ rowIndex: 1, isUseTabs: !useTabsRight });
  };

  handleChangeLeftFlowLayout = () => {
    const { useFlowLayout, useFlowLayoutLeft } = this.props;
    useFlowLayout({ rowIndex: 0, isUseFlowLayout: !useFlowLayoutLeft });
  };

  handleChangeRightFlowLayout = () => {
    const { useFlowLayout, useFlowLayoutRight } = this.props;
    useFlowLayout({ rowIndex: 1, isUseFlowLayout: !useFlowLayoutRight });
  };

  onApplyLayoutClick = object => () => {
    const { onApply } = this.props;
    onApply(object);
  };

  onOutsideEvent = event => {
    const { onCancel } = this.props;

    if (event.type === "mousedown") {
      onCancel();
    }
  };

  handleMultipart = () => {
    const { setMultipart, onCancel, saveTestItem } = this.props;
    setMultipart(true);
    saveTestItem();
    onCancel();
  };

  render() {
    const {
      onCancel,
      type,
      t,
      useTabsLeft,
      useTabsRight,
      useFlowLayoutLeft,
      useFlowLayoutRight,
      verticalDivider,
      scrolling,
      onVerticalDividerChange,
      onScrollingChange,
      itemLevelScoring,
      setItemLevelScoring,
      questionsCount,
      isSingleQuestion = false,
      isMultipart,
      isMultiDimensionLayout,
      isPassageQuestion
    } = this.props;
    const singleLayout = type === layouts[0].value;

    const multipleItemsSettings = () => (
      <>
        <SettingsButtonWrapper justifyContent="flex-end">
          <Button
            color="primary"
            onClick={onCancel}
            style={{ minWidth: 40, background: "transparent", padding: 0, boxShadow: "none" }}
          >
            <IconClose color={title} />
          </Button>
        </SettingsButtonWrapper>
        <Heading>{t("author:component.settingsBar.layout")}</Heading>
        <Items>
          {layouts.map(item => (
            <SettingsBarItem
              onSelect={this.onApplyLayoutClick({ type: item.value })}
              selected={type === item.value}
              key={item.value}
              item={item}
            />
          ))}
        </Items>
        <SettingsBarUseTabs
          onChangeLeft={this.handleChangeLeftTab}
          onChangeRight={this.handleChangeRightTab}
          checkedLeft={useTabsLeft}
          checkedRight={useTabsRight}
          disableRight={singleLayout || (isMultipart && !isPassageQuestion && isMultiDimensionLayout)}
        />
        <SettingsFlowLayout
          onChangeLeft={this.handleChangeLeftFlowLayout}
          onChangeRight={this.handleChangeRightFlowLayout}
          checkedLeft={useFlowLayoutLeft}
          checkedRight={useFlowLayoutRight}
          disableRight={singleLayout}
        />
        {questionsCount > 1 && (
          <Row
            type="flex"
            style={{
              flexDirection: "column",
              borderRadius: "5px",
              boxShadow: "0 2px 5px 0 rgba(0,0,0,0.07)",
              padding: "15px",
              marginBottom: "50px",
              backgroundColor: "#fff"
            }}
          >
            <Row
              style={{
                color: themeColor,
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "15px"
              }}
            >
              Scoring Level
            </Row>
            <Row type="flex">
              <Col style={{ paddingRight: 5 }}>Item Level Scoring</Col>
              <Col>
                <Switch
                  checked={itemLevelScoring}
                  checkedChildren="on"
                  unCheckedChildren="off"
                  onChange={v => {
                    setItemLevelScoring(v);
                  }}
                />
              </Col>
            </Row>
          </Row>
        )}
        <Checkboxes>
          <CheckboxLabel style={{ marginBottom: 20 }} checked={verticalDivider} onChange={onVerticalDividerChange}>
            {t("author:component.settingsBar.showVerticalDivider")}
          </CheckboxLabel>
          <CheckboxLabel checked={scrolling} onChange={onScrollingChange}>
            {t("author:component.settingsBar.enableScrolling")}
          </CheckboxLabel>
        </Checkboxes>
      </>
    );

    return (
      <Content>
        {isSingleQuestion ? (
          <Checkboxes>
            <CheckboxLabel onChange={this.handleMultipart} value={isMultipart}>
              Convert item into a multipart
            </CheckboxLabel>
          </Checkboxes>
        ) : (
          multipleItemsSettings()
        )}
      </Content>
    );
  }
}

export default withNamespaces(["default", "author"])(ReactOutsideEvent(Container, ["mousedown"]));
