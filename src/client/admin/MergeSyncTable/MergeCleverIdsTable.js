import React from "react";
import { CSVLink } from "react-csv";
import { Button, Upload, Icon, message, Modal } from "antd";
import { Table } from "../Common/StyledComponents";

const { Column } = Table;

const orgTypesCount = ["schoolCount", "groupCount", "saCount", "teacherCount", "studentCount", "daCount"];

const mapCountAsType = {
  schoolCount: {
    name: "Schools",
    type: "sch"
  },
  groupCount: {
    name: "Classes",
    type: "cls"
  },
  saCount: {
    name: "School Admins",
    type: "sa"
  },
  teacherCount: {
    name: "Teachers",
    type: "tch"
  },
  studentCount: {
    name: "Students",
    type: "stu"
  },
  daCount: {
    name: "District Admins",
    type: "da"
  }
};

const MergeCleverIdsTable = ({
  eduCounts,
  clvrCounts,
  uploadCSVtoClever,
  districtId,
  cleverId,
  mergeResponse,
  closeMergeResponse
}) => {
  const { data: mergeResponseData, showData: showMergeResponseData } = mergeResponse;

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
              filename={"merge_report.csv"}
              seperator={","}
              headers={headers}
              target="_blank"
            >
              Download
            </CSVLink>
          </Button>
        ]}
        width={"80%"}
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
              <Button>
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
