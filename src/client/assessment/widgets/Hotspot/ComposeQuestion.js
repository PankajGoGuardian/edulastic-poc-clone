import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import ReactDOM from "react-dom";
import Dropzone from "react-dropzone";
import { compose } from "redux";
import { withTheme } from "styled-components";

import { withNamespaces } from "@edulastic/localization";
import { Image } from "@edulastic/common";
import { fileApi } from "@edulastic/api";

import { updateVariables } from "../../utils/variables";

import QuestionTextArea from "../../components/QuestionTextArea";
import DropZoneToolbar from "../../components/DropZoneToolbar/index";
import StyledDropZone from "../../components/StyledDropZone/index";
import { Subtitle } from "../../styled/Subtitle";
import { Widget } from "../../styled/Widget";

import { SOURCE } from "../../constants/constantsForQuestions";

class ComposeQuestion extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.hotspot.composeQuestion"), node.offsetTop);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { item, setQuestionData, t, loading, setLoading } = this.props;

    const { image } = item;

    const width = image ? image.width : 700;
    const height = image ? image.height : 600;
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
          if (prop === "width") {
            draft.image[prop] = val > 700 ? 700 : val;
          } else if (prop === "height") {
            draft.image[prop] = val > 600 ? 600 : val;
          }
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
        <Subtitle>{t("component.hotspot.composeQuestion")}</Subtitle>

        <QuestionTextArea
          placeholder={t("component.hotspot.enterQuestion")}
          onChange={stimulus => handleItemChangeChange("stimulus", stimulus)}
          value={item.stimulus}
        />

        <DropZoneToolbar
          width={+width}
          height={+height}
          altText={altText}
          maxWidth={980}
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

              <StyledDropZone
                style={{
                  alignItems: "none"
                }}
                loading={loading}
                isDragActive={isDragActive}
                thumb={thumb}
              />
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
  setLoading: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

ComposeQuestion.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(ComposeQuestion);
