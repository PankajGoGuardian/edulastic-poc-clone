import React from "react";

const defaultPagination = {
  pageSize: 10
};

const PrintableTable = ({ component, isPrinting, dataSource, pagination = defaultPagination, ...props }) => {
  const ComponentToRender = component;
  let _pagination = pagination;

  if (isPrinting) {
    _pagination.pageSize = dataSource.length;
  }

  return <ComponentToRender {...props} pagination={_pagination} dataSource={dataSource} />;
};

export default PrintableTable;
