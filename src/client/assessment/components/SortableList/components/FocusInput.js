import React, { Component } from "react";
import PropTypes from "prop-types";
import { Input } from "antd";

class FocusInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dirty: props.dirty,
      value: props.value
    };
    this.inputRef = React.createRef();
  }

  static propTypes = {
    dirty: PropTypes.bool
  };

  static defaultProps = {
    dirty: false
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value
    });
  }

  onFocus(evt) {
    // TODO fix the implementation
    const { dirty, value } = this.state;
    const { onChange, onFocus } = this.props;
    if (!dirty) {
      this.setState({
        value
      });
      this.inputRef.current.value = value;
      onChange({
        target: this.inputRef.current
      });
    }
    this.setState({
      dirty: true
    });

    if (onFocus) {
      onFocus(evt);
    }
  }

  render() {
    const { value } = this.state;
    return <Input ref={this.inputRef} {...this.props} value={value} onFocus={evt => this.onFocus(evt)} />;
  }
}

FocusInput.propTypes = {
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired
};

export default FocusInput;
