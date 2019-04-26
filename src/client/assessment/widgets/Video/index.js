import React, { memo, useMemo } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import styled from "styled-components";

import { Paper } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { replaceVariables } from "../../utils/variables";

import { Subtitle } from "../../styled/Subtitle";

import Options from "./components/Options";
import AdvancedOptions from "./components/AdvancedOptions";
import VideoPreview from "./VideoPreview";

const EmptyWrapper = styled.div``;

const Video = ({ item, view, smallSize, setQuestionData, t }) => {
  const Wrapper = smallSize ? EmptyWrapper : Paper;
  const itemForPreview = useMemo(() => replaceVariables(item), [item]);

  if (view === "edit")
    return (
      <Paper style={{ marginBottom: 30 }}>
        <Subtitle>{t("component.video.videoPlayer")}</Subtitle>
        <Options setQuestionData={setQuestionData} item={item} t={t} />
        <AdvancedOptions setQuestionData={setQuestionData} item={item} t={t} />
      </Paper>
    );
  if ((view = "preview"))
    return (
      <Wrapper>
        <VideoPreview item={itemForPreview} />
      </Wrapper>
    );
};

Video.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    videoType: PropTypes.string.isRequired,
    sourceURL: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    transcript: PropTypes.string.isRequired,
    ui_style: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      posterImage: PropTypes.string.isRequired,
      captionURL: PropTypes.string.isRequired,
      hideControls: PropTypes.bool.isRequired
    }).isRequired
  }).isRequired,
  view: PropTypes.string.isRequired,
  smallSize: PropTypes.bool,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

Video.defaultProps = {
  smallSize: false
};

const enhance = compose(
  withNamespaces("assessment"),
  memo,
  connect(
    null,
    { setQuestionData: setQuestionDataAction }
  )
);

const VideoContainer = enhance(Video);

export { VideoContainer as Video };
