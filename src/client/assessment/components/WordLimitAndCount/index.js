import { FlexContainer } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { Input, Select } from "antd";
import PropTypes from "prop-types";
import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { ALWAYS, OFF, ON_LIMIT } from "../../constants/constantsForQuestions";
import { Subtitle } from "../../styled/Subtitle";
import { Row } from "../../styled/WidgetOptions/Row";
import { Col } from "../../styled/WidgetOptions/Col";
import { Label } from "../../styled/WidgetOptions/Label";
import { TextInputStyled, SelectInputStyled } from "../../styled/InputStyles";

const { Option } = Select;

class WordLimitAndCount extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);
    fillSections("advanced", t("component.essayText.scoring"), node.offsetTop, node.scrollHeight);
  };

  componentDidUpdate(prevProps) {
    const { advancedAreOpen, fillSections, t } = this.props;

    const node = ReactDOM.findDOMNode(this);

    if (prevProps.advancedAreOpen !== advancedAreOpen) {
      fillSections("advanced", t("component.essayText.scoring"), node.offsetTop, node.scrollHeight);
    }
  }

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { onChange, selectValue, inputValue, t, showHeading } = this.props;

    const options = [
      { value: ON_LIMIT, label: t("component.essayText.onLimit") },
      { value: ALWAYS, label: t("component.essayText.alwaysVisible") },
      { value: OFF, label: t("component.essayText.off") }
    ];

    return (
      <Fragment>
        {showHeading && <Subtitle>{t("component.essayText.wordsLimitTitle")}</Subtitle>}
        <Row gutter={24} type="flex" align="bottom">
          <Col span={12}>
            <Label>{t("component.essayText.wordsLimitTitle")}</Label>
            <SelectInputStyled size="large" value={selectValue} onChange={val => onChange("showWordLimit", val)}>
              {options.map((item, i) => {
                const { label, value } = item;
                return (
                  <Option key={i} value={value}>
                    {label}
                  </Option>
                );
              })}
            </SelectInputStyled>
          </Col>
          <Col span={12}>
            <Row type="flex" justify="start" align="middle">
              <TextInputStyled
                size="large"
                width="120px"
                value={inputValue}
                onChange={e => {
                  const val = parseInt(e.target.value);
                  if ((!isNaN(e.target.value) && val > 0) || e.target.value === "") {
                    onChange("maxWord", val || "");
                  }
                }}
              />
              <Label style={{ margin: "0px 0px 0px 15px" }}>{t("component.essayText.wordsLimitTitle")}</Label>
            </Row>
          </Col>
        </Row>
      </Fragment>
    );
  }
}

WordLimitAndCount.propTypes = {
  onChange: PropTypes.func.isRequired,
  selectValue: PropTypes.string.isRequired,
  inputValue: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  showHeading: PropTypes.bool
};

WordLimitAndCount.defaultProps = {
  showHeading: true,
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(WordLimitAndCount);

const StyledFlexContainer = styled(FlexContainer)`
  justify-content: center;
  label {
    margin-left: 10px;
  }
`;
