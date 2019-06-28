import React from "react";

const defaultPagination = {
  pageSize: 10
};

const PrintableTable = ({ component, isPrinting, dataSource, pagination = defaultPagination, ...props }) => {
  const ComponentToRender = component;

  return isPrinting ? (
    <ComponentToRender
      {...props}
      pagination={{
        ...pagination,
        pageSize: dataSource.length
      }}
      dataSource={dataSource}
    />
  ) : (
    <ComponentToRender
      {...props}
      pagination={pagination}
      dataSource={dataSource}
      onChange={props => console.log(props)}
    />
  );
};

export default PrintableTable;
