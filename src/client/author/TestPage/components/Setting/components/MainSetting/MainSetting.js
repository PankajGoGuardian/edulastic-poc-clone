import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Anchor, Input, Row, Col, Radio } from "antd";

import { withWindowScroll } from "@edulastic/common";
import { test } from "@edulastic/constants";
import { IconCaretDown } from "@edulastic/icons";

import { setMaxAttemptsAction, setSafeBroswePassword } from "../../ducks";
import { setTestDataAction, getTestEntitySelector } from "../../../../ducks";
import UiTime from "../UiTime/UiTime";
import { isFeatureAccessible } from "../../../../../../features/components/FeaturesSwitch";

import TestType from "./blocks/TestType";
import MaximumAttemptsAllowed from "./blocks/MaximumAttemptsAllowed";
import MarkAsDone from "./blocks/MarkAsDone";
import ReleaseScores from "./blocks/ReleaseScores";
import RequireSafeExamBrowser from "./blocks/RequireSafeExamBrowser";
import ShuffleQuestions from "./blocks/ShuffleQuestions";
import ShuffleAnswerChoice from "./blocks/ShuffleAnswerChoice";
import ShowCalculator from "./blocks/ShowCalculator";
import AnswerOnPaper from "./blocks/AnswerOnPaper";
import RequirePassword from "./blocks/RequirePassword";
import CheckAnswerTriesPerQuestion from "./blocks/CheckAnswerTriesPerQuestion";
import EvaluationMethod from "./blocks/EvaluationMethod";
import PerformanceBands from "./blocks/PerformanceBands";

import {
  StyledAnchor,
  RadioGroup,
  InputTitle,
  Body,
  Title,
  Block,
  AdvancedSettings,
  AdvancedButton,
  RadioWrapper,
  ActivityInput,
  Container,
  NavigationMenu
} from "./styled";
import { getUserFeatures, getUserRole } from "../../../../../../student/Login/ducks";

const { settingCategories, settingCategoriesFeatureMap, navigations, accessibilities } = test;

