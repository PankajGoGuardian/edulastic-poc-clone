import React, { Component } from "react";
import AceEditor from "react-ace";
import PropTypes from "prop-types";
import "brace/mode/json";
import "brace/theme/github";
import { Modal } from "../../../src/components/common";

class SourceModal extends Component {
  state = {
    json: ""
  };

  handleChange = json => {
    this.setState({
      json
    });
  };

  handleApply = () => {
    const { onApply } = this.props;
    const { json } = this.state;
    onApply(json);
  };

  componentDidMount() {
    const { children } = this.props;

    this.setState({
      json: children
    });
  }

  render() {
    const { onClose } = this.props;
    const { json } = this.state;

    return (
      <Modal title="Source" onApply={this.handleApply} onClose={onClose}>
        <AceEditor
          mode="json"
          theme="github"
          onChange={this.handleChange}
          editorProps={{ $blockScrolling: true }}
          value={json}
        />
      </Modal>
    );
  }
}

SourceModal.propTypes = {
  children: PropTypes.any.isRequired,
  onApply: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default SourceModal;
