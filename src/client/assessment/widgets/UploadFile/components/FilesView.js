import React from "react";
import { isEmpty } from "lodash";
import PropTypes from "prop-types";
import { FlexContainer } from "@edulastic/common";
import ProgressBar from "./ProgressBar";

const FilesView = ({ files, hideDelete, onDelete, cols, mt }) => {
  if (isEmpty(files)) {
    return null;
  }

  return (
    <FlexContainer flexWrap="wrap" justifyContent="flex-start" mt={mt} width="100%">
      {files.map((f, i) => (
        <ProgressBar data={f} key={i} onCancel={onDelete} index={i} hidebar hideDelete={hideDelete} cols={cols} />
      ))}
    </FlexContainer>
  );
};

FilesView.propTypes = {
  files: PropTypes.array,
  onDelete: PropTypes.func,
  cols: PropTypes.number,
  hideDelete: PropTypes.bool,
  mt: PropTypes.string
};

FilesView.defaultProps = {
  files: [],
  onDelete: () => null,
  cols: 2,
  mt: "",
  hideDelete: false
};

export default FilesView;
