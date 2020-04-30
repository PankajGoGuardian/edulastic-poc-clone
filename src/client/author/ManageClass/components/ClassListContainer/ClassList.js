import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { get, find } from "lodash";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Tooltip } from "antd";

import { MainContentWrapper } from "@edulastic/common";
import ClassSelector from "./ClassSelector";
import selectsData from "../../../TestPage/components/common/selectsData";
import ClassCreatePage from "./ClassCreatePage";
import { TableWrapper, ClassListTable, Tags, SubHeader } from "./styled";
import { fetchClassListAction } from "../../ducks";
import GoogleBanner from "./GoogleBanner";
import BreadCrumb from "../../../src/components/Breadcrumb";
import { getUserDetails } from "../../../../student/Login/ducks";
import Header from "./Header";
import { setAssignmentFiltersAction } from "../../../src/actions/assignments";
import {
  getGoogleAllowedInstitionPoliciesSelector,
  getCleverSyncEnabledInstitutionPoliciesSelector
} from "../../../src/selectors/user";

const { allGrades, allSubjects } = selectsData;

const ClassList = ({
  groups,
  archiveGroups,
  setShowDetails,
  syncClassLoading,
  showBanner,
  institutions,
  history,
  location,
  user,
  fetchClassList,
  setAssignmentFilters,
  isUserGoogleLoggedIn,
  googleAllowedInstitutions,
  setShowCleverSyncModal,
  cleverSyncEnabledInstitutions
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
  const [currentTab, setCurrentTab] = useState(location?.state?.currentTab || "class");

  useEffect(() => {
    setClassGroups(groups);
  }, [groups]);

  // get assignments related to class
  const getAssignmentsByClass = classId => event => {
    event.stopPropagation();
    const filter = {
      classId,
      testType: "",
      termId: ""
    };
    history.push("/author/assignments");
    setAssignmentFilters(filter);
  };

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
      render: (assignmentCount = 0, record) => (
        <Tooltip onClick={getAssignmentsByClass(record?._id)} title={assignmentCount} placement="bottom">
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
    },
    {
      title: "GROUPS",
      to: "/author/manageClass",
      state: { currentTab: "group" }
    }
  ];

  const getBreadCrumbData = () => (currentTab === "class" ? [breadCrumbData[0]] : breadCrumbData);

  const onClickHandler = value => {
    setCurrentTab(value);
  };

  return (
    <>
      <Header
        groups={groups}
        setShowDetails={setShowDetails}
        archiveGroups={archiveGroups}
        currentTab={currentTab}
        onClickHandler={onClickHandler}
        isUserGoogleLoggedIn={isUserGoogleLoggedIn}
        googleAllowedInstitutions={googleAllowedInstitutions}
        fetchGoogleClassList={fetchClassList}
        setShowCleverSyncModal={setShowCleverSyncModal}
        enableCleverSync={cleverSyncEnabledInstitutions.length > 0}
      />
      <MainContentWrapper>
        <SubHeader>
          <BreadCrumb data={getBreadCrumbData()} style={{ position: "unset" }} />
          {currentTab === "class" && (
            <ClassSelector
              groups={groups}
              archiveGroups={archiveGroups}
              setClassGroups={setClassGroups}
              filterClass={filterClass}
              setFilterClass={setFilterClass}
            />
          )}
        </SubHeader>
        <TableWrapper>
          {currentTab === "class" && (
            <>
              <GoogleBanner
                syncClassLoading={syncClassLoading}
                showBanner={showBanner}
                setShowDetails={setShowDetails}
              />
              {classGroups.length > 0 ? (
                <ClassListTable
                  columns={columns}
                  dataSource={classGroups.filter(({ type }) => type === "class")}
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
                  googleAllowedInstitutions={googleAllowedInstitutions}
                />
              )}
            </>
          )}

          {currentTab === "group" && (
            <ClassListTable
              columns={columns.filter(({ dataIndex }) =>
                ["name", "studentCount", "assignmentCount"].includes(dataIndex)
              )}
              dataSource={classGroups.filter(({ type }) => type === "custom")}
              rowKey={rowKey}
              onRow={onRow}
              pagination={classGroups.length > 10}
            />
          )}
        </TableWrapper>
      </MainContentWrapper>
    </>
  );
};

ClassList.propTypes = {
  groups: PropTypes.array.isRequired,
  archiveGroups: PropTypes.array.isRequired
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      institutions: get(state, "user.user.orgData.schools"),
      user: getUserDetails(state),
      isUserGoogleLoggedIn: get(state, "user.user.isUserGoogleLoggedIn"),
      googleAllowedInstitutions: getGoogleAllowedInstitionPoliciesSelector(state),
      cleverSyncEnabledInstitutions: getCleverSyncEnabledInstitutionPoliciesSelector(state)
    }),
    {
      fetchClassList: fetchClassListAction,
      setAssignmentFilters: setAssignmentFiltersAction
    }
  )
);

export default enhance(ClassList);
