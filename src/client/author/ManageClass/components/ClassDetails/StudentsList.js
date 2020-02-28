import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Spin, Switch } from "antd";
import { get, isEmpty, pullAt } from "lodash";
import { lightBlue3 } from "@edulastic/colors";
import { IconClose, IconCorrect } from "@edulastic/icons";
import { NoStudents, NoConentDesc, StyledIcon, StudentsTable, TableWrapper, SwitchBox } from "./styled";
import { selectStudentAction } from "../../ducks";
import { getUserFeatures } from "../../../../student/Login/ducks";
import { getGroupList } from "../../../src/selectors/user";
import { isFeatureAccessible } from "../../../../features/components/FeaturesSwitch";

const StudentsList = ({
  loaded,
  students,
  selectStudents,
  selectedStudent,
  features,
  groupList,
  selectedClass,
  updating,
  allowGoogleLogin,
  allowCanvasLogin
}) => {
  const { groupId, active } = selectedClass;
  const [showCurrentStudents, setShowCurrentStudents] = useState(true);

  const rowSelection = {
    onChange: (_, selectedRows) => {
      selectStudents(selectedRows);
    },
    getCheckboxProps: () => ({
      disabled: !active
    }),
    selectedRowKeys: selectedStudent.map(({ email, username }) => email || username)
  };

  const empty = isEmpty(students);
  // here only students without enrollmentStatus as "0" are shown
  const filteredStudents = showCurrentStudents
    ? students.filter(student => student.enrollmentStatus === 1)
    : [...students];

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
      defaultSortOrder: "descend",
      sorter: (a, b) => a.username > b.username,
      render: username => <span>{username}</span>
    },
    {
      title: "TTS Enabled",
      dataIndex: "tts",
      render: tts => (
        <span>{tts === "yes" ? <IconCorrect /> : <IconClose color="#ff99bb" width="10px" height="10px" />}</span>
      ),
      width: 150
    },
    ...(allowGoogleLogin
      ? [
          {
            title: "Google User",
            dataIndex: "lastSigninSSO",
            defaultSortOrder: "descend",
            render: (lastSigninSSO, { openIdProvider }) => (
              <span>
                {[lastSigninSSO, openIdProvider].includes("google") ? (
                  <IconCorrect />
                ) : (
                  <IconClose color="#ff99bb" width="10px" height="10px" />
                )}
              </span>
            ),
            width: 150
          }
        ]
      : []),

    ...(allowCanvasLogin
      ? [
          {
            title: "Canvas User",
            dataIndex: "canvasId",
            defaultSortOrder: "descend",
            render: (canvasId, { openIdProvider }) => (
              <span>
                {openIdProvider === "canvas" && canvasId ? (
                  <IconCorrect />
                ) : (
                  <IconClose color="#ff99bb" width="10px" height="10px" />
                )}
              </span>
            ),
            width: 150
          }
        ]
      : []),
    {
      title: "Status",
      dataIndex: "enrollmentStatus",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.enrollmentStatus > b.enrollmentStatus,
      render: enrollmentStatus => <span>{enrollmentStatus && enrollmentStatus == 1 ? "Active" : "Not Enrolled"}</span>
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
    setShowCurrentStudents(show => !show);
  };

  return (
    <div style={{ textAlign: "end" }}>
      {!loaded || updating ? (
        <Spin />
      ) : empty ? (
        <NoStudents>
          <StyledIcon type="user-add" fill={lightBlue3} size={45} />
          <NoConentDesc>
            <div> There are no students in your class.</div>
            <p>Add students to your class and begin assigning work</p>
          </NoConentDesc>
        </NoStudents>
      ) : (
        <TableWrapper>
          <>
            <SwitchBox>
              <span>SHOW ACTIVE STUDENTS</span>
              <Switch checked={showCurrentStudents} onClick={showStudentsHandler} />
            </SwitchBox>
            <StudentsTable
              columns={columns}
              rowSelection={rowSelection}
              dataSource={filteredStudents}
              rowKey={rowKey}
              pagination={false}
            />
          </>
        </TableWrapper>
      )}
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
    groupList: getGroupList(state),
    updating: state.manageClass.updating
  }),
  {
    selectStudents: selectStudentAction
  }
)(StudentsList);
