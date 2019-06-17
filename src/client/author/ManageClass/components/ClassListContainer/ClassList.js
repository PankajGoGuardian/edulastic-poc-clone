import React from "react";
import PropTypes from "prop-types";
import { Table } from "antd";
import { find } from "lodash";
import ClassSelector from "./ClassSelector";
import selectsData from "../../../TestPage/components/common/selectsData";
import { TableWrapper } from "./styled";

const { allGrades, allSubjects } = selectsData;

const ClassList = ({ groups, setEntity }) => {
  const findGrade = _grade => find(allGrades, item => item.value === _grade) || { text: _grade };
  // eslint-disable-next-line max-len
  const findSubject = _subject => find(allSubjects, item => item.value === _subject) || { text: _subject };

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
        return <div>{grade.text}</div>;
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
      title: "Tags",
      dataIndex: "tags",
      render: (_, row) => {
        const { tags = [] } = row;
        return tags.map((tag, index) => <span key={index}>{tag}, </span>);
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
      <ClassSelector />
      <Table columns={columns} dataSource={groups} rowKey={rowKey} onRow={onRow} />
    </TableWrapper>
  );
};

ClassList.propTypes = {
  setEntity: PropTypes.func.isRequired,
  groups: PropTypes.array.isRequired
};
export default ClassList;
