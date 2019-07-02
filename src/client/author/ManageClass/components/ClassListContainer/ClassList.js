import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { get } from "lodash";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Table } from "antd";
import { find } from "lodash";
import ClassSelector from "./ClassSelector";
import selectsData from "../../../TestPage/components/common/selectsData";
import { TableWrapper } from "./styled";
import { fetchStudentsByIdAction } from "../../ducks";

const { allGrades, allSubjects } = selectsData;

const ClassList = ({ groups, archiveGroups, loadStudents, history }) => {
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
      const { _id: classId } = record;
      if (window.getSelection().toString() === "") {
        loadStudents({ classId });
      }
      history.push(`/author/manageClass/${classId}`);
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
  groups: PropTypes.array.isRequired,
  archiveGroups: PropTypes.array.isRequired,
  loadStudents: PropTypes.func.isRequired
};

const enhance = compose(
  withRouter,
  connect(
    state => ({}),
    {
      loadStudents: fetchStudentsByIdAction
    }
  )
);

export default enhance(ClassList);
