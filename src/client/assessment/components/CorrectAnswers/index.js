import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { compose } from "redux";

import { newBlue } from "@edulastic/colors";
import { withNamespaces } from "@edulastic/localization";
import { Button, Tabs, Tab, FlexContainer } from "@edulastic/common";

import { Subtitle } from "../../styled/Subtitle";

import { IconClose } from "./styled/IconClose";

class CorrectAnswers extends Component {
  state = {
    tabs: 1
  };

  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.correctanswers.setcorrectanswers"), node.offsetTop);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  updateCountTabs = newCount => {
    const { tabs } = this.state;

    if (tabs !== newCount) {
      this.setState({
        tabs: newCount
      });
    }
  };

  render() {
    const { t, onTabChange, children, correctTab, onAdd, validation, options, onCloseTab } = this.props;

    const { tabs } = this.state;

    const renderLabel = index => (
      <FlexContainer>
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
            this.updateCountTabs(validation.alt_responses.length);
          }}
          data-cy="del-alter"
        />
      </FlexContainer>
    );

    const renderAltResponses = () => {
      if (validation && validation.alt_responses && validation.alt_responses.length) {
        this.updateCountTabs(validation.alt_responses.length + 1);

        return validation.alt_responses.map((res, i) => <Tab key={i} label={renderLabel(i)} type="primary" />);
      }

      return null;
    };

    const renderPlusButton = () => (
      <Button
        style={{
          background: "transparent",
          color: newBlue,
          borderRadius: 0,
          padding: 0,
          boxShadow: "none",
          marginLeft: "auto"
        }}
        onClick={() => {
          onTabChange();
          onAdd();
        }}
        color="primary"
        variant="extendedFab"
        data-cy="alternate"
      >
        {`+ ${t("component.correctanswers.alternativeAnswer")}`}
      </Button>
    );

    return (
      <div>
        <Subtitle margin="0">{t("component.correctanswers.setcorrectanswers")}</Subtitle>

        <div>
          <Tabs value={correctTab} onChange={onTabChange} extra={renderPlusButton()}>
            {tabs > 1 && (
              <Tab
                type="primary"
                data_cy="correct"
                label={t("component.correctanswers.correct")}
                borderRadius={tabs === 1}
                active={correctTab === 0}
              />
            )}
            {renderAltResponses()}
          </Tabs>
          {children}
        </div>
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

const enhance = compose(withNamespaces("assessment"));

export default enhance(CorrectAnswers);
