import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import styled from "styled-components";
import { uploadToS3, FlexContainer, EduButton } from "@edulastic/common";
import { aws } from "@edulastic/constants";

import ProgressBar from "./ProgressBar";
import { allowedFiles, MAX_SIZE, MAX_COUNT } from "./constants";

const folder = aws.s3Folders.DEFAULT;

const Uploader = ({ onCompleted, mt }) => {
  const [filesToUpload, setFilesToUpload] = useState([]);
  const toHandleUpload = useRef();
  const inputRef = useRef();

  const saveAnswer = () => {
    const started = toHandleUpload.current.filter(f => f.status === "started");
    if (isEmpty(started)) {
      onCompleted(
        toHandleUpload.current
          .filter(f => f.status === "completed")
          .map(({ name, size, source, type }) => ({
            type,
            name,
            size,
            source
          }))
      );
      setFilesToUpload([]);
      toHandleUpload.current = [];
    } else {
      setFilesToUpload([...toHandleUpload.current]);
    }
  };

  const uploadFinished = (index, uri) => {
    if (toHandleUpload.current) {
      toHandleUpload.current[index].status = "completed";
      toHandleUpload.current[index].source = uri;
      saveAnswer();
    }
  };

  const onCancelUpload = index => {
    if (toHandleUpload.current) {
      const { cancel } = toHandleUpload.current[index];
      if (typeof cancel === "function") {
        cancel("Canceled By User");
        toHandleUpload.current[index].status = "canceled";
        saveAnswer();
      }
    }
  };

  const onProgress = index => e => {
    if (toHandleUpload.current) {
      const percent = Math.round((e.loaded * 100) / e.total);
      toHandleUpload.current[index].percent = percent;
      setFilesToUpload([...toHandleUpload.current]);
    }
  };

  const setCancelFn = index => fn => {
    if (toHandleUpload.current) {
      toHandleUpload.current[index].cancel = fn;
    }
  };

  const uploadFile = async (file, index) => {
    try {
      const uri = await uploadToS3(file, folder, onProgress(index), setCancelFn(index));
      uploadFinished(index, uri);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = e => {
    const { files } = e.target;
    if (files) {
      const filesArr = Object.keys(files)
        .map(key => {
          const { size } = files[key];
          if (size > MAX_SIZE) {
            return false;
          }
          return files[key];
        })
        .filter(f => f)
        .slice(0, MAX_COUNT);

      const toUpload = filesArr.map(f => ({
        type: f.type,
        size: f.size,
        name: f.name,
        status: "started"
      }));
      setFilesToUpload(toUpload);
      toHandleUpload.current = toUpload;
      filesArr.forEach(uploadFile);
    }
  };

  const onClickHandler = e => {
    if (inputRef.current) {
      inputRef.current.click();
      e.target.blur();
    }
  };

  const progressArr = filesToUpload.filter(f => f.status !== "canceled");
  const disableUpload = !isEmpty(progressArr);

  return (
    <FlexContainer justifyContent="flex-start" mt={mt} flexDirection="column" width="100%">
      <EduButton height="28px" width="140px" onClick={onClickHandler} disabled={disableUpload} ml="0px">
        UPLOAD FILE
      </EduButton>

      <UploadInput multiple type="file" ref={inputRef} onChange={handleChange} accept={allowedFiles.join()} />
      {!isEmpty(progressArr) && (
        <FlexContainer flexWrap="wrap" mt="26px" justifyContent="flex-start">
          {progressArr.map((f, i) => (
            <ProgressBar data={f} key={i} onCancel={onCancelUpload} index={i} />
          ))}
        </FlexContainer>
      )}
    </FlexContainer>
  );
};

Uploader.propTypes = {
  onCompleted: PropTypes.func,
  mt: PropTypes.string
};

Uploader.defaultProps = {
  onCompleted: () => null,
  mt: ""
};

export default Uploader;

const UploadInput = styled.input`
  display: none;
`;
