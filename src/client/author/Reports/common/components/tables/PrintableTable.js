import React from "react";

const PrintableTable = ({ component, isPrinting, dataSource, pagination = {}, ...props }) => {
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
    <ComponentToRender {...props} pagination={pagination} dataSource={dataSource} />
  );
};

export default PrintableTable;
