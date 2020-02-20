import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactOutsideEvent from "react-outside-event";
import { EduButton, FlexContainer } from "@edulastic/common";
import { Input } from "antd";
import { Container } from "./styled";

class Prompt extends Component {
  state = {
    position: 1
  };

  handleChange = e => {
    this.setState({ position: e.target.value });
  };

  handleSuccess = () => {
    const { position } = this.state;
    const { onSuccess } = this.props;
    onSuccess(position);
  };

  onOutsideEvent = event => {
    const { setShowPrompt } = this.props;
    if (event.type === "mousedown") {
      setShowPrompt(false);
    }
  };

  render() {
    const { position } = this.state;
    const { style, maxValue } = this.props;
    return (
      <Container style={style}>
        <FlexContainer style={{ marginBottom: 10 }}>
          <Input
            placeholder="Position"
            type="number"
            value={position}
            min={1}
            max={maxValue}
            onChange={this.handleChange}
          />
        </FlexContainer>
        <FlexContainer justifyContent="center">
          <EduButton type="primary" size="small" onClick={this.handleSuccess}>
            Reorder
          </EduButton>
        </FlexContainer>
      </Container>
    );
  }
}

Prompt.propTypes = {
  style: PropTypes.object,
  maxValue: PropTypes.number,
  onSuccess: PropTypes.func.isRequired
};

Prompt.defaultProps = {
  maxValue: 1,
  style: {}
};

export default ReactOutsideEvent(Prompt, ["mousedown"]);
