import React from "react";
import { CSVLink } from "react-csv";
import { Button, Upload, Icon, Modal } from "antd";
import { Table } from "../Common/StyledComponents";
import { mapCountAsType, DISABLE_SUBMIT_TITLE } from "../Data";
const { Column } = Table;

const orgTypesCount = ["schoolCount", "groupCount", "saCount", "teacherCount", "studentCount", "daCount"];

const MergeCleverIdsTable = ({
  eduCounts,
  clvrCounts,
  uploadCSVtoClever,
  districtId,
  cleverId,
  mergeResponse,
  closeMergeResponse,
  disableFields
}) => {
  const { data: mergeResponseData, showData: showMergeResponseData, mergeType: downloadMergeType } = mergeResponse;
  const ButtonProps = disableFields ? { disabled: disableFields, title: DISABLE_SUBMIT_TITLE } : {};
  const handleUpload = (info, mergeType) => {
    try {
      const { file } = info;
      uploadCSVtoClever({
        districtId,
        cleverId,
        mergeType,
        file
      });
    } catch (err) {
      console.error(err);
    }
  };

  const props = {
    accept: ".csv",
    multiple: false,
    showUploadList: false
  };

  const dataSource = orgTypesCount.map((item, i) => ({
    key: i,
    type: mapCountAsType[item].type,
    fieldName: mapCountAsType[item].name,
    eduCount: eduCounts[item] || "-",
    clvrCount: clvrCounts[item] || "-",
    isEmpty: !eduCounts[item] && !clvrCounts[item],
    isMatching: eduCounts[item] === clvrCounts[item]
  }));
  const headers = [
    { label: "Edulastic Id", key: "edulasticId" },
    { label: "Clever Id", key: "cleverId" },
    { label: "Status", key: "status" }
  ];
  return (
    <>
      <Modal
        title="Clever Id Merge report"
        visible={showMergeResponseData}
        destroyOnClose={false}
        maskClosable={false}
        onCancel={closeMergeResponse}
        footer={[
          <Button key="back" onClick={closeMergeResponse}>
            Cancel
          </Button>,
          <Button key="submit" type="primary">
            <CSVLink
              data={mergeResponseData}
              filename={`${downloadMergeType}_match_result_${districtId}.csv`}
              seperator=","
              headers={headers}
              target="_blank"
            >
              Download
            </CSVLink>
          </Button>
        ]}
        width="80%"
      >
        <Table rowKey={record => record.cleverId} dataSource={mergeResponseData} pagination={false}>
          <Column title="Edulastic Id" dataIndex="edulasticId" key="edulasticId" />
          <Column title="Clever Id" dataIndex="cleverId" key="cleverId" />
          <Column title="Status" dataIndex="status" key="status" />
        </Table>
      </Modal>
      <Table rowKey={record => record.key} dataSource={dataSource} pagination={false}>
        <Column title="Fields" dataIndex="fieldName" key="fieldName" />
        <Column title="Edulastic Count" dataIndex="eduCount" key="eduCount" />
        <Column title="Clever Count" dataIndex="clvrCount" key="clvrCount" />
        <Column
          title="Actions"
          dataIndex="isEmpty"
          key="btnName"
          render={(_, { type }) => (
            <Upload aria-label="Upload" {...props} customRequest={info => handleUpload(info, type)}>
              <Button {...ButtonProps}>
                <Icon type="upload" /> Upload
              </Button>
              {" *.csv"}
            </Upload>
          )}
        />
      </Table>
    </>
  );
};

export default MergeCleverIdsTable;
