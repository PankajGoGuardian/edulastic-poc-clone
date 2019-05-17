import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { get, isEmpty } from "lodash";
import { Table, Spin } from "antd";
import { lightBlue3 } from "@edulastic/colors";
import { StudentContent, NoStudents, NoConentDesc, StyledIcon } from "./styled";
import { selectStudentAction } from "../../ducks";

const StudentsList = ({ loaded, students, selectStudents, selectedStudent }) => {
  const rowSelection = {
    onChange: (_, selectedRows) => {
      selectStudents(selectedRows);
    },
    selectedRowKeys: selectedStudent.map(({ email }) => email)
  };

  const empty = isEmpty(students);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.firstName > b.firstName,
      render: (_, { firstName, lastName }) => <span>{`${firstName} ${lastName}`}</span>
    },
    {
      title: "Username",
      dataIndex: "email",
      width: "12%",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.email > b.email
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
      sorter: (a, b) => a.status > b.status
    }
  ];

  const rowKey = recode => recode.email;

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
          <Table columns={columns} bordered rowSelection={rowSelection} dataSource={students} rowKey={rowKey} />
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
