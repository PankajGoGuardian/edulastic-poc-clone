import React, { Component } from "react";
import PropTypes from "prop-types";
import enhanceWithClickOutside from "react-click-outside";
import { Icon } from "antd";
import { compose } from "redux";

import { MathInput, MathSpan } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { getFontSize } from "../../../../../../utils/helpers";
import CustomTextInput from "./components/CustomTextInput/index";

import { Wrapper } from "./styled/Wrapper";
import { Button } from "./styled/Button";
import { Buttons } from "./styled/Buttons";
import { Label } from "./styled/Label";
import { WrapperIn } from "./styled/WrapperIn";

class MathEssayInputLine extends Component {
  state = {
    isEmpty: false
  };

  inputRef = React.createRef();

  handleFocus = val => {
    const { setActive } = this.props;

    if (val) {
      setActive(false);
    }
  };

  componentWillReceiveProps(nextProps) {
    const empty = nextProps.line.text === "<p><br></p>" || nextProps.line.text === "";

    if (!empty) {
      this.setState({
        isEmpty: false
      });
    } else {
      this.setState({
        isEmpty: true
      });
    }

    if (this.props.disableResponse && !nextProps.disableResponse) {
      this.focus();
    }
  }

  focus = () => {
    const { active } = this.props;

    if (active && this.inputRef.current) {
      setTimeout(() => {
        this.inputRef.current.focus();
      }, 0);
    }
  };

  componentDidMount() {
    this.focus();
  }

  get fontSize() {
    const { item } = this.props;
    return getFontSize(item.uiStyle.fontsize);
  }

  renderMathText = text => `<p><span class="input__math" data-latex="${text}"></span>&nbsp;</p>`;

  render() {
    const { isEmpty } = this.state;
    const { onAddNewLine, onChange, line, id, onChangeType, active, item, t, disableResponse } = this.props;

    return (
      <Wrapper active={disableResponse ? false : active}>
        <WrapperIn>
          {line.type === "text" &&
            (disableResponse ? (
              <div dangerouslySetInnerHTML={{ __html: line.text }} />
            ) : (
              <CustomTextInput
                ref={this.inputRef}
                toolbarId={`toolbarId${id}`}
                onFocus={this.handleFocus}
                value={line.text}
                onChange={onChange}
                fontSize={this.fontSize}
              />
            ))}
          {line.type === "math" &&
            (disableResponse ? (
              <MathSpan dangerouslySetInnerHTML={{ __html: this.renderMathText(line.text) }} />
            ) : (
              <MathInput
                ref={this.inputRef}
                symbols={item.symbols}
                numberPad={item.numberPad}
                value={line.text}
                onInput={onChange}
                onFocus={this.handleFocus}
                fullWidth
                style={{
                  border: 0,
                  height: "auto",
                  minHeight: "auto",
                  fontSize: this.fontSize
                }}
              />
            ))}
          {active && isEmpty && !disableResponse && (
            <Buttons>
              <Button
                className={line.type === "math" ? "active" : ""}
                onClick={() => onChangeType("math")}
                title="Math"
              >
                M
              </Button>
              <Button
                className={line.type === "text" ? "active" : ""}
                onClick={() => onChangeType("text")}
                title="Text"
                data-cy="answer-math-text-btn"
              >
                T
              </Button>
            </Buttons>
          )}
          {active && !isEmpty && !disableResponse && (
            <Buttons>
              <Button onClick={onAddNewLine} title={t("component.options.createNewLine")}>
                <Icon type="enter" />
              </Button>
            </Buttons>
          )}
        </WrapperIn>
        {active && !disableResponse && <Label>{line.type}</Label>}
      </Wrapper>
    );
  }
}

MathEssayInputLine.propTypes = {
  line: PropTypes.object,
  item: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onAddNewLine: PropTypes.func.isRequired,
  onChangeType: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  setActive: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  disableResponse: PropTypes.bool
};

MathEssayInputLine.defaultProps = {
  disableResponse: false,
  line: {
    text: "",
    type: "text"
  }
};

const enhance = compose(
  withNamespaces("assessment"),
  enhanceWithClickOutside
);

export default enhance(MathEssayInputLine);
