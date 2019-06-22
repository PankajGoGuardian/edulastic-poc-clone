import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { get, isNull } from "lodash";
import { Select, message } from "antd";
import { StyledModal, Title, ActionButton, Description } from "./styled";
import { receiveTeachersListAction } from "../../../../Teacher/ducks";
import { getUserOrgId } from "../../../../src/selectors/user";
import { groupApi } from "@edulastic/api";
import { setClassAction } from "../../../../ManageClass/ducks";


class AddCoTeacher extends React.Component {
  static propTypes = {
    handleCancel: PropTypes.func.isRequired,
    teachers: PropTypes.array.isRequired,
    selectedStudent: PropTypes.array.isRequired,
    isOpen: PropTypes.bool
  };

  static defaultProps = {
    isOpen: false
  };

  state = {
    coTeacherId: null,
    teacherList: []
  };


  componentDidMount() {
    const { loadTeachers, userOrgId } = this.props;
    loadTeachers({
      districtId: userOrgId,
      role: "teacher",
      limit: 10000
    });
  }

  onChangeHandler = id => {
    this.setState({
      ...this.state,
      coTeacherId: id
    });
  };


  onSearchHandler = value => {
    const { teachers } = this.props;
    this.setState({
      ...this.state,
      teacherList: teachers.filter(teacher => teacher.email.includes(value) || teacher.firstName.includes(value))
    });
  };
  onAdd = () => {
    const { coTeacherId } = this.state;
    const { setClass } = this.props;
    if (isNull(coTeacherId)) {
      return message.error("Please select co-teacher");
    }
    const { handleCancel, selectedClass } = this.props;
    const { _id: classId } = selectedClass;

    const result = groupApi
      .addCoTeacher({
        groupId: classId,
        coTeacherId: coTeacherId
      })
      .then(data => {
        if (data.groupData) {
          setClass(data.groupData);
          message.success("co-teacher added successfully");
          handleCancel();
        }
      })
      .catch(err => {
        message.error(err.data.message);
      });
  };

  render() {
    const { isOpen, handleCancel } = this.props;
    let { teacherList } = this.state;
    const title = (
      <Title>
        <label>Add Co-Teacher</label>
      </Title>
    );

    const footer = (
      <>
        <ActionButton onClick={this.onAdd} type="primary">
          Add
        </ActionButton>
        <ActionButton onClick={handleCancel} type="primary">
          Cancel
        </ActionButton>
      </>
    );

    return (
      <StyledModal title={title} visible={isOpen} footer={footer} onCancel={() => handleCancel()}>
        <Description>
          Invite your colleagues to view and manage your class. Co-teachers can manage enrollment, assign the assessment
          and view reports of your class(es)
        </Description>
        <Select
          placeholder="Search teacher by name, email or username."
          showSearch
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          onChange={this.onChangeHandler}
          notFoundContent="Please enter 3 or more characters"
          onSearch={this.onSearchHandler}
        >
          {teacherList.map((el, index) => (
            <Select.Option key={index} value={el._id}>
              {`${el.firstName} ${el.lastName}`}
            </Select.Option>
          ))}

        </Select>
      </StyledModal>
    );
  }
}


export default connect(
  state => ({
    userOrgId: getUserOrgId(state),
    selectedStudent: get(state, "manageClass.selectedStudent", []),
    teachers: get(state, "teacherReducer.data", [])
  }),
  {
    loadTeachers: receiveTeachersListAction,
    setClass: setClassAction
  }
)(AddCoTeacher);

