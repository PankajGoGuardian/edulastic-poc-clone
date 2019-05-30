import PropTypes from "prop-types";
import React from "react";
import { compose } from "redux";
import styled from "styled-components";
import Modal from "react-responsive-modal";
import { withRouter } from "react-router-dom";
import { white, inputBorder, lightGreySecondary, blueButton } from "@edulastic/colors";
import { Button, Input, message } from "antd";
import { ModalFooter } from "../../../AssessmentPage/common/Modal";

const ModalStyles = {
  minWidth: 750,
  borderRadius: "5px",
  "background-color": lightGreySecondary,
  padding: "30px"
};

class RemoveTestModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      remove: ""
    };
  }

  closeModal = () => {
    const { onClose } = this.props;
    onClose();
  };

  onProceed = () => {
    const { handleRemove } = this.props;
    const { remove } = this.state;
    if (remove === "Remove") {
      handleRemove();
    } else {
      this.setState({ remove: "" });
      message.error("Incorrect Input ");
    }
  };

  render() {
    const { isVisible, onClose } = this.props;
    const { remove } = this.state;
    return (
      <Modal styles={{ modal: ModalStyles }} open={isVisible} onClose={this.closeModal} center>
        <HeadingWrapper>
          <Title>Confirm Remove Content </Title>
        </HeadingWrapper>
        <div>
          You are about to remove this test. Don't worry, assignments created from this test won't be affected. Type
          'Remove' in the below text box to Proceed.
        </div>
        <Input
          value={remove}
          onChange={ev => {
            this.setState({ remove: ev.target.value });
          }}
        />
        <ModalFooter>
          <Button type="primary" ghost key="back" onClick={() => onClose()}>
            CANCEL
          </Button>
          <Button key="submit" type="primary" onClick={this.onProceed}>
            PROCEED
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

RemoveTestModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  handleTestRemoved: PropTypes.func.isRequired,
  item: PropTypes.object
};

const enhance = compose(withRouter);

export default enhance(RemoveTestModal);

const HeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  justify-content: space-between;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 20px;
`;
