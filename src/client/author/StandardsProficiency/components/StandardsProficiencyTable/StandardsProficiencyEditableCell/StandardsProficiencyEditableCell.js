import React, { Component } from "react";
import { Input, Select } from "antd";
import { StyledFormItem, ScoreColorSpan, StyledColorSelect, ScoreSpan } from "./styled";

const Option = Select.Option;

class StandardsProficiencyEditableCell extends React.Component {
  constructor(props) {
    super(props);
  }

  checkLevelUique = (rule, value, callback) => {
    const dataSource = this.props.dataSource.filter(item => item.key !== this.props.record.key);
    const sameNameRow = dataSource.filter(item => item.masteryLevel === value);
    if (sameNameRow.length <= 0) {
      callback();
      return;
    }
    callback("Name should be unique.");
  };

  checkShortNameUnique = (rule, value, callback) => {
    const dataSource = this.props.dataSource.filter(item => item.key !== this.props.record.key);
    const sameShortNameRow = dataSource.filter(item => item.shortName === value);
    if (sameShortNameRow.length <= 0) {
      callback();
      return;
    }
    callback("Short name should be unique.");
  };

  checkPerThre = (rule, value, callback) => {
    if (value.length == 0) {
      callback();
      return;
    }

    const { dataSource, record } = this.props;
    if (record.score == 1) {
      callback();
      return;
    }

    var isnum = /^\d+$/.test(value);
    if (!isnum) {
      callback("Please input number.");
    } else {
      if (parseInt(value) < 0 || parseInt(value) > 99) {
        callback("Please input number between 0 and 99.");
      } else {
        if (record.score === dataSource.length) {
          if (parseInt(value) === 100) {
            callback(`Value should be less then 100.`);
          } else if (parseInt(value) <= dataSource[1].threshold)
            callback(`Value should not be less then ${dataSource[1].threshold}.`);
          else {
            callback();
            return;
          }
        } else {
          if (parseInt(value) >= dataSource[dataSource.length - record.score - 1].threshold) {
            callback(`Value should be less then ${dataSource[dataSource.length - record.score - 1].threshold}.`);
          } else if (parseInt(value) <= dataSource[dataSource.length - record.score + 1].threshold) {
            callback(`Value should not be less then ${dataSource[dataSource.length - record.score + 1].threshold}.`);
          } else {
            callback();
            return;
          }
        }
      }
    }
  };

  checkColorUnique = (rule, value, callback) => {
    const dataSource = this.props.dataSource.filter(item => item.key !== this.props.record.key);
    const sameNameRow = dataSource.filter(item => item.color === value);
    if (sameNameRow.length <= 0) {
      callback();
      return;
    }
    callback("Color should be unique");
  };

  render() {
    const { editing, dataIndex, title, inputType, record, context, ...restProps } = this.props;
    return (
      <React.Fragment>
        {editing ? (
          <context.Consumer>
            {form => {
              const { getFieldDecorator } = form;
              return (
                <td {...restProps}>
                  <StyledFormItem>
                    {inputType === "shortName" &&
                      getFieldDecorator(dataIndex, {
                        rules: [
                          {
                            required: true,
                            message: "Please Input " + title + "!"
                          },
                          {
                            validator: this.checkShortNameUnique
                          }
                        ],
                        initialValue: record[dataIndex]
                      })(<Input />)}
                    {inputType === "threshold" &&
                      getFieldDecorator(dataIndex, {
                        rules: [
                          {
                            required: true,
                            message: "Please Input " + title + "!"
                          },
                          { validator: this.checkPerThre }
                        ],
                        initialValue: record[dataIndex]
                      })(<Input disabled={record.score == 1} />)}
                    {inputType === "color" && (
                      <React.Fragment>
                        {getFieldDecorator(dataIndex, {
                          rules: [
                            {
                              required: true,
                              message: "Please Input " + title + "!"
                            },
                            { validator: this.checkColorUnique }
                          ],
                          initialValue: record[dataIndex]
                        })(
                          <StyledColorSelect>
                            <Option value={"#F3FCCF"}>
                              <ScoreColorSpan color={"#F3FCCF"} />
                            </Option>
                            <Option value={"#C8EB9B"}>
                              <ScoreColorSpan color={"#C8EB9B"} />
                            </Option>
                            <Option value={"#FDFDC8"}>
                              <ScoreColorSpan color={"#FDFDC8"} />
                            </Option>
                            <Option value={"#FAFA2B"}>
                              <ScoreColorSpan color={"#FAFA2B"} />
                            </Option>
                            <Option value={"#FDE2B3"}>
                              <ScoreColorSpan color={"#FDE2B3"} />
                            </Option>
                            <Option value={"#FABDBD"}>
                              <ScoreColorSpan color={"#FABDBD"} />
                            </Option>
                            <Option value={"#FFC300"}>
                              <ScoreColorSpan color={"#FFC300"} />
                            </Option>
                            <Option value={"#D4E9FA"}>
                              <ScoreColorSpan color={"#D4E9FA"} />
                            </Option>
                          </StyledColorSelect>
                        )}
                        <ScoreSpan>{record.score}</ScoreSpan>
                      </React.Fragment>
                    )}
                    {inputType === "masteryLevel" &&
                      getFieldDecorator(dataIndex, {
                        rules: [
                          {
                            required: true,
                            message: "Please Input " + title + "!"
                          },
                          {
                            validator: this.checkLevelUique
                          }
                        ],
                        initialValue: record[dataIndex]
                      })(<Input />)}
                  </StyledFormItem>
                </td>
              );
            }}
          </context.Consumer>
        ) : (
          <td {...restProps}>{restProps.children}</td>
        )}
      </React.Fragment>
    );
  }
}

export default StandardsProficiencyEditableCell;
