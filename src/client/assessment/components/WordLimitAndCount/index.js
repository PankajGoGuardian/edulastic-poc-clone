import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { Input, Select, Col } from "antd";

import { withNamespaces } from "@edulastic/localization";
import { FlexContainer } from "@edulastic/common";

import { Subtitle } from "../../styled/Subtitle";

import { ON_LIMIT, ALWAYS, OFF } from "../../constants/constantsForQuestions";
import { AdaptiveRow } from "./styled/AdaptiveRow";

import { LabelText } from "./styled/LabelText";

const { Option } = Select;

class WordLimitAndCount extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);
    fillSections("advanced", t("component.essayText.scoring"), node.offsetTop);
  };

  componentDidUpdate(prevProps) {
    const { advancedAreOpen, fillSections, t } = this.props;

    const node = ReactDOM.findDOMNode(this);

    if (prevProps.advancedAreOpen !== advancedAreOpen) {
      fillSections("advanced", t("component.essayText.scoring"), node.offsetTop);
    }
  }

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { onChange, selectValue, inputValue, withOutTopMargin, t, showHeading } = this.props;

    const options = [
      { value: ON_LIMIT, label: t("component.essayText.onLimit") },
      { value: ALWAYS, label: t("component.essayText.alwaysVisible") },
      { value: OFF, label: t("component.essayText.off") }
    ];

    return (
      <Fragment>
        {showHeading && (
          <Subtitle padding={withOutTopMargin ? "0px 0 16px 0" : ""}>{t("component.essayText.scoring")}</Subtitle>
        )}
        <AdaptiveRow gutter={70}>
          <Col span={12}>
            <LabelText>{t("component.essayText.wordsLimitTitle")}</LabelText>
            <Select
              style={{ width: "100%", marginTop: 10 }}
              size="large"
              value={selectValue}
              onChange={val => onChange("show_word_limit", val)}
            >
              {options.map((item, i) => {
                const { label, value } = item;
                return (
                  <Option key={i} value={value}>
                    {label}
                  </Option>
                );
              })}
            </Select>
          </Col>
          <Col span={12}>
            <FlexContainer style={{ marginTop: 31 }}>
              <Input
                size="large"
                style={{ width: 120 }}
                value={inputValue}
                onChange={e => onChange("max_word", e.target.value)}
              />
              <LabelText>{t("component.essayText.wordsLimitTitle")}</LabelText>
            </FlexContainer>
          </Col>
        </AdaptiveRow>
      </Fragment>
    );
  }
}

WordLimitAndCount.propTypes = {
  onChange: PropTypes.func.isRequired,
  selectValue: PropTypes.string.isRequired,
  inputValue: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
  withOutTopMargin: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  showHeading: PropTypes.bool
};

WordLimitAndCount.defaultProps = {
  showHeading: true,
  withOutTopMargin: false,
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(WordLimitAndCount);
