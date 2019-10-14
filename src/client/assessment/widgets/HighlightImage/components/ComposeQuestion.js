import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import Dropzone from "react-dropzone";

import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { withTheme } from "styled-components";

import { Image as Img, uploadToS3, beforeUpload, FlexContainer } from "@edulastic/common";
import { canvasDimensions, aws } from "@edulastic/constants";
import { withNamespaces } from "@edulastic/localization";
import { setQuestionDataAction } from "../../../../author/QuestionEditor/ducks";
import { updateVariables } from "../../../utils/variables";

import QuestionTextArea from "../../../components/QuestionTextArea";
import { Subtitle } from "../../../styled/Subtitle";
import Question from "../../../components/Question";
import CustomInput from "../../../components/Input";
import StyledDropZone from "../../../components/StyledDropZone";
import { SOURCE, HEIGHT, WIDTH } from "../../../constants/constantsForQuestions";
import { Label } from "../../../components/DropZoneToolbar/styled/Label";

class ComposeQuestion extends Component {
  render() {
    const { item, setQuestionData, loading, setLoading, t, fillSections, cleanSections } = this.props;
    const { image } = item;
    const { maxWidth, maxHeight } = canvasDimensions;

    const width = image ? image.width : maxWidth;
    const height = image ? image.height : maxHeight;
    const altText = image ? image.altText : "";

    const handleItemChangeChange = (prop, uiStyle) => {
      setQuestionData(
        produce(item, draft => {
          draft[prop] = uiStyle;
          updateVariables(draft);
        })
      );
    };

    const updateImage = imagePassed => {
      const newItem = { ...item };
      newItem.image = { ...newItem.image, ...imagePassed };
      setQuestionData(newItem);
    };

    const handleImageToolbarChange = (prop, val) => {
      setQuestionData(
        produce(item, draft => {
          let value = val;

          if (prop === "height") {
            value = value < maxHeight ? value : maxHeight;
          } else if (prop === "width") {
            value = value < maxWidth ? value : maxWidth;
          }

          draft.image[prop] = value;
          updateVariables(draft);
        })
      );
    };

    const getImageDimensions = url => {
      const uploadedImage = new Image();
      // eslint-disable-next-line func-names
      uploadedImage.addEventListener("load", function() {
        // eslint-disable-next-line
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
        const canUpload = beforeUpload(files);
        if (!canUpload) {
          setLoading(false);
          return false;
        }
        uploadToS3(files, aws.s3Folders.DEFAULT)
          .then(fileUri => {
            getImageDimensions(fileUri);
          })
          .catch(err => {
            console.error("error in uploading image", err);
            setLoading(false);
          });
      }
    };

    const thumb = image[SOURCE] && <Img width={width} height={height} src={image[SOURCE]} alt={altText} />;

    return (
      <Question
        section="main"
        label={t("component.highlightImage.composeQuestion")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle>{t("component.highlightImage.composeQuestion")}</Subtitle>

        <QuestionTextArea
          placeholder={t("component.highlightImage.enterQuestion")}
          onChange={stimulus => handleItemChangeChange("stimulus", stimulus)}
          value={item.stimulus}
          border="border"
        />

        <FlexContainer marginBottom="1rem">
          <FlexContainer>
            <CustomInput
              size="large"
              type="number"
              value={+width}
              onBlur={val => handleImageToolbarChange("width", val)}
              placeholder={t("component.hotspot.widthLabel")}
            />
            <Label>{t("component.hotspot.widthLabel")}</Label>
          </FlexContainer>
          <FlexContainer>
            <CustomInput
              size="large"
              type="number"
              value={+height}
              onBlur={val => handleImageToolbarChange("height", val)}
              placeholder={t("component.hotspot.heightLabel")}
            />
            <Label>{t("component.hotspot.heightLabel")}</Label>
          </FlexContainer>
          <FlexContainer flexProps={{ flex: "1 1 33%" }}>
            <CustomInput
              size="large"
              type="text"
              value={altText}
              onBlur={val => handleImageToolbarChange("altText", val)}
              placeholder={t("component.hotspot.altTextLabel")}
            />
            <Label>{t("component.hotspot.altTextLabel")}</Label>
          </FlexContainer>
        </FlexContainer>

        <Dropzone onDrop={onDrop} className="dropzone" activeClassName="active-dropzone" multiple={false}>
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              style={{
                maxWidth: canvasDimensions.maxWidth,
                maxHeight: canvasDimensions.maxHeight,
                margin: "0 auto"
              }}
              data-cy="dropzone-image-container"
              {...getRootProps()}
              className={`dropzone ${isDragActive ? "dropzone--isActive" : ""}`}
            >
              <input {...getInputProps()} />

              <StyledDropZone
                style={{
                  justifyContent: "flex-start !important",
                  alignItems: "flex-start !important",
                  minHeight: maxHeight,
                  minWidth: maxWidth,
                  height: "unset"
                }}
                loading={loading}
                isDragActive={isDragActive}
                thumb={thumb}
              />
            </div>
          )}
        </Dropzone>
      </Question>
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
