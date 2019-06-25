import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import ReactDOM from "react-dom";
import Dropzone from "react-dropzone";
import { compose } from "redux";
import { withTheme } from "styled-components";

import { withNamespaces } from "@edulastic/localization";
import { Image as ImageComponent } from "@edulastic/common";
import { fileApi } from "@edulastic/api";

import { updateVariables } from "../../utils/variables";

import QuestionTextArea from "../../components/QuestionTextArea";
import DropZoneToolbar from "../../components/DropZoneToolbar/index";
import StyledDropZone from "../../components/StyledDropZone/index";
import { Subtitle } from "../../styled/Subtitle";
import { Widget } from "../../styled/Widget";
import { SOURCE, WIDTH, HEIGHT } from "../../constants/constantsForQuestions";

class ComposeQuestion extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.hotspot.composeQuestion"), node.offsetTop, node.scrollHeight);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { item, setQuestionData, t, loading, setLoading } = this.props;

    const { image } = item;
    const maxWidth = 700,
      maxHeight = 600;
    const width = image ? image.width : maxWidth;
    const height = image ? image.height : maxHeight;
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
      if (prop === "source") {
        let image = new Image();
        image.onload = () => {
          setQuestionData(
            produce(item, draft => {
              draft.image.width = image.width > 700 ? 700 : image.width;
              draft.image.height = image.height > 600 ? 600 : image.height;
              draft.image.source = val;
              updateVariables(draft);
            })
          );
        };
        image.src = val;
      } else {
        setQuestionData(
          produce(item, draft => {
            if (prop === "width") {
              draft.image[prop] = val > maxWidth ? maxWidth : val;
            } else if (prop === "height") {
              draft.image[prop] = val > maxHeight ? maxHeight : val;
            } else {
              draft.image[prop] = val;
            }
            updateVariables(draft);
          })
        );
      }
    };

    const updateImage = imagePassed => {
      const newItem = { ...item };
      newItem.image = { ...newItem.image, ...imagePassed };
      setQuestionData(newItem);
    };

    const getImageDimensions = url => {
      const uploadedImage = new Image();
      uploadedImage.addEventListener("load", function() {
        let height, width;
        if (this.naturalHeight > maxHeight || this.naturalWidth > maxWidth) {
          const fitHeight = Math.floor(maxWidth * (this.naturalHeight / this.naturalWidth));
          const fitWidth = Math.floor(maxHeight * (this.naturalWidth / this.naturalHeight));
          if (fitWidth > maxWidth) {
            width = maxWidth;
            height = fitHeight;
          } else {
            height = maxHeight;
            width = fitWidth;
          }
        } else {
          width = this.naturalWidth;
          height = this.naturalHeight;
        }
        const obj = {};
        obj[WIDTH] = width;
        obj[HEIGHT] = height;
        obj[SOURCE] = url;
        updateImage(obj);
        setLoading(false);
      });
      uploadedImage.src = url;
    };

    const onDrop = ([files]) => {
      if (files) {
        setLoading(true);
        fileApi
          .upload({ file: files })
          .then(({ fileUri }) => {
            handleImageToolbarChange(SOURCE)(getImageDimensions(fileUri));
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      }
    };

    const thumb = file && <ImageComponent width={width} height={height} src={file} alt={altText} />;

    return (
      <Widget>
        <Subtitle>{t("component.hotspot.composeQuestion")}</Subtitle>

        <QuestionTextArea
          placeholder={t("component.hotspot.enterQuestion")}
          onChange={stimulus => stimulus && handleItemChangeChange("stimulus", stimulus)}
          value={item.stimulus}
          theme="border"
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
          maxSize={2 * 1024 * 1024}
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
