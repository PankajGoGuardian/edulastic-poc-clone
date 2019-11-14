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
import { TableWrapper, ClassListTable, Tags, SubHeader } from "./styled";
import { fetchStudentsByIdAction, fetchClassListAction } from "../../ducks";
import GoogleBanner from "./GoogleBanner";
import BreadCrumb from "../../../src/components/Breadcrumb";
import { getUserDetails } from "../../../../student/Login/ducks";
import Header from "./Header";

const { allGrades, allSubjects } = selectsData;

const ClassList = ({
  groups,
  archiveGroups,
  loadStudents,
  setShowDetails,
  syncClassLoading,
  showBanner,
  institutions,
  history,
  user,
  fetchClassList
}) => {
  const recentInstitute = institutions[institutions.length - 1];
  const findGrade = (_grade = []) => allGrades.filter(item => _grade.includes(item.value)).map(item => ` ${item.text}`);
  // eslint-disable-next-line max-len
  const findSubject = _subject => find(allSubjects, item => item.value === _subject) || { text: _subject };
  const findTags = row =>
    get(row, "tags", [])
      .map(_o => _o.tagName)
      .join(", ");

  const [filterClass, setFilterClass] = useState(null);
  const [classGroups, setClassGroups] = useState([]);

  useEffect(() => {
    setClassGroups(groups);
  }, [groups]);
  const columns = [
    {
      title: "Class Name",
      dataIndex: "name",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: _classname => (
        <Tooltip title={_classname} placement="bottom">
          {_classname}
        </Tooltip>
      ),
      width: 350
    },
    {
      title: "Class Code",
      dataIndex: "code",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.code.localeCompare(b.code),
      render: classcode => (
        <Tooltip title={classcode} placement="bottom">
          {classcode}
        </Tooltip>
      ),
      width: 150
    },
    {
      title: "Grades",
      dataIndex: "grades",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const prevGrades = findGrade(a.grades).join(" ");
        const nextGrades = findGrade(b.grades).join(" ");
        return prevGrades.localeCompare(nextGrades);
      },
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
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const prevSubject = get(a, "subject", "");
        const nextSubject = get(b, "subject", "");
        return prevSubject.localeCompare(nextSubject);
      },
      render: (_, row) => {
        const subject = findSubject(row.subject);
        return (
          <Tooltip title={subject.text} placement="bottom">
            {subject.text}
          </Tooltip>
        );
      },
      width: 150
    },
    {
      title: "Tag",
      dataIndex: "tags",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const prevTags = findTags(a);
        const nextTags = findTags(b);
        return prevTags.localeCompare(nextTags);
      },
      render: (_, row) => {
        const tags = findTags(row);
        return (
          <Tooltip title={tags} placement="bottomLeft">
            <Tags>{tags || "--"}</Tags>
          </Tooltip>
        );
      },
      width: 80
    },
    {
      title: "Students",
      dataIndex: "studentCount",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => Number(a.studentCount) - Number(b.studentCount),
      render: (studentCount = 0) => (
        <Tooltip title={studentCount} placement="bottom">
          {studentCount}
        </Tooltip>
      )
    },
    {
      title: "Assignments",
      dataIndex: "assignmentCount",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => Number(a.assignmentCount) - Number(b.assignmentCount),
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
  const breadCrumbData = [
    {
      title: "MANAGE CLASS",
      to: "/author/manageClass"
    }
  ];

  return (
    <>
      <Header groups={groups} setShowDetails={setShowDetails} archiveGroups={archiveGroups} />
      <SubHeader>
        <BreadCrumb data={breadCrumbData} style={{ position: "unset" }} />
        <ClassSelector
          groups={groups}
          archiveGroups={archiveGroups}
          setClassGroups={setClassGroups}
          filterClass={filterClass}
          setFilterClass={setFilterClass}
        />
      </SubHeader>
      <TableWrapper>
        <GoogleBanner syncClassLoading={syncClassLoading} showBanner={showBanner} setShowDetails={setShowDetails} />
        {classGroups.length > 0 ? (
          <ClassListTable
            columns={columns}
            dataSource={classGroups}
            rowKey={rowKey}
            onRow={onRow}
            pagination={classGroups.length > 10}
          />
        ) : (
          <ClassCreatePage
            filterClass={filterClass}
            recentInstitute={recentInstitute}
            user={user}
            fetchClassList={fetchClassList}
          />
        )}
      </TableWrapper>
    </>
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
      institutions: get(state, "user.user.orgData.schools"),
      user: getUserDetails(state)
    }),
    {
      loadStudents: fetchStudentsByIdAction,
      fetchClassList: fetchClassListAction
    }
  )
);

export default enhance(ClassList);
