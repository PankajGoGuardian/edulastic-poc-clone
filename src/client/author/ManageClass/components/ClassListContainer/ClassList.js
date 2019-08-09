import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { get } from "lodash";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Tooltip, Spin } from "antd";
import { find } from "lodash";
import ClassSelector from "./ClassSelector";
import selectsData from "../../../TestPage/components/common/selectsData";
import ClassCreatePage from "./ClassCreatePage";
import { TableWrapper, ClassListTable } from "./styled";
import { fetchStudentsByIdAction } from "../../ducks";
import GoogleBanner from "./GoogleBanner";

const { allGrades, allSubjects } = selectsData;

const ClassList = ({
  groups,
  archiveGroups,
  loadStudents,
  setShowDetails,
  syncClassLoading,
  showBanner,
  institutions,
  history
}) => {
  const recentInstitute = institutions[institutions.length - 1];
  const findGrade = (_grade = []) => allGrades.filter(item => _grade.includes(item.value)).map(item => ` ${item.text}`);
  // eslint-disable-next-line max-len
  const findSubject = _subject => find(allSubjects, item => item.value === _subject) || { text: _subject };
  const [filterClass, setFilterClass] = useState(null);
  const [classGroups, setClassGroups] = useState([]);

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
      dataIndex: "grades",
      render: (_, row) => {
        const grades = findGrade(row.grades);
        const gradeValue = grades.value || grades.text;
        return (
          <Tooltip title={` ${grades}`} placement="bottom">
            {` ${grades}`}
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
      <GoogleBanner syncClassLoading={syncClassLoading} showBanner={showBanner} setShowDetails={setShowDetails} />
      <ClassSelector
        groups={groups}
        archiveGroups={archiveGroups}
        setClassGroups={setClassGroups}
        filterClass={filterClass}
        setFilterClass={setFilterClass}
      />
      {classGroups.length > 0 ? (
        <ClassListTable
          columns={columns}
          dataSource={classGroups}
          rowKey={rowKey}
          onRow={onRow}
          pagination={classGroups.length > 10}
        />
      ) : (
        <ClassCreatePage filterClass={filterClass} recentInstitute={recentInstitute} />
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
    state => ({
      institutions: get(state, "user.user.orgData.schools")
    }),
    {
      loadStudents: fetchStudentsByIdAction
    }
  )
);

export default enhance(ClassList);