class MainSetting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      enable: true,
      showAdvancedOption: false
    };
  }

  advancedHandler = () => {
    const { showAdvancedOption } = this.state;
    this.setState({ showAdvancedOption: !showAdvancedOption });
  };

  enableHandler = e => {
    this.setState({ enable: e.target.value });
  };

  render() {
    const { enable, showAdvancedOption } = this.state;
    const { history, windowWidth, entity, owner, userRole, isEditable, features, windowScrollTop } = this.props;

    const { maxAttempts } = entity;

    const isSmallSize = windowWidth < 993 ? 1 : 0;

    const availableFeatures = settingCategories.slice(0, -5).map(category => {
      if (
        features[settingCategoriesFeatureMap[category.id]] ||
        isFeatureAccessible({
          features: this.props.features,
          inputFeatures: settingCategoriesFeatureMap[category.id],
          gradeSubject: { grades, subjects }
        })
      ) {
        return settingCategoriesFeatureMap[category.id];
      }
    });

    return (
      <Container>
        <Row style={{ padding: 0 }}>
          <Col span={isSmallSize ? 0 : 6}>
            <NavigationMenu fixed={windowScrollTop >= 90}>
              <StyledAnchor affix={false} offsetTop={125}>
                {settingCategories.slice(0, -5).map(category => {
                  if (availableFeatures[settingCategoriesFeatureMap[category.id]]) {
                    return (
                      <Anchor.Link
                        key={category.id}
                        href={`${history.location.pathname}#${category.id}`}
                        title={category.title.toLowerCase()}
                      />
                    );
                  }
                  return null;
                })}
              </StyledAnchor>
              {/* Hiding temporarly for deploying */}
              {/* <AdvancedButton onClick={this.advancedHandler} show={showAdvancedOption}>
                {showAdvancedOption ? "HIDE ADVANCED OPTIONS" : "SHOW ADVANCED OPTIONS"}
                <IconCaretDown width={11} height={6} />
              </AdvancedButton>
              {showAdvancedOption && (
                <StyledAnchor affix={false} offsetTop={125}>
                  {settingCategories.slice(-5).map(category => (
                    <Anchor.Link
                      key={category.id}
                      href={`${history.location.pathname}#${category.id}`}
                      title={category.title.toLowerCase()}
                    />
                  ))}
                </StyledAnchor>
              )} */}
            </NavigationMenu>
          </Col>
          <Col span={isSmallSize ? 24 : 18}>
            <TestType
              windowWidth={windowWidth}
              entity={entity}
              owner={owner}
              userRole={userRole}
              isEditable={isEditable}
              features={availableFeatures}
            />
            <MaximumAttemptsAllowed owner={owner} isEditable={isEditable} maxAttempts={maxAttempts} />
            <MarkAsDone
              windowWidth={windowWidth}
              entity={entity}
              owner={owner}
              isEditable={isEditable}
              features={availableFeatures}
            />
            <ReleaseScores windowWidth={windowWidth} entity={entity} owner={owner} isEditable={isEditable} />
            <RequireSafeExamBrowser windowWidth={windowWidth} entity={entity} owner={owner} isEditable={isEditable} />
            <ShuffleQuestions windowWidth={windowWidth} entity={entity} owner={owner} isEditable={isEditable} />
            <ShuffleAnswerChoice windowWidth={windowWidth} entity={entity} owner={owner} isEditable={isEditable} />
            <ShowCalculator windowWidth={windowWidth} entity={entity} owner={owner} isEditable={isEditable} />
            <AnswerOnPaper windowWidth={windowWidth} entity={entity} owner={owner} isEditable={isEditable} />
            <RequirePassword windowWidth={windowWidth} entity={entity} owner={owner} isEditable={isEditable} />
            <CheckAnswerTriesPerQuestion
              windowWidth={windowWidth}
              entity={entity}
              owner={owner}
              isEditable={isEditable}
            />
            <EvaluationMethod windowWidth={windowWidth} entity={entity} owner={owner} isEditable={isEditable} />
            <PerformanceBands windowWidth={windowWidth} entity={entity} owner={owner} isEditable={isEditable} />

            <AdvancedSettings style={{ display: isSmallSize || showAdvancedOption ? "block" : "none" }}>
              <Block id="title" smallSize={isSmallSize}>
                <Title>Title</Title>
                <Body smallSize={isSmallSize}>
                  <RadioGroup disabled={!owner || !isEditable} onChange={this.enableHandler} defaultValue={enable}>
                    <Radio style={{ display: "block", marginBottom: "24px" }} value>
                      Enable
                    </Radio>
                    <Radio style={{ display: "block", marginBottom: "24px" }} value={false}>
                      Disable
                    </Radio>
                  </RadioGroup>
                  <Row gutter={28}>
                    <Col span={12}>
                      <InputTitle>Activity Title</InputTitle>
                      <ActivityInput disabled={!owner || !isEditable} placeholder="Title of activity" />
                    </Col>
                  </Row>
                </Body>
              </Block>

              <Block id="navigations" smallSize={isSmallSize}>
                <Title>Navigation / Control</Title>
                <RadioWrapper style={{ marginTop: "29px" }}>
                  {navigations.map(navigation => (
                    <Row key={navigation} style={{ width: "100%", marginBottom: 15 }}>
                      <Col span={8}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{navigation}</span>
                      </Col>
                      <Col span={16}>
                        <RadioGroup
                          disabled={!owner || !isEditable}
                          onChange={this.enableHandler}
                          defaultValue={enable}
                        >
                          <Radio>Enable</Radio>
                          <Radio value={false}>Disable</Radio>
                        </RadioGroup>
                      </Col>
                    </Row>
                  ))}
                </RadioWrapper>
                <Body smallSize={isSmallSize}>
                  <Row gutter={28}>
                    <Col span={12}>
                      <InputTitle>On Submit Redirect URL</InputTitle>
                      <ActivityInput placeholder="https://edulastic.com/" />
                    </Col>
                    <Col span={12}>
                      <InputTitle>On Discard Redirect URL</InputTitle>
                      <ActivityInput placeholder="https://edulastic.com/" />
                    </Col>
                    <Col span={12} style={{ paddingTop: 15 }}>
                      <InputTitle>On Save Redirect URL</InputTitle>
                      <ActivityInput placeholder="https://edulastic.com/" />
                    </Col>
                  </Row>
                </Body>
              </Block>

              <Block id="accessibility" smallSize={isSmallSize}>
                <Title>Accessibility</Title>
                <RadioWrapper disabled={!owner || !isEditable} style={{ marginTop: "29px", marginBottom: 0 }}>
                  {Object.keys(accessibilities).map(item => (
                    <Row key={accessibilities[item]} style={{ width: "100%" }}>
                      <Col span={8}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{accessibilities[item]}</span>
                      </Col>
                      <Col span={16}>
                        <RadioGroup
                          disabled={!owner || !isEditable}
                          onChange={this.enableHandler}
                          defaultValue={enable}
                        >
                          <Radio value>Enable</Radio>
                          <Radio value={false}>Disable</Radio>
                        </RadioGroup>
                      </Col>
                    </Row>
                  ))}
                </RadioWrapper>
              </Block>

              <UiTime />

              <Block id="administration" smallSize={isSmallSize}>
                <Title>Administration</Title>
                <RadioWrapper style={{ marginTop: "29px" }}>
                  <Row style={{ width: "100%", marginBottom: 15 }}>
                    <Col span={8}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>Configuration Panel</span>
                    </Col>
                    <Col span={16}>
                      <RadioGroup disabled={!owner || !isEditable} onChange={this.enableHandler} defaultValue={enable}>
                        <Radio value>Enable</Radio>
                        <Radio value={false}>Disable</Radio>
                      </RadioGroup>
                    </Col>
                  </Row>
                </RadioWrapper>
                <Body style={{ marginTop: 0, marginBottom: "15px" }} smallSize={isSmallSize}>
                  <Row gutter={28}>
                    <Col span={12}>
                      <InputTitle>Password</InputTitle>
                      <Input disabled={!owner || !isEditable} placeholder="Your Password" />
                    </Col>
                  </Row>
                </Body>
                <RadioWrapper>
                  <Row style={{ width: "100%" }}>
                    <Col span={8}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>Save & Quit</span>
                    </Col>
                    <Col span={16}>
                      <RadioGroup disabled={!owner || !isEditable} onChange={this.enableHandler} defaultValue={enable}>
                        <Radio value>Enable</Radio>
                        <Radio value={false}>Disable</Radio>
                      </RadioGroup>
                    </Col>
                  </Row>
                </RadioWrapper>

                <RadioWrapper>
                  <Row style={{ width: "100%" }}>
                    <Col span={8}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>Exit & Discard</span>
                    </Col>
                    <Col span={16}>
                      <RadioGroup disabled={!owner || !isEditable} onChange={this.enableHandler} defaultValue={enable}>
                        <Radio value>Enable</Radio>
                        <Radio value={false}>Disable</Radio>
                      </RadioGroup>
                    </Col>
                  </Row>
                </RadioWrapper>

                <RadioWrapper style={{ marginBottom: 0 }}>
                  <Row style={{ width: "100%" }}>
                    <Col span={8}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>Extend Assessment Time</span>
                    </Col>
                    <Col span={16}>
                      <RadioGroup disabled={!owner || !isEditable} onChange={this.enableHandler} defaultValue={enable}>
                        <Radio value>Enable</Radio>
                        <Radio value={false}>Disable</Radio>
                      </RadioGroup>
                    </Col>
                  </Row>
                </RadioWrapper>
              </Block>
            </AdvancedSettings>
          </Col>
        </Row>
      </Container>
    );
  }
}

MainSetting.propTypes = {
  features: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  windowWidth: PropTypes.number.isRequired,
  owner: PropTypes.bool,
  userRole: PropTypes.string,
  isEditable: PropTypes.bool,
  entity: PropTypes.object.isRequired,
  windowScrollTop: PropTypes.number.isRequired
};

MainSetting.defaultProps = {
  owner: false,
  userRole: "",
  isEditable: false
};

export default connect(
  state => ({
    entity: getTestEntitySelector(state),
    features: getUserFeatures(state),
    userRole: getUserRole(state)
  }),
  {
    setMaxAttempts: setMaxAttemptsAction,
    setSafePassword: setSafeBroswePassword,
    setTestData: setTestDataAction
  }
)(withWindowScroll(MainSetting));
