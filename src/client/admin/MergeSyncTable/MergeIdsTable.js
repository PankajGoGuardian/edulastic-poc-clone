import React from "react";
import { CSVLink } from "react-csv";
import { Button, Upload, Icon, Modal } from "antd";
import { Table } from "../Common/StyledComponents";
import { mapCountAsType, DISABLE_SUBMIT_TITLE } from "../Data";

const { Column } = Table;

const orgTypesCount = ["schoolCount", "groupCount", "saCount", "teacherCount", "studentCount", "daCount"];

const MergeIdsTable = ({
  eduCounts,
  countsInfo,
  uploadCSV,
  districtId,
  cleverId,
  atlasId,
  isClasslink,
  mergeResponse,
  closeMergeResponse,
  disableFields
}) => {
  const { data: mergeResponseData, showData: showMergeResponseData, mergeType: downloadMergeType } = mergeResponse;
  const ButtonProps = disableFields ? { disabled: disableFields, title: DISABLE_SUBMIT_TITLE } : {};

  const handleUpload = (info, mergeType) => {
    try {
      const { file } = info;
      uploadCSV({
        districtId,
        cleverId,
        atlasId,
        isClasslink,
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

  const data = orgTypesCount.map((item, i) => ({
    key: i,
    type: mapCountAsType[item].type,
    fieldName: mapCountAsType[item].name,
    eduCount: eduCounts[item] || "-",
    count: countsInfo[item] || "-",
    isEmpty: !eduCounts[item] && !countsInfo[item],
    isMatching: eduCounts[item] === countsInfo[item]
  }));

  const cleverHeaders = [
    { label: "Edulastic Id", key: "edulasticId" },
    { label: "Clever Id", key: "cleverId" },
    { label: "Status", key: "status" }
  ];

  const classlinkHeaders = [
    { label: "Edulastic Id", key: "edulasticId" },
    { label: "Classlink Id", key: "atlasId" },
    { label: "Status", key: "status" }
  ];

  const headers = isClasslink ? classlinkHeaders : cleverHeaders;
  const title = isClasslink ? "Classlink" : "Clever";

  const templateHeaders = {
    sch: ["school_id", "id"],
    cls: ["edu_class_section_id", "clever_id"],
    tch: ["user_id", "id"],
    stu: ["user_id", "id"],
    sa: ["user_id", "id"],
    da: ["user_id", "id"]
  };

  return (
    <>
      <Modal
        title={`${title} Id Merge report`}
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
              separator=","
              headers={headers}
              target="_blank"
            >
              Download
            </CSVLink>
          </Button>
        ]}
        width="80%"
      >
        <Table rowKey={record => record.edulasticId} dataSource={mergeResponseData} pagination={false}>
          {headers.map(each => (
            <Column title={each.label} dataIndex={each.key} key={each.key} />
          ))}
        </Table>
      </Modal>
      <Table rowKey={record => record.key} dataSource={data} pagination={false}>
        <Column title="Fields" dataIndex="fieldName" key="fieldName" />
        <Column title="Edulastic Count" dataIndex="eduCount" key="eduCount" />
        <Column title={`${title} Count`} dataIndex="count" key="count" />
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
        <Column
          title="Template"
          dataIndex="isEmpty"
          key="tempBtn"
          render={(_, { type }) => (
            <Button {...ButtonProps}>
              <CSVLink
                data={[]}
                filename={`${type}_match.csv`}
                separator=","
                headers={templateHeaders[type]}
                target="_blank"
              >
                <Icon type="download" /> Download Template
              </CSVLink>
            </Button>
          )}
        />
      </Table>
    </>
  );
};

export default MergeIdsTable;
