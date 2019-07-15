import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Icon } from "antd";
import { get, isEmpty, size, pullAt } from "lodash";
import { Spin } from "antd";
import { lightBlue3 } from "@edulastic/colors";
import { StudentContent, NoStudents, NoConentDesc, StyledIcon, CheckboxShowStudents, StudentsTable } from "./styled";
import { selectStudentAction } from "../../ducks";
import { getUserFeatures } from "../../../../student/Login/ducks";
import { getGroupList } from "../../../src/selectors/user";
import { isFeatureAccessible } from "../../../../features/components/FeaturesSwitch";

const StudentsList = ({ loaded, students, selectStudents, selectedStudent, features, groupList, groupId }) => {
  const [showAllStudents, setShowAllStudents] = useState(false);

  const rowSelection = {
    onChange: (_, selectedRows) => {
      selectStudents(selectedRows);
    },
    selectedRowKeys: selectedStudent.map(({ email, username }) => email || username)
  };

  const empty = isEmpty(students);
  // here only students without enrollmentStatus as "0" are shown
  let filteredStudents = [];
  filteredStudents = !showAllStudents ? students.filter(student => student.enrollmentStatus !== "0") : [...students];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.firstName > b.firstName,
      render: (_, { firstName, lastName }) => (
        <span>{`${firstName === "Anonymous" || firstName === "" ? "-" : firstName} ${lastName || ""}`}</span>
      )
    },
    {
      title: "Username",
      dataIndex: "username",
      width: "12%",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.username > b.username
    },
    {
      title: "TTS Enabled",
      dataIndex: "tts",
      width: "20%",
      render: tts => (
        <span>
          {tts === "yes" ? <Icon type="check-circle" theme="filled" /> : <Icon type="close-circle" theme="filled" />}
        </span>
      )
    },
    {
      title: "Google User",
      dataIndex: "googleId",
      width: "20%",
      defaultSortOrder: "descend",
      render: googleId => (
        <span>
          {!!googleId ? <Icon type="check-circle" theme="filled" /> : <Icon type="close-circle" theme="filled" />}
        </span>
      )
    },
    {
      title: "Status",
      dataIndex: "enrollmentStatus",
      width: "30%",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.enrollmentStatus > b.enrollmentStatus,
      render: enrollmentStatus => (
        <span>{enrollmentStatus && enrollmentStatus === "1" ? "Active" : "Not Enrolled"}</span>
      )
    }
  ];

  const isPremium = isFeatureAccessible({
    features,
    inputFeatures: "searchAndAddStudent",
    groupId,
    groupList
  });
  if (!isPremium) {
    pullAt(columns, 2);
  }
  const rowKey = recode => recode.email || recode.username;
  const showStudentsHandler = () => {
    setShowAllStudents(showAllStudents => !showAllStudents);
  };
  return (
    <div style={{ textAlign: "end" }}>
      <CheckboxShowStudents defaultChecked={!showAllStudents} onChange={showStudentsHandler}>
        Show current students only
      </CheckboxShowStudents>
      <Spin tip="Loading..." spinning={!loaded}>
        <StudentContent>
          {empty && (
            <NoStudents>
              <StyledIcon type="user-add" fill={lightBlue3} size={45} />
              <NoConentDesc>
                <div> There are no students in your class.</div>
                <p>Add students to your class and begin assigning work</p>
              </NoConentDesc>
            </NoStudents>
          )}
          {loaded && !empty && (
            <StudentsTable
              columns={columns}
              bordered
              rowSelection={rowSelection}
              dataSource={filteredStudents}
              rowKey={rowKey}
              pagination={size(students) > 10 ? students : false}
            />
          )}
        </StudentContent>
      </Spin>
    </div>
  );
};

StudentsList.propTypes = {
  loaded: PropTypes.bool.isRequired,
  students: PropTypes.array.isRequired,
  selectStudents: PropTypes.func.isRequired,
  selectedStudent: PropTypes.array.isRequired
};

export default connect(
  state => ({
    loaded: get(state, "manageClass.loaded"),
    students: get(state, "manageClass.studentsList", []),
    selectedStudent: get(state, "manageClass.selectedStudent", []),
    features: getUserFeatures(state),
    groupList: getGroupList(state)
  }),
  {
    selectStudents: selectStudentAction
  }
)(StudentsList);
