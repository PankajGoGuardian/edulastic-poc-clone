import React, { Component } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";

import { themeColor, themeLightGrayColor } from "@edulastic/colors";
import { withNamespaces } from "@edulastic/localization";
import { Button, Tabs, Tab, FlexContainer } from "@edulastic/common";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

import { Subtitle } from "../../styled/Subtitle";

import { IconClose } from "./styled/IconClose";
import styled from "styled-components";
import { AlternateAnswerLink } from "../../styled/ButtonStyles";

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

  renderLabel = index => {
    const { t, onCloseTab } = this.props;
    return (
      <FlexContainer style={{ marginBottom: 0, marginTop: 0 }}>
        <span>
          {t("component.correctanswers.alternate")} {index + 1}
        </span>
        <IconClose
          style={{
            marginLeft: "auto"
          }}
          onClick={e => {
            e.stopPropagation();
            onCloseTab(index);
            this.updateCountTabs(this.calcMaxAltLen());
          }}
          data-cy="del-alter"
        />
      </FlexContainer>
    );
  };

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

  renderPlusButton = () => {
    const { onTabChange, onAdd, t } = this.props;
    return (
      <AlternateAnswerLink
        onClick={() => {
          onTabChange();
          onAdd();
        }}
        color="primary"
        variant="extendedFab"
        data-cy="alternate"
      >
        {`+ ${t("component.correctanswers.alternativeAnswer")}`}
      </AlternateAnswerLink>
    );
  };

  render() {
    const { t, onTabChange, children, correctTab, options, fillSections, cleanSections, questionType } = this.props;
    const { tabs } = this.state;

    return (
      <div
        section="main"
        label={t("component.correctanswers.setcorrectanswers")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle
          margin="0 0 6px"
          id={getFormattedAttrId(`${questionType}-${t("component.correctanswers.setcorrectanswers")}`)}
        >
          {t("component.correctanswers.setcorrectanswers")}
        </Subtitle>
        <AddAlternative>
          {this.renderPlusButton()}
          <Tabs value={correctTab} onChange={onTabChange} style={{ marginBottom: 10, marginTop: 20 }}>
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
        </AddAlternative>
        {children}
        {options}
      </div>
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
  cleanSections: PropTypes.func
};

CorrectAnswers.defaultProps = {
  options: null,
  children: undefined,
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(CorrectAnswers);

const AddAlternative = styled.div`
  width: 100%;
  float: right;
  margin-top: 30px;
  position: relative;
  z-index: 1;
`;
