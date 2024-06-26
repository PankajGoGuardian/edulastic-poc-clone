import React from "react";
import PropTypes from "prop-types";
import { Select, InputNumber, Button } from "antd";
import { arrayMove } from "react-sortable-hoc";
import { ThemeProvider } from "styled-components";

import { themes } from "../../../../../../theme";
import { EXACT_MATCH } from "../../../../../../assessment/constants/constantsForQuestions";
import SortableList from "../../../../../../assessment/components/SortableList";
import { QuestionFormWrapper, FormGroup, FormLabel, Points } from "../../common/QuestionForm";
import produce from "immer";

export default class QuestionDropdown extends React.Component {
  static propTypes = {
    question: PropTypes.object,
    onUpdate: PropTypes.func.isRequired
  };
  state = {
    value: "",
    score: 1
  };

  static defaultProps = {
    question: {
      options: {
        0: ["A", "B"]
      },
      validation: {
        validResponse: {
          score: 1,
          value: []
        },
        altResponses: []
      }
    }
  };

  get currentOptions() {
    const {
      question: { options }
    } = this.props;
    return [...options[0]];
  }

  handleSortEnd = ({ oldIndex, newIndex }) => {
    const nextOptions = arrayMove(this.currentOptions, oldIndex, newIndex);

    this.updateOptions(nextOptions);
  };

  handleAdd = () => {
    const nextOptions = this.currentOptions;
    nextOptions.push(`New Choice ${nextOptions.length + 1}`);

    this.updateOptions(nextOptions);
  };

  handleRemove = itemIndex => {
    const nextOptions = this.currentOptions;
    const removingValue = nextOptions[itemIndex];
    const validValue = this.props.question?.validation?.validResponse?.value?.[0]?.value;
    nextOptions.splice(itemIndex, 1);

    this.updateOptions(nextOptions, validValue === removingValue);
  };

  updateOptions = (nextOptions, resetValid = false) => {
    const { onUpdate } = this.props;

    const data = {
      options: {
        0: nextOptions
      },
      ...(resetValid
        ? {
            validation: {
              validResponse: {
                value: []
              }
            }
          }
        : {})
    };

    onUpdate(data);
  };

  handleOptionChange = (itemIndex, event) => {
    const nextOptions = this.currentOptions;

    nextOptions[itemIndex] = event.target.value;

    this.updateOptions(nextOptions);
  };

  handleValueChange = value => {
    const { score } = this.state;
    this.setState({ value }, () => {
      this.updateValidation(value, score);
    });
  };

  handleScoreChange = score => {
    const { value } = this.state;
    this.setState({ score }, () => {
      this.updateValidation(value, score);
    });
  };

  updateValidation = (value, score) => {
    const { onUpdate } = this.props;

    const data = {
      validation: {
        scoringType: EXACT_MATCH,
        validResponse: {
          value: [{ id: "0", value }],
          score
        },
        altResponses: []
      }
    };

    onUpdate(data);
  };

  render() {
    const {
      question: { validation }
    } = this.props;
    const {
      validResponse: { value, score }
    } = validation;

    return (
      <ThemeProvider theme={themes.default}>
        <QuestionFormWrapper>
          <FormGroup>
            <FormLabel>Choices</FormLabel>
            <SortableList
              items={this.currentOptions}
              onSortEnd={this.handleSortEnd}
              dirty
              useDragHandle
              onRemove={this.handleRemove}
              onChange={this.handleOptionChange}
            />
            <Button onClick={this.handleAdd}>Add choice</Button>
          </FormGroup>
          <FormGroup>
            <FormLabel>Correct Answer</FormLabel>
            <Select
              value={value[0] && value[0].value}
              onChange={this.handleValueChange}
              style={{ marginRight: "20px", minWidth: "200px" }}
              getPopupContainer={trigger => trigger.parentNode}
            >
              {this.currentOptions.map((option, key) => (
                <Select.Option key={key} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
            <InputNumber min={0} value={score} onChange={this.handleScoreChange} />
            <Points>Points</Points>
          </FormGroup>
        </QuestionFormWrapper>
      </ThemeProvider>
    );
  }
}
