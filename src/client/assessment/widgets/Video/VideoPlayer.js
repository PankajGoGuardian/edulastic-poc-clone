import React, { Component, memo } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { compose } from "redux";
import { connect } from "react-redux";

import { withNamespaces } from "@edulastic/localization";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";

import { Subtitle } from "../../styled/Subtitle";
import { Widget } from "../../styled/Widget";

import Options from "./components/Options";

class VideoPlayer extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.video.videoPlayer"), node.offsetTop);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { item, setQuestionData, t } = this.props;

    return (
      <Widget>
        <Subtitle>{t("component.video.videoPlayer")}</Subtitle>
        <Options setQuestionData={setQuestionData} item={item} t={t} />
      </Widget>
    );
  }
}

VideoPlayer.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    videoType: PropTypes.string.isRequired,
    sourceURL: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    transcript: PropTypes.string.isRequired,
    ui_style: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      posterImage: PropTypes.string.isRequired,
      captionURL: PropTypes.string.isRequired,
      hideControls: PropTypes.bool.isRequired
    }).isRequired
  }).isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

VideoPlayer.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default compose(
  withNamespaces("assessment"),
  memo,
  connect(
    null,
    { setQuestionData: setQuestionDataAction }
  )
)(VideoPlayer);
