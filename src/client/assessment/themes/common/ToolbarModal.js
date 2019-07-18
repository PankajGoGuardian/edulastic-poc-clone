import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button, Modal } from "antd";
import { checkAnswerEvaluation } from "../../actions/checkanswer";

class ToolbarModal extends React.Component {
  checkAnswer = () => {
    const { onClose, checkAnswerEvaluation } = this.props;
    checkAnswerEvaluation();
    onClose();
  };

  hint = () => {
    const { onClose } = this.props;
    onClose();
  };

  bookmark = () => {
    const { onClose } = this.props;
    onClose();
  };

  pointer = () => {
    const { onClose } = this.props;
    onClose();
  };

  inchRuler = () => {
    const { onClose } = this.props;
    onClose();
  };

  centimeterRuler = () => {
    const { onClose } = this.props;
    onClose();
  };

  calculator = () => {
    const { onClose } = this.props;
    onClose();
  };

  eliminationQuestion = () => {
    const { onClose } = this.props;
    onClose();
  };

  procractorRuler = () => {
    const { onClose } = this.props;
    onClose();
  };

  render() {
    const { isVisible, onClose } = this.props;
    return (
      <Modal
        visible={isVisible}
        onCancel={onClose}
        closable={false}
        bodyStyle={{ padding: 20 }}
        footer={null}
        width="390px"
      >
        <Container>
          <StyledButton onClick={() => this.checkAnswer()}>Check Answer</StyledButton>
          <StyledButton onClick={() => this.hint()}>Hint</StyledButton>
          <StyledButton onClick={() => this.bookmark()}>Bookmark</StyledButton>
          <StyledButton onClick={() => this.pointer()}>Pointer</StyledButton>
          <StyledButton onClick={() => this.inchRuler()}>Inch Ruler</StyledButton>
          <StyledButton onClick={() => this.centimeterRuler()}>Centimeter Ruler</StyledButton>
          <StyledButton onClick={() => this.calculator()}>Calculator</StyledButton>
          <StyledButton onClick={() => this.eliminationQuestion()}>Elimination Question</StyledButton>
          <StyledButton onClick={() => this.procractorRuler()}>Procractor Ruler</StyledButton>
        </Container>
      </Modal>
    );
  }
}

ToolbarModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  checkanswer: PropTypes.func.isRequired
};

export default connect(
  null,
  { checkAnswerEvaluation }
)(ToolbarModal);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;
  @media (max-width: 468px) {
    width: calc(100vw - 100px);
  }
`;

const StyledButton = styled(Button)`
  height: 50px;
  text-transform: uppercase;
  border: none;
  border-bottom: 1px solid ${props => props.theme.default.headerButtonBorderColor};
  border-radius: 0px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.3px;
  &:active,
  &:focus,
  &:hover {
    border-color: ${props => props.theme.default.headerButtonBorderHoverColor};
    color: ${props => props.theme.default.headerButtonBorderHoverColor};
  }
`;
