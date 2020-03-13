import React from "react";
import PropTypes from "prop-types";
import { Input, Button } from "antd";
import { withTheme } from "styled-components";
import { IconUpload } from "@edulastic/icons";
import { StyledSubtitle } from "./styled";

const TextArea = ({ title, fileUpload, onChange, value, placeholder, theme, showUpload }) => {
  const uploadButtonStyle = {
    float: "right",
    border: 0,
    padding: 0,
    fontSize: "12px",
    color: theme?.widgets?.coding?.buttonTestCaseFileUpload,
    fontWeight: 600
  };

  const uploadIconStyle = {
    fill: theme?.widgets?.coding?.buttonTestCaseFileUpload,
    margin: "0 10px",
    verticalAlign: "middle"
  };

  return (
    <div>
      {!!title && (
        <StyledSubtitle>
          <span>{title}</span>
          {showUpload && (
            <Button style={uploadButtonStyle} onClick={fileUpload}>
              <IconUpload style={uploadIconStyle} />
              UPLOAD FILE
            </Button>
          )}
        </StyledSubtitle>
      )}
      <Input.TextArea
        value={value}
        onChange={onChange}
        autoSize={{
          minRows: 6,
          maxRows: 6
        }}
        placeholder={placeholder}
      />
    </div>
  );
};

TextArea.propTypes = {
  title: PropTypes.string,
  fileUpload: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  showUpload: PropTypes.bool
};

TextArea.defaultProps = {
  showUpload: true
};

export default withTheme(TextArea);
