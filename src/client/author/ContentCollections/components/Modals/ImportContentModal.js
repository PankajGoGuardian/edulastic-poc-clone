import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, Input, Select, Radio, Upload, Icon, Spin } from "antd";

import styled from "styled-components";
import {
  themeColor,
  whiteSmoke,
  numBtnColors,
  white,
  backgroundGrey2,
  borderGrey2,
  placeholderGray,
  themeColorTagsBg,
  green
} from "@edulastic/colors";
import { ConfirmationModal } from "../../../src/components/common/ConfirmationModal";
import {
  fetchCollectionListRequestAction,
  getFetchCollectionListStateSelector,
  getCollectionListSelector,
  getSignedUrlSelector,
  getSignedUrlRequestAction,
  getSignedUrlSuccessAction,
  signedUrlFetchingSelector,
  importStatusSelector
} from "../../ducks";
import { RadioBtn, RadioGrp } from "@edulastic/common";

const { Option } = Select;
const { Dragger } = Upload;

const NEW_COLLECTION = "new collection";
const EXISTING_COLLECTION = "existing collection";
const UPLOAD_ZIP = "upload zip";
const USE_AWS_S3_BUCKET = "use aws s3 bucket";


const ImportContentModal = ({
  visible,
  handleResponse,
  collectionList,
  getSignedUrl,
  getSignedUrlData,
  setSignedUrl,
  signedUrlFetching,
  closeModel
}) => {
  const [selectedCollectionName, setSelectedCollectionName] = useState();

  const [selectedBucketId, setSelectedBucketId] = useState("");
  const [importType, setImportType] = useState(NEW_COLLECTION);
  const [uploadType, setUploadType] = useState(UPLOAD_ZIP);
  const [selectedFormat, setSelectedFormat] = useState("qti");

  const handleUpload = ({ file, fileList }) => {
    if (file.type !== "application/zip") {
      return;
    }
    getSignedUrl(fileList[0]);
  };

  const uploadProps = {
    beforeUpload: () => false,
    onChange: handleUpload,
    accept: "application/zip",
    multiple: false,
    showUploadList: false
  };

  useEffect(() => {
    fetchCollectionListRequestAction();
  }, []);

  useEffect(() => {
    setSelectedBucketId();
  }, [selectedCollectionName]);

  useEffect(() => {
    setSelectedCollectionName();
    setSelectedBucketId();
  }, [importType]);

  useEffect(() => {
    setSelectedCollectionName();
    setSelectedBucketId();
    setImportType(NEW_COLLECTION);
    setUploadType(UPLOAD_ZIP);
  }, [visible]);

  const Footer = (
    <StyledFooter>
      <NoButton ghost onClick={() => closeModel()}>
        CANCEL
      </NoButton>
      <YesButton
        onClick={() =>
          handleResponse({
            selectedCollectionName,
            selectedBucketId,
            signedUrl: getSignedUrlData
          })
        }
      >
        CREATE
      </YesButton>
    </StyledFooter>
  );
  const Title = [<Heading>Import Content</Heading>];

  return (

    <StyledModal title={Title} visible={visible} footer={Footer} onCancel={() => closeModel()} width={400}>

      <ModalBody>
        <FieldRow>
          <span>Import content from QTI, WebCT and several other formats.</span>
        </FieldRow>
        <FieldRow>
          <label>Format</label>
          <SelectStyled
            style={{ width: "100%" }}
            placeholder="Select format"
            getPopupContainer={node => node.parentNode}
            onChange={value => setSelectedFormat(value)}
            value={selectedFormat}
          >
            <Select.Option value="qti">QTI</Select.Option>
            <Select.Option value="webct">WebCT</Select.Option>
          </SelectStyled>
        </FieldRow>
        <FieldRow>
          <label>Import Into</label>
          <RadioGrp value={importType} onChange={evt => setImportType(evt.target.value)}>
            <RadioBtn value={NEW_COLLECTION}>NEW COLLECTION</RadioBtn>
            <RadioBtn value={EXISTING_COLLECTION}>EXISTING COLLECTION</RadioBtn>
          </RadioGrp>
          {importType === EXISTING_COLLECTION ? (
            <SelectStyled
              placeholder="Select a collection"
              getPopupContainer={node => node.parentNode}
              onChange={value => setSelectedCollectionName(value)}
              value={selectedCollectionName}
            >
              {collectionList.map(collection => (
                <Select.Option value={collection.name}>{collection.name}</Select.Option>
              ))}
            </SelectStyled>
          ) : (
            <Input
              placeholder={`Enter collection name`}
              onChange={ev => setSelectedCollectionName(ev.target.value)}
              value={selectedCollectionName}
            />
          )}
        </FieldRow>
        <FieldRow>
          <Radio.Group value={uploadType} onChange={e => setUploadType(e.target.value)}>
            <Radio value={UPLOAD_ZIP}>UPLOAD ZIP</Radio>
            <Radio value={USE_AWS_S3_BUCKET}>USE AWS S3 BUCKET</Radio>
          </Radio.Group>
          {signedUrlFetching ? (
            <Spin size={"small"} />
          ) : uploadType === UPLOAD_ZIP ? (
            [
              <Dragger {...uploadProps}>
                <div>
                  <Icon type="upload" />
                  <span>Drag & drop zip file</span>
                </div>
              </Dragger>,
              <span>{getSignedUrlData}</span>
            ]
          ) : (
            <Input
              value={getSignedUrlData}
              onBlur={e => setSignedUrl(e.target.value)}
              placeholder={`Enter aws s3 bucket url`}
            />
          )}

        </FieldRow>
      </ModalBody>
    </StyledModal>
  );
};

