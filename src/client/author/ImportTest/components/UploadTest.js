import React from "react";
import { IconUpload } from "@edulastic/icons";
import { withNamespaces } from "@edulastic/localization";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";

import { Select } from "antd";
import {
  UploadTitle,
  UploadDescription,
  StyledButton,
  StyledUpload,
  uploadIconStyle,
  FlexContainer
} from "./styled";
import { uploadTestRequestAction } from "../ducks";

const UploadTest = ({ t, uploadTest }) => {
  const customRequest = ({ onSuccess }) => {
    // Can check each file for server side validation or response
    setTimeout(() => {
      onSuccess("ok"); // fake response
    }, 0);
  };

  const onChange = ({ fileList }) => {
    // replace upload action for qti (hangdle multiple files)
    // write action to upload multiple files (fileList)
    if (fileList.every(({ status }) => status === "done")) {
      // make an action call here
      console.log("all done");
      uploadTest();
    }
  };

  const beforeUpload = (file, fileList) => {
    // file validation for size and type should be done here
    console.log("before upload", { fileList });
  };

  const props = {
    name: "file",
    customRequest,
    accept: ".pdf",
    onChange,
    multiple: true,
    beforeUpload,
    showUploadList: false
  };

  // fake tags
  const fetchedTags = [
    {
      _id: "i1",
      name: "a1"
    },
    {
      _id: "i2",
      name: "a2"
    },
    {
      _id: "i3",
      name: "a3"
    },
    {
      _id: "i4",
      name: "a4"
    }
  ];

  const testTags = [];

  fetchedTags.forEach(({ _id, name }) => {
    testTags.push(<Select.Option key={_id}>{name}</Select.Option>);
  });

  const onSelectTags = obj => {
    // make a request to bakckend to save the tag
    console.log(JSON.stringify({ obj }, null, 2));
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
      <Select
        mode="tags"
        style={{ width: "100%" }}
        placeholder="Please select"
        defaultValue={["i1", "i3"]}
        onSelect={onSelectTags}
        allowClear
      >
        {/* tag list will come here */}
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
      null,
      { uploadTest: uploadTestRequestAction }
    )(UploadTest)
  )
);
