import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import ReactDOM from "react-dom";
import { compose } from "redux";
import { withTheme } from "styled-components";

import QuillSortableHintsList from "../../../components/QuillSortableHintsList";
import QuestionTextArea from "../../../components/QuestionTextArea";
import { updateVariables } from "../../../utils/variables";

import { Subtitle } from "../../../styled/Subtitle";
import { Widget } from "../../../styled/Widget";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Label } from "../../../styled/WidgetOptions/Label";

class Extras extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("advanced", t("component.options.solution"), node.offsetTop, node.scrollHeight);
  };

  componentDidUpdate(prevProps) {
    const { advancedAreOpen, fillSections, t } = this.props;

    const node = ReactDOM.findDOMNode(this);

    if (prevProps.advancedAreOpen !== advancedAreOpen) {
      fillSections("advanced", t("component.options.solution"), node.offsetTop, node.scrollHeight);
    }
  }

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const {
      t,
      theme,
      item: { transcript },
      item,
      setQuestionData,
      advancedAreOpen
    } = this.props;

    const handleChange = (prop, value) => {
      setQuestionData(
        produce(item, draft => {
          draft[prop] = value;
          updateVariables(draft);
        })
      );
    };

    const inputStyle = {
      minHeight: 35,
      border: `1px solid ${theme.extras.inputBorderColor}`,
      padding: "5px 15px",
      background: theme.extras.inputBgColor
    };

    return (
      <Widget style={{ display: advancedAreOpen ? "block" : "none" }}>
        <Subtitle>{t("component.options.solution")}</Subtitle>

        <Row>
          <Col md={24}>
            <Label>{t("component.video.transcript")}</Label>
            <QuestionTextArea
              value={transcript}
              style={inputStyle}
              onChange={value => handleChange("transcript", value)}
            />
          </Col>
        </Row>

        <QuillSortableHintsList />
      </Widget>
    );
  }
}

Extras.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    videoType: PropTypes.string.isRequired,
    sourceURL: PropTypes.string.isRequired,
    transcript: PropTypes.string.isRequired,
    ui_style: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      posterImage: PropTypes.string.isRequired,
      captionURL: PropTypes.string.isRequired,
      hideControls: PropTypes.bool.isRequired
    }).isRequired
  }).isRequired,
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
};

Extras.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {},
  advancedAreOpen: false
};

export default compose(withTheme)(Extras);
