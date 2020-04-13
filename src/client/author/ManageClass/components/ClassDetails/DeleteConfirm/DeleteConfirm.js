import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { get } from "lodash";
import { removeStudentsRequestAction, selectStudentAction } from "../../../ducks";
import { getUserOrgData } from "../../../../src/selectors/user";
import { UserNameContainer, UserName, LightGreenSpan } from "./styled";

import { TypeToConfirmModal } from "@edulastic/common";
import { StyledClassName } from "../../../../../admin/Common/StyledComponents";

class DeleteConfirm extends React.Component {
  static propTypes = {
    handleCancel: PropTypes.func.isRequired,
    removeStds: PropTypes.func.isRequired,
    selectedStudent: PropTypes.array.isRequired,
    isOpen: PropTypes.bool,
    orgData: PropTypes.object.isRequired,
    selectedClass: PropTypes.object.isRequired
  };

  static defaultProps = {
    isOpen: false
  };

  renderUserNames() {
    const { selectedStudent } = this.props;
    return (
      <UserNameContainer>
        {selectedStudent.map(({ firstName, lastName }, index) => (
          <UserName key={index}>
            {firstName} {lastName}
          </UserName>
        ))}
      </UserNameContainer>
    );
  }

  onChangeHandler = ({ target }) => this.setState({ confirmText: target.value });

  onRemove = () => {
    const { handleCancel, selectedStudent, orgData, selectedClass, removeStds, selectStudents } = this.props;
    const { code: classCode } = selectedClass;
    const studentIds = selectedStudent.map(std => std._id || std.userId);
    const { districtId } = orgData;

    removeStds({
      classCode,
      studentIds,
      districtId
    });

    if (handleCancel) {
      selectStudents([]);
      handleCancel();
    }
  };

  render() {
    const { isOpen, handleCancel, selectedStudent, selectedClass } = this.props;
    const { type } = selectedClass;

    return (
      <>
        {isOpen && (
          <TypeToConfirmModal
            modalVisible={isOpen}
            title="Remove Student(s)"
            handleOnOkClick={this.onRemove}
            wordToBeTyped="REMOVE"
            primaryLabel={`Are you sure you want to remove the selected student(s) from the ${
              type === "class" ? "class" : "group"
            }?`}
            secondaryLabel={selectedStudent.map(({ firstName = "", lastName = "", _id }) => {
              return (
                <StyledClassName key={_id}>
                  {firstName} {lastName}
                </StyledClassName>
              );
            })}
            closeModal={() => handleCancel()}
          />
        )}
      </>
    );
  }
}

export default connect(
  state => ({
    selectedStudent: get(state, "manageClass.selectedStudent", []),
    orgData: getUserOrgData(state),
    selectedClass: get(state, "manageClass.entity")
  }),
  {
    removeStds: removeStudentsRequestAction,
    selectStudents: selectStudentAction
  }
)(DeleteConfirm);
