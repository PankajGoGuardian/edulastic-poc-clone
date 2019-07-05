import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Row, Col, List } from "antd";

import { test } from "@edulastic/constants";

import { setMaxAttemptsAction, setSafeBroswePassword } from "../../../ducks";
import { setTestDataAction, getTestEntitySelector } from "../../../../../ducks";
import ListCard from "../../Card/Card";

import { Title, Block, NormalText } from "../styled";
import FeaturesSwitch from "../../../../../../../features/components/FeaturesSwitch";
import { getUserFeatures, getUserRole } from "../../../../../../../student/Login/ducks";

const { performanceBandsData } = test;

class PerformanceBands extends Component {
  onPerformanceBandUpdate = item => {
    const { setTestData, entity = {} } = this.props;
    const { performanceBands } = entity;
    const newPerformanceBands = {
      ...performanceBands,
      [item]: {
        ...performanceBands[item],
        isAbove: !performanceBands[item].isAbove
      }
    };
    setTestData({
      performanceBands: newPerformanceBands
    });
  };

  render() {
    const { windowWidth, owner, isEditable } = this.props;

    const isSmallSize = windowWidth < 993 ? 1 : 0;

    return (
      <FeaturesSwitch inputFeatures="performanceBands" actionOnInaccessible="hidden">
        <Block id="performance-bands" smallSize={isSmallSize}>
          <Row style={{ marginBottom: 18, display: "flex", alignItems: "center" }}>
            <Col span={6}>
              <Title>Performance Bands</Title>
            </Col>
            <Col span={6} style={{ display: "flex", justifyContent: "center" }}>
              <NormalText>Above or At Standard</NormalText>
            </Col>
            <Col span={6} style={{ display: "flex", justifyContent: "center" }}>
              <NormalText>From</NormalText>
            </Col>
            <Col span={6} style={{ display: "flex", justifyContent: "center" }}>
              <NormalText>To</NormalText>
            </Col>
          </Row>
          <List
            grid={{ column: 1 }}
            dataSource={Object.keys(performanceBandsData)}
            renderItem={item => (
              <List.Item>
                <ListCard
                  item={performanceBandsData[item]}
                  owner={owner}
                  isEditable={isEditable}
                  onPerformanceBandUpdate={() => this.onPerformanceBandUpdate(item)}
                />
              </List.Item>
            )}
          />
        </Block>
      </FeaturesSwitch>
    );
  }
}

PerformanceBands.propTypes = {
  windowWidth: PropTypes.number.isRequired,
  setTestData: PropTypes.func.isRequired,
  owner: PropTypes.bool,
  isEditable: PropTypes.bool,
  entity: PropTypes.object.isRequired
};

PerformanceBands.defaultProps = {
  owner: false,
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
)(PerformanceBands);
