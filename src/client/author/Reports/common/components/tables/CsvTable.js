import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { convertTableToCSV } from "../../util";

const CsvTable = ({ onCsvConvert, isCsvDownloading, children }) => {
  const childrenRef = useRef(null);

  useEffect(() => {
    if (isCsvDownloading && childrenRef.current) {
      onCsvConvert(convertTableToCSV(childrenRef.current));
    }
  }, [isCsvDownloading]);

  return <div ref={childrenRef}>{children}</div>;
};

CsvTable.propTypes = {
  onCsvConvert: PropTypes.func.isRequired,
  isCsvDownloading: PropTypes.bool.isRequired,
  children: PropTypes.node
};

CsvTable.defaultProps = {
  children: null
};

export default CsvTable;
