import React, { useState } from "react";
import { Table, Button, Upload, Icon, message } from "antd";

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

const MergeCleverIdsTable = ({ eduCounts, clvrCounts, uploadCSVtoClever, districtId, cleverId }) => {
  const [uploading, setUploading] = useState(false);

  const beforeUpload = file => {
    const isCSV = file.type === "text/csv";
    if (!isCSV) {
      message.error("You can only upload CSV file!");
    }
    return isCSV;
  };

  const onChange = info => {
    if (info.file.status === "uploading") {
      setUploading(true);
    } else {
      setUploading(false);
    }
  };

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
    onChange,
    beforeUpload,
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

  return (
    <Table rowKey={record => record.key} dataSource={dataSource} pagination={false}>
      <Column title="Fields" dataIndex="fieldName" key="fieldName" />
      <Column title="Edulastic Count" dataIndex="eduCount" key="eduCount" />
      <Column title="Clever Count" dataIndex="clvrCount" key="clvrCount" />
      <Column
        title="Actions"
        dataIndex="isEmpty"
        key="btnName"
        render={(_, { type }) => (
          <Upload aria-label="Upload" {...props} customRequest={info => handleUpload(info, type)} disabled={uploading}>
            <Button loading={uploading}>
              <Icon type="upload" /> Upload
            </Button>
            {" *.csv"}
          </Upload>
        )}
      />
    </Table>
  );
};

export default MergeCleverIdsTable;