const ConnectedImportContentModal = connect(
  state => ({
    fetchCollectionListState: getFetchCollectionListStateSelector(state),
    collectionList: getCollectionListSelector(state),
    getSignedUrlData: getSignedUrlSelector(state),
    signedUrlFetching: signedUrlFetchingSelector(state),
    importStatus: importStatusSelector(state)
  }),
  {
    fetchCollectionListRequest: fetchCollectionListRequestAction,
    getSignedUrl: getSignedUrlRequestAction,
    setSignedUrl: getSignedUrlSuccessAction
  }
)(ImportContentModal);

export default ConnectedImportContentModal;

ImportContentModal.propTypes = {
  visible: PropTypes.bool,
  handleResponse: PropTypes.func.isRequired
};

ImportContentModal.defaultProps = {
  visible: false
};

export const StyledModal = styled(ConfirmationModal)`
  min-width: 500px;
  .ant-modal-content {
    .ant-modal-body {
      text-align: unset;
    }
  }
`;

export const ModalBody = styled.div`
  margin: auto;
  font-weight: ${props => props.theme.regular};
  width: 100%;
  > span {
    margin-bottom: 15px;
  }
`;

export const Heading = styled.h4`
  font-weight: ${props => props.theme.bold};
`;

export const NoButton = styled(Button)`
  flex: 0.45;
`;

export const YesButton = styled(Button)`
  color: ${props => (props.disabled ? "rgba(0, 0, 0, 0.25)" : white)} !important;
  background-color: ${props => (props.disabled ? whiteSmoke : themeColor)} !important;
  border-color: ${props => (props.disabled ? numBtnColors.borderColor : themeColor)} !important;
  flex: 0.45;
`;

export const StyledFooter = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-around;
`;

export const SelectStyled = styled(Select)`
  flex: 1;
  width: 100%;
  margin-bottom: 8px;
`;
export const FieldRow = styled.div`
  margin-bottom: 20px;
  width: 100%;
  > label,
  .date-picker-container label {
    display: inline-block;
    text-transform: uppercase;
    width: 100%;
    text-align: left;
    font-size: ${props => props.theme.smallFontSize};
    margin-bottom: 4px;
  }
  .ant-radio-group {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    .ant-radio-wrapper {
      flex-basis: 250px;
      .ant-radio {
        margin-right: 20px;
      }
      > span:last-child {
        font-size: ${props => props.theme.smallFontSize};
      }
    }
  }
  input {
    height: 35px;
    background: ${backgroundGrey2};
    border-radius: 2px;
  }
  .ant-select-selection {
    background: ${backgroundGrey2};
    border-radius: 2px;
    .ant-select-selection__rendered {
      min-height: 35px;
      line-height: 35px;
      font-weight: 500;
      .ant-select-selection__choice {
        background: ${themeColorTagsBg};
        color: ${green};
        font-size: ${({ theme }) => theme.smallFontSize};
        font-weight: ${({ theme }) => theme.semiBold};
      }
    }
  }
  .ant-upload-drag {
    border: 1px solid ${borderGrey2};
    background: ${backgroundGrey2};
    .ant-upload-drag-container {
      > div {
        color: ${placeholderGray};
        text-transform: uppercase;
        display: flex;
        flex-direction: column;
        i {
          font-size: 40px;
        }
        > span {
          font-size: ${props => props.theme.smallFontSize};
        }
      }
    }
  }
`;
