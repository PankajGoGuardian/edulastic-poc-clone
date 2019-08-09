import React, { useRef, useEffect } from "react";
import { filter, includes } from "lodash";
import PropTypes from "prop-types";
import { convertTableToCSV } from "../../util";

const defaultPagination = {
  pageSize: 10
};

const CsvTable = ({
  onCsvConvert,
  isCsvDownloading,
  tableToRender,
  dataSource,
  columns,
  pagination = defaultPagination,
  ...restProps
}) => {
  const Component = tableToRender;
  const childrenRef = useRef(null);

  let _pagination = { ...pagination };
  let _columns = [...columns];

  if (typeof _pagination.pageSize === "undefined") {
    _pagination.pageSize = 10;
  }

  if (isCsvDownloading) {
    _pagination.pageSize = dataSource.length;
    _columns = filter(_columns, column => (column.visibleOn ? includes(column.visibleOn, "csv") : true));
  } else {
    _columns = filter(_columns, column => (column.visibleOn ? includes(column.visibleOn, "browser") : true));
  }

  useEffect(() => {
    if (isCsvDownloading && childrenRef.current) {
      const { csvText, csvRawData } = convertTableToCSV(childrenRef.current);
      onCsvConvert(csvText, csvRawData);
    }
  }, [isCsvDownloading]);

  return (
    <div ref={childrenRef}>
      <Component {...restProps} dataSource={dataSource} pagination={_pagination} columns={_columns} />
    </div>
  );
};

export default CsvTable;
