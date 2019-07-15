import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Icon } from "antd";
import { upperCase, get } from "lodash";
import { IconUser } from "@edulastic/icons";

import { removeStudentsRequestAction } from "../../../ducks";
import { getUserOrgData } from "../../../../src/selectors/user";
import {
  StyledModal,
  Title,
  ActionButton,
  UserNameContainer,
  UserName,
  StyledInput,
  Description,
  BoldText,
  InputWrapper
} from "./styled";

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

  state = {
    confirmText: null,
    defaultText: "REMOVE"
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

  onChangeHandler = ({ target }) => this.setState({ confirmText: upperCase(target.value) });

  onRemove = () => {
    const { handleCancel, selectedStudent, orgData, selectedClass, removeStds } = this.props;
    const { code: classCode } = selectedClass;
    const studentIds = selectedStudent.map(std => std._id || std.userId);
    const { districtId } = orgData;

    removeStds({
      classCode,
      studentIds,
      districtId
    });

    if (handleCancel) {
      handleCancel();
    }
  };

  render() {
    const { isOpen, handleCancel } = this.props;
    const { defaultText, confirmText } = this.state;

    const title = (
      <Title>
        <IconUser />
        <label>Remove Students</label>
      </Title>
    );

    const footer = (
      <>
        <ActionButton onClick={handleCancel} ghost type="primary">
          No, Cancel
        </ActionButton>
        <ActionButton onClick={this.onRemove} type="primary" disabled={upperCase(defaultText) !== confirmText}>
          Yes, Remove <Icon type="right" />
        </ActionButton>
      </>
    );

    return (
      <StyledModal title={title} visible={isOpen} onCancel={handleCancel} footer={footer} destroyOnClose={true}>
        {this.renderUserNames()}
        <Description>
          Are you sure you want to remove the selected students from the class? <br />
          If yes type
          <BoldText>{defaultText}</BoldText> in the space given below and proceed.
        </Description>
        <InputWrapper>
          {/* Here paste is not allowed, and user has to manually type in REMOVE */}
          <StyledInput size="large" onChange={this.onChangeHandler} onPaste={evt => evt.preventDefault()} />
        </InputWrapper>
      </StyledModal>
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
    removeStds: removeStudentsRequestAction
  }
)(DeleteConfirm);
