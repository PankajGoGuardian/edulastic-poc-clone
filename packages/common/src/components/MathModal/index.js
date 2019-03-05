import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import ReactModal from "react-modal";
import { Button, Icon } from "antd";
import MathInput from "../MathInput";

const MathModalHeader = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const MathModalFooter = styled.div`
  width: 100%;
  height: 30px;
  margin-top: 15px;
`;

const CancelButton = styled(Button)`
  float: right;
  margin-right: 15px;
`;

const OKButton = styled(Button)`
  float: right;
`;

class MathModal extends React.Component {
  state = {
    latex: ""
  };

  static propTypes = {
    show: PropTypes.bool,
    symbols: PropTypes.array.isRequired,
    numberPad: PropTypes.array.isRequired,
    showResponse: PropTypes.bool,
    value: PropTypes.string,
    onSave: PropTypes.func,
    onClose: PropTypes.func
  };

  static defaultProps = {
    show: false,
    value: "",
    showResponse: false,
    onSave: () => {},
    onClose: () => {}
  };

  constructor(props) {
    super(props);
    ReactModal.setAppElement("#body");
    this.state.latex = props.value;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { show } = this.props;
    if (!show && nextProps.show) {
      this.setState({
        latex: nextProps.value
      });
    }
  }

  onInput(latex) {
    this.setState({ latex });
  }

  render() {
    const { symbols, numberPad, showResponse, show, onSave, onClose } = this.props;
    const { latex } = this.state;

    return (
      <ReactModal
        isOpen={show}
        onRequestClose={onClose}
        overlayClassName="MathModal__Overlay"
        className="MathModal__Content"
      >
        <MathModalHeader>
          <h3>Edit Math</h3>
          <Button onClick={onClose}>
            <Icon type="close" theme="outlined" />
          </Button>
        </MathModalHeader>
        <MathInput
          alwaysShowKeyboard
          symbols={symbols}
          numberPad={numberPad}
          showResponse={showResponse}
          value={latex}
          onInput={newLatex => this.onInput(newLatex)}
        />
        <MathModalFooter>
          <OKButton type="primary" onClick={() => onSave(latex)}>
            OK
          </OKButton>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
        </MathModalFooter>
      </ReactModal>
    );
  }
}

export default MathModal;
