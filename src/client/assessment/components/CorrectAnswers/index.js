import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { isEmpty } from "lodash";

import { themeColor } from "@edulastic/colors";
import { withNamespaces } from "@edulastic/localization";
import { Button, Tabs, Tab, FlexContainer } from "@edulastic/common";

import { Subtitle } from "../../styled/Subtitle";
import Question from "../Question";

import { IconClose } from "./styled/IconClose";

class CorrectAnswers extends Component {
  state = {
    tabs: 1
  };

  calcMaxAltLen = () => {
    const { validation } = this.props;

    return validation.altResponses ? validation.altResponses.length : 0;
  };

  updateCountTabs = newCount => {
    const { tabs } = this.state;

    if (tabs !== newCount) {
      this.setState({
        tabs: newCount
      });
    }
  };

  renderLabel = index => (
    <FlexContainer style={{ marginBottom: 0, marginTop: 0 }}>
      <span>
        {this.props.t("component.correctanswers.alternate")} {index + 1}
      </span>
      <IconClose
        style={{
          marginLeft: "auto"
        }}
        onClick={e => {
          e.stopPropagation();
          this.props.onCloseTab(index);
          this.updateCountTabs(this.calcMaxAltLen());
        }}
        data-cy="del-alter"
      />
    </FlexContainer>
  );

  renderAltResponses = () => {
    const { validation } = this.props;

    const isAlt = !isEmpty(validation.altResponses);

    if (isAlt) {
      this.updateCountTabs(this.calcMaxAltLen() + 1);

      return new Array(this.calcMaxAltLen())
        .fill(true)
        .map((res, i) => <Tab key={i} label={this.renderLabel(i)} type="primary" />);
    }

    return null;
  };

  renderPlusButton = () => (
    <Button
      style={{
        background: "transparent",
        color: themeColor,
        borderRadius: 0,
        padding: 0,
        boxShadow: "none",
        marginLeft: "auto",
        minHeight: 28
      }}
      onClick={() => {
        this.props.onTabChange();
        this.props.onAdd();
      }}
      color="primary"
      variant="extendedFab"
      data-cy="alternate"
    >
      {`+ ${this.props.t("component.correctanswers.alternativeAnswer")}`}
    </Button>
  );

  render() {
    const { t, onTabChange, children, correctTab, options, fillSections, cleanSections } = this.props;
    const { tabs } = this.state;

    return (
      <Question
        section="main"
        label={t("component.correctanswers.setcorrectanswers")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <FlexContainer>
          <Subtitle margin="0 0 6px">{t("component.correctanswers.setcorrectanswers")}</Subtitle>
          {this.renderPlusButton()}
        </FlexContainer>
        <div>
          <Tabs value={correctTab} onChange={onTabChange} style={{ marginBottom: 10 }}>
            {tabs > 1 && (
              <Tab
                type="primary"
                data_cy="correct"
                label={t("component.correctanswers.correct")}
                borderRadius={tabs === 1}
                active={correctTab === 0}
              />
            )}
            {this.renderAltResponses()}
          </Tabs>
          {children}
        </div>
        {options}
      </Question>
    );
  }
}

CorrectAnswers.propTypes = {
  onTabChange: PropTypes.func.isRequired,
  onCloseTab: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  validation: PropTypes.object.isRequired,
  children: PropTypes.any,
  correctTab: PropTypes.number.isRequired,
  options: PropTypes.any,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  marginBottom: PropTypes.string
};

CorrectAnswers.defaultProps = {
  options: null,
  children: undefined,
  marginBottom: 0,
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(withNamespaces("assessment"));

export default enhance(CorrectAnswers);
