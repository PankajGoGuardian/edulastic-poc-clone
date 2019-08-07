import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { convertTableToCSV } from "../../util";

const defaultPagination = {
  pageSize: 10
};

const CsvTable = ({
  onCsvConvert,
  isCsvDownloading,
  Component,
  dataSource,
  pagination = defaultPagination,
  ...restProps
}) => {
  const childrenRef = useRef(null);

  let _pagination = pagination;

  if (isCsvDownloading) {
    _pagination.pageSize = dataSource.length;
  }

  useEffect(() => {
    if (isCsvDownloading && childrenRef.current) {
      onCsvConvert(convertTableToCSV(childrenRef.current));
    }
  }, [isCsvDownloading]);

  return (
    <div ref={childrenRef}>
      <Component {...restProps} dataSource={dataSource} pagination={_pagination} />
    </div>
  );
};

export default CsvTable;
