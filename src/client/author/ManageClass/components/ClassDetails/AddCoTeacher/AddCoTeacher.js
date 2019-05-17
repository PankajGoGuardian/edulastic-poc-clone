import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { get, isNull } from "lodash";
import { Select, message } from "antd";
import { StyledModal, Title, ActionButton, Description } from "./styled";
import { receiveTeachersListAction } from "../../../../Teacher/ducks";

class AddCoTeacher extends React.Component {
  static propTypes = {
    handleCancel: PropTypes.func.isRequired,
    teachers: PropTypes.array.isRequired,
    selectedStudent: PropTypes.array.isRequired,
    loadTeachers: PropTypes.func.isRequired,
    isOpen: PropTypes.bool
  };

  static defaultProps = {
    isOpen: false
  };

  state = {
    teacherIndex: null
  };

  componentDidMount() {
    const { loadTeachers } = this.props;
    loadTeachers({
      type: "DISTRICT",
      search: {
        role: "teacher"
      }
    });
  }

  onChangeHandler = teacherIndex => this.setState({ teacherIndex });

  onAdd = () => {
    const { handleCancel, selectedStudent } = this.props;
    const { teacherIndex } = this.state;
    if (isNull(teacherIndex)) {
      return message.error("Please select co-teacher");
    }
    console.log("Add co-teacher", teacherIndex, selectedStudent);
    if (handleCancel) {
      handleCancel();
    }
  };

  render() {
    const { isOpen, handleCancel, teachers } = this.props;
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
      <StyledModal title={title} visible={isOpen} footer={footer}>
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
        >
          {teachers.map((el, index) => (
            <Select.Option key={index} value={index}>
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
    selectedStudent: get(state, "manageClass.selectedStudent", []),
    teachers: get(state, "teacherReducer.data", [])
  }),
  {
    loadTeachers: receiveTeachersListAction
  }
)(AddCoTeacher);
