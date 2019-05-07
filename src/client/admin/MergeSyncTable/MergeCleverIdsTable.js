import React from "react";
import { Table, Button } from "antd";

const { Column } = Table;

const orgTypesCount = ["schoolCount", "groupCount", "saCount", "teacherCount", "studentCount"];

const mapCountAsType = {
  schoolCount: "Schools",
  groupCount: "Classes",
  saCount: "School Admins",
  teacherCount: "Teachers",
  studentCount: "Students"
};

const MergeCleverIdsTable = ({ eduCounts, clvrCounts }) => {
  const dataSource = orgTypesCount.map((item, i) => ({
    key: i,
    fieldName: mapCountAsType[item],
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
        render={(isEmpty, { isMatching }) =>
          isEmpty ? (
            <Button aria-label="See users">Upload</Button>
          ) : isMatching ? (
            <Button aria-label="See users">Results</Button>
          ) : (
            <Button aria-label="See users">Merge</Button>
          )
        }
      />
    </Table>
  );
};

export default MergeCleverIdsTable;
