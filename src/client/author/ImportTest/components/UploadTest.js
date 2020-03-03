import React, { useEffect, useState } from "react";
import { IconUpload } from "@edulastic/icons";
import { withNamespaces } from "@edulastic/localization";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { sumBy } from "lodash";

import { Select, message } from "antd";
import { UploadTitle, UploadDescription, StyledButton, StyledUpload, uploadIconStyle, FlexContainer } from "./styled";
import { uploadTestRequestAction } from "../ducks";
import { getAllTagsAction, getAllTagsSelector } from "../../TestPage/ducks";

const UploadTest = ({ t, uploadTest, getAllTags, allTagsData }) => {
  const [selectedTags, setselectedTags] = useState([]);
  useEffect(() => {
    getAllTags({ type: "testitem" });
  }, []);

  const customRequest = ({ onSuccess }) => {
    // Can check each file for server side validation or response
    setTimeout(() => {
      onSuccess("ok"); // fake response
    }, 0);
  };

  const onChange = ({ fileList }) => {
    if (fileList.every(({ status }) => status === "done")) {
      sessionStorage.setItem("qtiTags", JSON.stringify(selectedTags));
      uploadTest(fileList);
    }
  };

  const beforeUpload = (_, fileList) => {
    // file validation for size and type should be done here
    const totalFileSize = sumBy(fileList, "size");
    if (totalFileSize / 1024000 > 15) {
      message.error("File size exceeds 15 MB limit.");
      return false;
    }
  };

  const props = {
    name: "file",
    customRequest,
    accept: ".zip",
    onChange,
    multiple: true,
    beforeUpload,
    showUploadList: false
  };

  const testTags = allTagsData.map(({ _id, tagName }) => (
    <Select.Option key={_id} value={_id} title={tagName}>
      {tagName}
    </Select.Option>
  ));

  const onTagSelect = (_, selectedItems) => {
    setselectedTags(selectedItems.map(item => ({ _id: item.props.value, tagName: item.props.title })));
  };

  return (
    <FlexContainer flexDirection="column" alignItems="center">
      <StyledUpload {...props}>
        <FlexContainer flexDirection="column" alignItems="center">
          <IconUpload style={uploadIconStyle} />
          <UploadTitle>{t("qtiimport.uploadpage.title")}</UploadTitle>
          <UploadDescription>{t("qtiimport.uploadpage.description")}</UploadDescription>
          <StyledButton position="absolute" bottom="100px">
            {t("qtiimport.uploadpage.importbuttontext")}
          </StyledButton>
        </FlexContainer>
      </StyledUpload>
      <Select mode="tags" style={{ width: "100%" }} placeholder="Select tags" onChange={onTagSelect} allowClear>
        {testTags}
      </Select>
    </FlexContainer>
  );
};

UploadTest.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  uploadTest: PropTypes.func.isRequired
};

export default withNamespaces("qtiimport")(
  withRouter(
    connect(
      state => ({
        allTagsData: getAllTagsSelector(state, "testitem")
      }),
      { uploadTest: uploadTestRequestAction, getAllTags: getAllTagsAction }
    )(UploadTest)
  )
);
