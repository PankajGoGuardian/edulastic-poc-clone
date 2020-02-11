import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import Dropzone from "react-dropzone";
import { message } from "antd";

import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { withTheme } from "styled-components";

import { Image as Img, uploadToS3, beforeUpload, FlexContainer, EduButton } from "@edulastic/common";
import { canvasDimensions, aws } from "@edulastic/constants";
import { withNamespaces } from "@edulastic/localization";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { setQuestionDataAction } from "../../../../author/QuestionEditor/ducks";
import { updateVariables } from "../../../utils/variables";

import QuestionTextArea from "../../../components/QuestionTextArea";
import { Subtitle } from "../../../styled/Subtitle";
import Question from "../../../components/Question";
import CustomInput from "../../../components/Input";
import StyledDropZone from "../../../components/StyledDropZone";
import { SOURCE, HEIGHT, WIDTH } from "../../../constants/constantsForQuestions";
import { CustomStyleBtn } from "../../../styled/ButtonStyles";
import { Label } from "../../../styled/WidgetOptions/Label";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import ResizableImage from "./Resizeable";
import Dragger from "antd/lib/upload/Dragger";
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
        message.error(`${t("component.cloze.imageText.fileUploadFailed")}`);
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
        overflowHandlers={{ "max-width": "100%", overflow: "auto" }}
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

        <Row marginTop={15} type="flex" align="middle">
          <Col span={6} style={{ display: `flex`, alignItems: `center` }}>
            <CustomInput
              size="large"
              style={{ width: `90px`, marginRight: `5px` }}
              type="number"
              value={item?.image?.width || maxWidth}
              onChange={val => handleImageToolbarChange("width", val)}
              placeholder={t("component.hotspot.widthLabel")}
            />
            <Label marginBottom="0px">{t("component.hotspot.widthLabel")}</Label>
          </Col>
          <Col span={6} style={{ display: `flex`, alignItems: `center` }}>
            <CustomInput
              size="large"
              style={{ width: `90px`, marginRight: `5px` }}
              type="number"
              value={item?.image?.height || maxHeight}
              onChange={val => handleImageToolbarChange("height", val)}
              placeholder={t("component.hotspot.heightLabel")}
            />
            <Label marginBottom="0px">{t("component.hotspot.heightLabel")}</Label>
          </Col>
          <Col span={12} style={{ display: `flex`, alignItems: `center` }}>
            <CustomInput
              size="large"
              style={{ width: `200px`, marginRight: `5px` }}
              type="text"
              value={altText}
              onChange={val => handleImageToolbarChange("altText", val)}
              placeholder={t("component.hotspot.altTextLabel")}
            />
            <Label marginBottom="0px">{t("component.hotspot.altTextLabel")}</Label>
          </Col>
        </Row>

        {thumb ? (
          <FlexContainer className="imageContainer" flexDirection="column" marginBottom="1rem">
            {thumb}
            <div style={{ marginRight: "auto" }}>
              <UpdateImageButton {...uploadProps}>
                <CustomStyleBtn>{t("component.cloze.imageText.updateImageButtonText")} </CustomStyleBtn>
              </UpdateImageButton>
            </div>
          </FlexContainer>
        ) : (
          <Dropzone onDrop={onDrop} className="dropzone" activeClassName="active-dropzone" multiple={false}>
            {({ getRootProps, getInputProps, isDragActive }) => (
              <div
                style={{
                  margin: "0 auto",
                  outline: "none",
                  border: `1px solid black`
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
                    margin: "0 auto",
                    position: `relative`
                  }}
                  loading={loading}
                  isDragActive={isDragActive}
                />
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
