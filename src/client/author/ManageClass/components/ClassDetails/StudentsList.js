import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { get, isEmpty, pullAt } from "lodash";
import * as moment from "moment";

// components
import { Spin, Switch, Tooltip } from "antd";
import { GiDominoMask } from "react-icons/gi";
import { IconClose, IconCorrect } from "@edulastic/icons";
import { lightBlue3 } from "@edulastic/colors";
import { NoStudents, NoConentDesc, StyledIcon, StudentsTable, TableWrapper, SwitchBox } from "./styled";
import { isFeatureAccessible } from "../../../../features/components/FeaturesSwitch";

// ducks
import { proxyUser } from "../../../authUtils";
import { selectStudentAction } from "../../ducks";
import { getUserFeatures, isProxyUser as isProxyUserSelector } from "../../../../student/Login/ducks";
import { getUserId, getUserRole, getGroupList } from "../../../src/selectors/user";

const StudentsList = ({
  cuId,
  cuRole,
  loaded,
  students,
  selectStudents,
  selectedStudent,
  features,
  groupList,
  selectedClass,
  updating,
  allowGoogleLogin,
  allowCanvasLogin,
  isProxyUser
}) => {
  const [showCurrentStudents, setShowCurrentStudents] = useState(true);

  const { _id: groupId, type, active } = selectedClass;
  const typeText = type !== "class" ? "group" : "class";

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
        <span>
          {`${lastName ? `${lastName}, ` : ""}${firstName === "Anonymous" || firstName === "" ? "-" : firstName}`}
        </span>
      )
    },
    {
      title: "Username",
      dataIndex: "username",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.username > b.username,
      render: username => <span>{username}</span>,
      width: "40%"
    },
    {
      title: "TTS Enabled",
      dataIndex: "tts",
      align: "center",
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
            align: "center",
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
            align: "center",
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
      align: "center",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.enrollmentStatus > b.enrollmentStatus,
      render: (enrollmentStatus, { lastModified }) => (
        <span>
          {enrollmentStatus && enrollmentStatus == 1
            ? "Active"
            : `Student not enrolled${lastModified ? ` after ${moment(lastModified).format("MMM DD, YYYY")}` : ""}`}
        </span>
      )
    },
    {
      render: (_, { _id, enrollmentStatus }) =>
        !isProxyUser && enrollmentStatus == 1 ? (
          <Tooltip placement="topRight" title="View as Student">
            <GiDominoMask
              onClick={() => proxyUser({ userId: _id, groupId, currentUser: { _id: cuId, role: cuRole } })}
            />
          </Tooltip>
        ) : null
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
    <div>
      {!loaded || updating ? (
        <Spin />
      ) : empty ? (
        <NoStudents>
          <StyledIcon type="user-add" fill={lightBlue3} size={45} />
          <NoConentDesc>
            <div> There are no students in your {typeText}.</div>
            <p>Add students to your {typeText} and begin assigning work</p>
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
    cuId: getUserId(state),
    cuRole: getUserRole(state),
    loaded: get(state, "manageClass.loaded"),
    students: get(state, "manageClass.studentsList", []),
    selectedStudent: get(state, "manageClass.selectedStudent", []),
    features: getUserFeatures(state),
    groupList: getGroupList(state),
    updating: state.manageClass.updating,
    isProxyUser: isProxyUserSelector(state)
  }),
  {
    selectStudents: selectStudentAction
  }
)(StudentsList);
