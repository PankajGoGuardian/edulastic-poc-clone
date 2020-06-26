import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { get, isNull, debounce } from "lodash";
import { Select, message } from "antd";
import { StyledModal, Title, ActionButton, Description } from "./styled";
import { receiveTeachersListAction } from "../../../../Teacher/ducks";
import { getUserOrgId, getUserIdSelector } from "../../../../src/selectors/user";
import { groupApi } from "@edulastic/api";
import { setClassAction } from "../../../../ManageClass/ducks";
import { EduButton ,notification,CustomModalStyled } from "@edulastic/common";

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
    searchText: ""
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
    const searchText = value.trim();
    this.setState({
      searchText
    });
  };

  onAddCoTeacher = debounce(() => {
    const { coTeacherId } = this.state;
    const { setClass } = this.props;
    if (isNull(coTeacherId)) {
      notification({ messageKey: "pleaseSelectCoTeacher" });
      return;
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
          notification({ type: "success", messageKey:"coTeacherAddedSuccessfully"});
          handleCancel();
        }
      })
      .catch(err => {
        notification({ msg:err.data.message});
      });
  }, 1000);

  render() {
    const { isOpen, handleCancel, primaryTeacherId, teachers, type } = this.props;
    const { searchText } = this.state;
    const coTeachers = teachers.filter(
      teacher =>
        (teacher._id !== primaryTeacherId && teacher.email?.includes(searchText)) ||
        (teacher.firstName && teacher.firstName.includes(searchText))
    );
    const notFoundText = searchText.length ? "No result found" : "Please enter 3 or more characters";
    const title = (
      <Title>
        <label>Add Co-Teacher</label>
      </Title>
    );

    const footer = (
      <>
        <EduButton height="32px" onClick={this.onAddCoTeacher}>
          Add
        </EduButton>
        <EduButton height="32px" onClick={handleCancel}>
          Cancel
        </EduButton>
      </>
    );

    return (
      <CustomModalStyled
        title={title}
        visible={isOpen}
        footer={footer}
        onCancel={() => handleCancel()}
        destroyOnClose={true}
        textAlign="left"
      >
        <Description>
          Invite your colleagues to view and manage your {type === "class" ? "class" : "group"}. Co-teachers can manage
          enrollment, assign the Test and view reports of your {type === "class" ? "class(es)" : "group(s)"}.
        </Description>
        <Select
          placeholder="Search teacher by name, email or username."
          showSearch
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          onChange={this.onChangeHandler}
          notFoundContent={notFoundText}
          onSearch={this.onSearchHandler}
          getPopupContainer={triggerNode => triggerNode.parentNode}
          style={{width:"100%",marginTop:"10px"}}
        >
          {coTeachers.map((el, index) => (
            <Select.Option key={index} value={el._id}>
              <div>
                <span style={{ fontSize: "14px" }}>{`${el.firstName} ${el.lastName || ""}`}</span>
                <span style={{ fontSize: "12px" }}>{` (${el.email || el.username})`}</span>
              </div>
            </Select.Option>
          ))}
        </Select>
      </CustomModalStyled>
    );
  }
}

export default connect(
  state => ({
    userOrgId: getUserOrgId(state),
    selectedStudent: get(state, "manageClass.selectedStudent", []),
    teachers: get(state, "teacherReducer.data", []),
    primaryTeacherId: getUserIdSelector(state)
  }),
  {
    loadTeachers: receiveTeachersListAction,
    setClass: setClassAction
  }
)(AddCoTeacher);
