import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Icon } from "antd";
import { get, isEmpty, size } from "lodash";
import { Table, Spin } from "antd";
import { lightBlue3 } from "@edulastic/colors";
import { StudentContent, NoStudents, NoConentDesc, StyledIcon, TableDataSpan } from "./styled";
import { selectStudentAction } from "../../ducks";

const StudentsList = ({ loaded, students, selectStudents, selectedStudent }) => {
  const rowSelection = {
    onChange: (_, selectedRows) => {
      selectStudents(selectedRows);
    },
    selectedRowKeys: selectedStudent.map(({ email, username }) => email || username)
  };

  const empty = isEmpty(students);
  // here only students without enrollmentStatus as "0" are shown
  const filteredStudents = students.filter(student => student.enrollmentStatus !== "0");

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.firstName > b.firstName,
      render: (_, { firstName, lastName }) => <span>{`${firstName || ""} ${lastName || ""}`}</span>
    },
    {
      title: "Username",
      dataIndex: "username",
      width: "12%",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.username > b.username
    },
    {
      title: "TTS enabled",
      dataIndex: "tts",
      width: "20%",
      render: tts => (
        <TableDataSpan>
          {tts === "yes" ? <Icon type="check-circle" theme="filled" /> : <Icon type="close-circle" theme="filled" />}
        </TableDataSpan>
      )
    },
    {
      title: "Google User",
      dataIndex: "isGoogleUser",
      width: "30%",
      defaultSortOrder: "descend",
      sorter: a => a.isGoogleUser
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "30%",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.status > b.status,
      render: status => <TableDataSpan>{status}</TableDataSpan>
    }
  ];

  const rowKey = recode => recode.email || recode.username;

  return (
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
          <Table
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
    selectedStudent: get(state, "manageClass.selectedStudent")
  }),
  {
    selectStudents: selectStudentAction
  }
)(StudentsList);
