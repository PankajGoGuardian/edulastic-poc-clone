import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone";

import { StyledModal } from "../styled/StyledModal";
import { Paper, Image, Button, FlexContainer } from "@edulastic/common";
import { Label } from "../../../styled/WidgetOptions/Label";
import { StyledInput } from "../styled/StyledInput";
import { Typography, Empty } from "antd";
import { aws } from "@edulastic/constants";
import StyledDropZone from "../../../components/StyledDropZone";
import { uploadToS3, beforeUpload } from "@edulastic/common/src/helpers";

const FileSelectModal = ({
  onCancel,
  item: { ui_style: uiStyle },
  item,
  setQuestionData,
  modalSettings: { modalName },
  t
}) => {
  const [loading, setLoading] = useState(false);
  const [sourceURL, setSourceURL] = useState("");
  const width = "auto";
  const height = "auto";

  useMemo(() => setSourceURL(uiStyle[modalName]), [item]);

  const onDrop = async ([files]) => {
    if (!beforeUpload(files)) return;
    if (files) {
      setLoading(true);
      try {
        const fileUri = await uploadToS3(files, aws.s3Folders.DEFAULT);
        setSourceURL(fileUri);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
  };

  const _onOk = () => {
    setQuestionData(modalName, sourceURL);
    onCancel();
  };

  let thumb = null;
  let accept = "*/*";
  let dropzoneSettings = { name: "File", allowedFiles: "All Files", maxSize: 6144 };

  switch (modalName) {
    case "posterImage":
      accept = "image/*";
      dropzoneSettings = {
        name: "Image",
        allowedFiles: "PNG, JPG, GIF",
        maxSize: 1024
      };
      if (sourceURL) thumb = <Image width={width} height={height} src={sourceURL} />;
      break;
    case "captionURL":
      accept = ".vtt";
      dropzoneSettings = {
        name: "Caption",
        allowedFiles: "VTT",
        maxSize: 1024
      };
      if (sourceURL)
        thumb = (
          <Empty description={<span>{t("component.video.caption") + t("component.video.uploadSuccess")}</span>} />
        );

      break;
    case "sourceURL":
      accept = "video/mp4, video/*";
      dropzoneSettings = {
        name: "Video",
        allowedFiles: "MP4",
        maxSize: 6144
      };
      if (sourceURL)
        thumb = <Empty description={<span>{t("component.video.video") + t("component.video.uploadSuccess")}</span>} />;
    default:
      break;
  }

  return (
    <StyledModal title="Select file" visible={true} onCancel={onCancel} onOk={_onOk}>
      <Paper>
        <Dropzone
          onDrop={onDrop}
          accept={accept}
          className="dropzone"
          activeClassName="active-dropzone"
          multiple={false}
        >
          {({ getRootProps, getInputProps, isDragActive, rejectedFiles }) => (
            <div
              data-cy="dropzone-image-container"
              {...getRootProps()}
              className={`dropzone ${isDragActive ? "dropzone--isActive" : ""}`}
            >
              <input {...getInputProps()} />

              <StyledDropZone
                style={{ height: 200 }}
                loading={loading}
                isDragActive={isDragActive}
                thumb={thumb}
                dropzoneSettings={dropzoneSettings}
              >
                {rejectedFiles.length !== 0 && (
                  <Typography.Text style={{ marginTop: 5 }} type="danger">
                    {t("component.video.errorMessage")}
                  </Typography.Text>
                )}
              </StyledDropZone>
            </div>
          )}
        </Dropzone>

        <Label style={{ marginTop: 10 }}>
          {t("component.video.sourceURL") +
            " (" +
            t("component.video.hostYourOwn") +
            t(`component.video.${dropzoneSettings.name.toLowerCase()}`).toLowerCase() +
            ")"}
        </Label>
        <FlexContainer>
          <StyledInput size="large" value={sourceURL} onChange={e => setSourceURL(e.target.value)} />
          <Button disabled={!sourceURL} color="secondary" onClick={() => setSourceURL("")}>
            Remove
          </Button>
        </FlexContainer>
      </Paper>
    </StyledModal>
  );
};

FileSelectModal.propTypes = {
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
  modalSettings: PropTypes.shape({
    editMode: PropTypes.bool.isRequired,
    modalName: PropTypes.string.isRequired
  }).isRequired,
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired
};

export default FileSelectModal;
