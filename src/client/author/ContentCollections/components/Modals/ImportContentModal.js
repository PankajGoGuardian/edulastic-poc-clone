import React, { useEffect, useState, useMemo } from "react";
import { uniqBy } from "lodash";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, Input, Select, Radio, Upload, Icon, Spin, message } from "antd";
import styled from "styled-components";
import { RadioBtn, RadioGrp,notification } from "@edulastic/common";
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
import { tagsApi } from "@edulastic/api";
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
import { getAllTagsAction, getAllTagsSelector, addNewTagAction } from "../../../TestPage/ducks";

const { Dragger } = Upload;

const NEW_COLLECTION = "new collection";
const EXISTING_COLLECTION = "existing collection";
const UPLOAD_ZIP = "upload zip";
const USE_AWS_S3_BUCKET = "use aws s3 bucket";

const TestItemStatus = {
  PUBLISHED: "published",
  DRAFT: "draft"
};

const ImportContentModal = ({
  visible,
  handleResponse,
  collectionList,
  getSignedUrl,
  getSignedUrlData,
  setSignedUrl,
  signedUrlFetching,
  closeModel,
  getAllTags,
  allTagsData,
  addNewTag
}) => {
  const [selectedCollectionName, setSelectedCollectionName] = useState();

  const [selectedBucketId, setSelectedBucketId] = useState("");
  const [importType, setImportType] = useState(EXISTING_COLLECTION);
  const [uploadType, setUploadType] = useState(UPLOAD_ZIP);
  const [selectedFormat, setSelectedFormat] = useState("qti");
  const [testItemStatus, setItemStatus] = useState(TestItemStatus.PUBLISHED);
  const [searchValue, setSearchValue] = useState("");
  const [tags, setSelectedTags] = useState([]);
  const handleUpload = ({ file, fileList }) => {
    // TODO: Please uncoment after checking file type for windows
    // if (file.type !== "application/zip") {
    //   return;
    // }

    getSignedUrl({ file: fileList[0], selectedFormat });
  };

  const uploadProps = {
    beforeUpload: () => false,
    onChange: handleUpload,
    accept: ".zip, zip, application/zip",
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
    setImportType(EXISTING_COLLECTION);
    setUploadType(UPLOAD_ZIP);
    setItemStatus(TestItemStatus.PUBLISHED);
  }, [visible]);

  useEffect(() => {
    getAllTags({ type: "testitem" });
  }, []);

  const newAllTagsData = uniqBy([...allTagsData, ...tags], "_id");

  const selectTags = async id => {
    let newTag = {};
    if (id === searchValue) {
      const tempSearchValue = searchValue;
      setSearchValue("");
      try {
        const { _id, tagName } = await tagsApi.create({
          tagName: tempSearchValue,
          tagType: "testitem"
        });
        newTag = { _id, tagName };
        addNewTag({ tag: newTag, tagType: "testitem" });
      } catch (e) {
        message.error("Saving tag failed");
      }
    } else {
      newTag = newAllTagsData.find(tag => tag._id === id);
    }
    const newTags = [...tags, newTag];
    setSelectedTags(newTags);
    setSearchValue("");
  };

  const deselectTags = id => {
    const newTags = tags.filter(tag => tag._id !== id);
    setSelectedTags(newTags);
  };

  const searchTags = async value => {
    if (newAllTagsData.some(tag => tag.tagName === value || tag.tagName === value.trim())) {
      setSearchValue("");
    } else {
      setSearchValue(value);
    }
  };

  const Footer = (
    <StyledFooter>
      <NoButton ghost onClick={() => closeModel()}>
        CANCEL
      </NoButton>
      <YesButton
        onClick={() => {
          if (importType === EXISTING_COLLECTION && (!selectedCollectionName || !selectedCollectionName.trim())) 
          {
          return notification({ type: "warn", messageKey: "pleaseSelectCollection"})
          }

          if (importType === NEW_COLLECTION && (!selectedCollectionName || !selectedCollectionName.trim()))
          {
            return  notification({ type: "warn", messageKey: "pleaseEnterCollectionName"});
          }

          if (!getSignedUrlData) {
            return notification({ type: "warn", messageKey: "fileNotFound"});
          }

          handleResponse({
            selectedCollectionName,
            selectedBucketId,
            selectedFormat,
            signedUrl: getSignedUrlData,
            testItemStatus,
            createTest: false,
            selectedTags: tags
          });
        }}
      >
        CREATE
      </YesButton>
    </StyledFooter>
  );
  const Title = [<Heading>Import Content</Heading>];

  const selectedTags = useMemo(() => tags.map(t => t._id), [tags]);

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
          <lable>TAGS</lable>
          <SelectStyled
            className="tagsSelect"
            mode="multiple"
            optionLabelProp="title"
            placeholder="Please select"
            value={selectedTags}
            onSearch={searchTags}
            onSelect={selectTags}
            onDeselect={deselectTags}
            getPopupContainer={trigger => trigger.parentNode}
            filterOption={(input, option) => option.props.title.toLowerCase().includes(input.trim().toLowerCase())}
          >
            {searchValue.trim() ? (
              <Select.Option key={0} value={searchValue} title={searchValue}>
                {`${searchValue} (Create new Tag)`}
              </Select.Option>
            ) : (
              ""
            )}
            {newAllTagsData.map(({ tagName, _id }) => (
              <Select.Option key={_id} value={_id} title={tagName}>
                {tagName}
              </Select.Option>
            ))}
          </SelectStyled>
          {!!searchValue.length && !searchValue.trim().length && (
            <p style={{ color: "red" }}>Please enter valid characters.</p>
          )}
        </FieldRow>
        <FieldRow>
          <label>Status</label>
          <RadioGrp value={testItemStatus} onChange={event => setItemStatus(event.target.value)}>
            <RadioBtn value={TestItemStatus.PUBLISHED}>PUBLISHED</RadioBtn>
            <RadioBtn value={TestItemStatus.DRAFT}>DRAFT</RadioBtn>
          </RadioGrp>
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
              placeholder="Enter collection name"
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
            <Spin size="small" />
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
              onChange={e => setSignedUrl(e.target.value)}
              placeholder="Enter aws s3 bucket url"
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
    importStatus: importStatusSelector(state),
    allTagsData: getAllTagsSelector(state, "testitem")
  }),
  {
    fetchCollectionListRequest: fetchCollectionListRequestAction,
    getSignedUrl: getSignedUrlRequestAction,
    setSignedUrl: getSignedUrlSuccessAction,
    getAllTags: getAllTagsAction,
    addNewTag: addNewTagAction
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
