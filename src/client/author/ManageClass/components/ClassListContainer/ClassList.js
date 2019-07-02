import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Table } from "antd";
import { find } from "lodash";
import ClassSelector from "./ClassSelector";
import selectsData from "../../../TestPage/components/common/selectsData";
import { TableWrapper } from "./styled";

const { allGrades, allSubjects } = selectsData;

const ClassList = ({ groups, archiveGroups, setEntity }) => {
  const findGrade = _grade => find(allGrades, item => item.value === _grade) || { text: _grade };
  // eslint-disable-next-line max-len
  const findSubject = _subject => find(allSubjects, item => item.value === _subject) || { text: _subject };
  const [classGroups, setClassGroups] = useState(groups);

  useEffect(() => {
    setClassGroups(groups);
  }, [groups]);
  const columns = [
    {
      title: "Class Name",
      dataIndex: "name"
    },
    { title: "Class Code", dataIndex: "code" },
    {
      title: "Grades",
      dataIndex: "grade",
      render: (_, row) => {
        const grade = findGrade(row.grade);
        return <div>{grade.value || grade.text}</div>;
      }
    },
    {
      title: "Subject",
      dataIndex: "subject",
      render: (_, row) => {
        const subject = findSubject(row.subject);
        return <div>{subject.text}</div>;
      }
    },
    {
      title: "Students",
      dataIndex: "studentCount",
      render: (studentCount = 0) => studentCount
    },
    {
      title: "Assignments",
      dataIndex: "assignmentCount",
      render: (assignmentCount = 0) => assignmentCount
    }
  ];

  const rowKey = ({ _id }) => _id;

  const onRow = record => ({
    onClick: () => {
      if (window.getSelection().toString() === "") {
        setEntity(record);
      }
    }
  });

  return (
    <TableWrapper>
      <ClassSelector groups={groups} archiveGroups={archiveGroups} setClassGroups={setClassGroups} />
      <Table columns={columns} dataSource={classGroups} rowKey={rowKey} onRow={onRow} />
    </TableWrapper>
  );
};

ClassList.propTypes = {
  setEntity: PropTypes.func.isRequired,
  groups: PropTypes.array.isRequired
};
export default ClassList;
