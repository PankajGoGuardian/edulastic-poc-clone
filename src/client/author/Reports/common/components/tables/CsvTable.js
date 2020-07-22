import React, { useRef, useEffect } from "react";
import { filter, includes } from "lodash";
import styled from "styled-components";
import { convertTableToCSV } from "../../util";

const defaultPagination = {
  hideOnSinglePage: true,
  pageSize: 50
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

  const _pagination = pagination ? { ...pagination } : pagination;
  let _columns = [...columns];

  if (pagination && typeof _pagination.pageSize === "undefined") {
    _pagination.pageSize = 50;
  }

  if (pagination && typeof _pagination.hideOnSinglePage === "undefined") {
    _pagination.hideOnSinglePage = true;
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
    <StyledTableWrapper ref={childrenRef}>
      <Component {...restProps} dataSource={dataSource} pagination={_pagination} columns={_columns} />
    </StyledTableWrapper>
  );
};

const StyledTableWrapper = styled.div`
  @media print {
    .custom-table-tooltip {
      display: none;
    }
    colgroup {
      display: none;
    }
    table {
      overflow-wrap: break-word;
    }
  }

  .ant-table-layout-fixed .ant-table-scroll .ant-table-body {
    overflow-x: hidden !important;
  }
`;

export default CsvTable;
