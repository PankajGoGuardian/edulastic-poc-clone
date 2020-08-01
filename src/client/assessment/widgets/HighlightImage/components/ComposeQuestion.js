import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import Dropzone from "react-dropzone";

import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { withTheme } from "styled-components";

import { uploadToS3, beforeUpload, FlexContainer, notification } from "@edulastic/common";
import { canvasDimensions, aws } from "@edulastic/constants";
import { withNamespaces } from "@edulastic/localization";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { setQuestionDataAction } from "../../../../author/QuestionEditor/ducks";
import { updateVariables } from "../../../utils/variables";

import QuestionTextArea from "../../../components/QuestionTextArea";
import { Subtitle } from "../../../styled/Subtitle";
import Question from "../../../components/Question";
import DropZoneToolbar from "../../../components/DropZoneToolbar";
import StyledDropZone from "../../../components/StyledDropZone";
import { SOURCE, HEIGHT, WIDTH } from "../../../constants/constantsForQuestions";
import { CustomStyleBtn } from "../../../styled/ButtonStyles";
import ResizableImage from "./Resizeable";
import UpdateImageButton from "../styled/UpdateImageButton";

class ComposeQuestion extends Component {
  imageContainerRef = React.createRef();

  handleResizing = (e, direction, ref, delta, position) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.image = {
          ...draft.image,
          ...position,
          [HEIGHT]: parseInt(ref.style.height, 10),
          [WIDTH]: parseInt(ref.style.width, 10)
        };
      })
    );
  };

  handleDragStop = (event, { x, y }) => {
    const { item, setQuestionData } = this.props;
    return setQuestionData(
      produce(item, draft => {
        draft.image.x = Math.max(parseInt(x, 10), 0);
        draft.image.y = Math.max(parseInt(y, 10), 0);
      })
    );
  };

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

    const handleImageToolbarChange = prop => val => {
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

    const handleUpdateImage = async ({ file }) => {
      try {
        const canUpload = beforeUpload(file);
        if (!canUpload) {
          return false;
        }
        const imageUrl = await uploadToS3(file, aws.s3Folders.DEFAULT);
        getImageDimensions(imageUrl);
      } catch (e) {
        console.error("error in image upload", e);
        notification({ msg: `${t("component.cloze.imageText.fileUploadFailed")}` });
      }
    };

    const uploadProps = {
      beforeUpload: () => false,
      onChange: handleUpdateImage,
      accept: "image/*",
      multiple: false,
      showUploadList: false
    };

    const thumb = image[SOURCE] && (
      <ResizableImage
        handleResizing={this.handleResizing}
        height={height}
        width={width}
        x={image.x}
        y={image.y}
        src={image[SOURCE]}
        altText={altText}
        handleDragStop={this.handleDragStop}
      />
    );
    // <Img width={width} height={height} src={image[SOURCE]} alt={altText} />;
    return (
      <Question
        section="main"
        label={t("component.highlightImage.composeQuestion")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.highlightImage.composeQuestion")}`)}>
          {t("component.highlightImage.composeQuestion")}
        </Subtitle>

        <QuestionTextArea
          placeholder={t("component.highlightImage.enterQuestion")}
          onChange={stimulus => handleItemChangeChange("stimulus", stimulus)}
          value={item.stimulus}
          border="border"
        />

        <DropZoneToolbar width={+width} height={+height} altText={altText} handleChange={handleImageToolbarChange} />

        {thumb ? (
          <FlexContainer className="imageContainer" flexDirection="column" marginBottom="1rem">
            {thumb}
            <UpdateImageButton {...uploadProps}>
              <CustomStyleBtn
                id={getFormattedAttrId(`${item?.title}-${t("component.cloze.imageText.updateImageButtonText")}`)}
              >
                {t("component.cloze.imageText.updateImageButtonText")}
              </CustomStyleBtn>
            </UpdateImageButton>
          </FlexContainer>
        ) : (
          <Dropzone onDrop={onDrop} className="dropzone" activeClassName="active-dropzone" multiple={false}>
            {({ getRootProps, getInputProps, isDragActive }) => (
              <div
                id={getFormattedAttrId(`${item?.title}-dropzone-image-container`)}
                data-cy="dropzone-image-container"
                {...getRootProps()}
                className={`dropzone ${isDragActive ? "dropzone--isActive" : ""}`}
              >
                <input {...getInputProps()} />

                <StyledDropZone loading={loading} isDragActive={isDragActive} />
              </div>
            )}
          </Dropzone>
        )}
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
