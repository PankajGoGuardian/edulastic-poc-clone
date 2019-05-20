import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import produce from "immer";
import Dropzone from "react-dropzone";

import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { withTheme } from "styled-components";

import { Image } from "@edulastic/common";
import { fileApi } from "@edulastic/api";
import { withNamespaces } from "@edulastic/localization";
import { setQuestionDataAction } from "../../../../author/QuestionEditor/ducks";
import { updateVariables } from "../../../utils/variables";

import QuestionTextArea from "../../../components/QuestionTextArea";
import { Subtitle } from "../../../styled/Subtitle";
import { Widget } from "../../../styled/Widget";
import DropZoneToolbar from "../../../components/DropZoneToolbar";
import StyledDropZone from "../../../components/StyledDropZone";
import { SOURCE } from "../../../constants/constantsForQuestions";

class ComposeQuestion extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.highlightImage.composeQuestion"), node.offsetTop);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { item, setQuestionData, loading, setLoading, t } = this.props;

    const { image } = item;

    const width = image ? image.width : 900;
    const height = image ? image.height : 470;
    const altText = image ? image.altText : "";
    const file = image ? image.source : "";

    const handleItemChangeChange = (prop, uiStyle) => {
      setQuestionData(
        produce(item, draft => {
          draft[prop] = uiStyle;
          updateVariables(draft);
        })
      );
    };

    const handleImageToolbarChange = prop => val => {
      setQuestionData(
        produce(item, draft => {
          draft.image[prop] = val;
          updateVariables(draft);
        })
      );
    };

    const onDrop = ([files]) => {
      if (files) {
        setLoading(true);
        fileApi
          .upload({ file: files })
          .then(({ fileUri }) => {
            handleImageToolbarChange(SOURCE)(fileUri);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      }
    };

    const thumb = file && <Image width={width} height={height} src={file} alt={altText} />;

    return (
      <Widget>
        <Subtitle>{t("component.highlightImage.composeQuestion")}</Subtitle>
        <QuestionTextArea
          placeholder={t("component.highlightImage.enterQuestion")}
          onChange={stimulus => handleItemChangeChange("stimulus", stimulus)}
          value={item.stimulus}
        />

        <DropZoneToolbar
          width={+width}
          height={+height}
          maxWidth={1097}
          altText={altText}
          handleChange={handleImageToolbarChange}
        />

        <Dropzone
          onDrop={onDrop}
          maxSize={1000000}
          accept="image/*"
          className="dropzone"
          activeClassName="active-dropzone"
          multiple={false}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              data-cy="dropzone-image-container"
              {...getRootProps()}
              className={`dropzone ${isDragActive ? "dropzone--isActive" : ""}`}
            >
              <input {...getInputProps()} />

              <StyledDropZone loading={loading} isDragActive={isDragActive} thumb={thumb} />
            </div>
          )}
        </Dropzone>
      </Widget>
    );
  }
}

ComposeQuestion.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  setLoading: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

ComposeQuestion.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withRouter,
  withNamespaces("assessment"),
  withTheme,
  connect(
    null,
    { setQuestionData: setQuestionDataAction }
  )
);

export default enhance(ComposeQuestion);
