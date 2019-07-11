import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { get } from "lodash";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Tooltip } from "antd";
import { find } from "lodash";
import ClassSelector from "./ClassSelector";
import selectsData from "../../../TestPage/components/common/selectsData";
import ClassCreatePage from "./ClassCreatePage";
import { TableWrapper, ClassListTable } from "./styled";
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
      dataIndex: "name",
      render: classname => (
        <Tooltip title={classname} placement="bottom">
          {classname}
        </Tooltip>
      )
    },
    {
      title: "Class Code",
      dataIndex: "code",
      render: classcode => (
        <Tooltip title={classcode} placement="bottom">
          {classcode}
        </Tooltip>
      )
    },
    {
      title: "Grades",
      dataIndex: "grade",
      render: (_, row) => {
        const grade = findGrade(row.grade);
        const gradeValue = grade.value || grade.text;
        return (
          <Tooltip title={gradeValue} placement="bottom">
            {gradeValue}
          </Tooltip>
        );
      }
    },
    {
      title: "Subject",
      dataIndex: "subject",
      render: (_, row) => {
        const subject = findSubject(row.subject);
        return (
          <Tooltip title={subject.text} placement="bottom">
            {subject.text}
          </Tooltip>
        );
      }
    },
    {
      title: "Students",
      dataIndex: "studentCount",
      render: (studentCount = 0) => (
        <Tooltip title={studentCount} placement="bottom">
          {studentCount}
        </Tooltip>
      )
    },
    {
      title: "Assignments",
      dataIndex: "assignmentCount",
      render: (assignmentCount = 0) => (
        <Tooltip title={assignmentCount} placement="bottom">
          {assignmentCount}
        </Tooltip>
      )
    }
  ];

  const rowKey = ({ _id }) => _id;

  const onRow = record => ({
    onClick: () => {
      const { _id: classId } = record;
      if (window.getSelection().toString() === "") {
        history.push(`/author/manageClass/${classId}`);
      }
    }
  });

  return (
    <TableWrapper>
      <ClassSelector groups={groups} archiveGroups={archiveGroups} setClassGroups={setClassGroups} />
      {classGroups.length > 0 ? (
        <ClassListTable
          columns={columns}
          dataSource={classGroups}
          rowKey={rowKey}
          onRow={onRow}
          pagination={classGroups.length > 10}
        />
      ) : (
        <ClassCreatePage />
      )}
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
