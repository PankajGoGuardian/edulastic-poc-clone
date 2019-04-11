import React, { Component } from "react";
import { Input, Select } from "antd";
import ScoreContentDiv from "../ScoreContentDiv/ScoreContentDiv";
import { StyledFormItem } from "./styled";

const Option = Select.Option;

class StandardsProficiencyEditableCell extends React.Component {
  constructor(props) {
    super(props);
  }

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
                          }
                        ],
                        initialValue: record[dataIndex]
                      })(<Input />)}
                    {inputType === "score" &&
                      getFieldDecorator(dataIndex, {
                        rules: [
                          {
                            required: true,
                            message: "Please Input " + title + "!"
                          }
                        ],
                        initialValue: record[dataIndex]
                      })(
                        <Select>
                          <Option value={4}>
                            <ScoreContentDiv text={4} />
                          </Option>
                          <Option value={3}>
                            <ScoreContentDiv text={3} />
                          </Option>
                          <Option value={2}>
                            <ScoreContentDiv text={2} />
                          </Option>
                          <Option value={1}>
                            <ScoreContentDiv text={1} />
                          </Option>
                        </Select>
                      )}
                    {inputType === "masteryLevel" &&
                      getFieldDecorator(dataIndex, {
                        rules: [
                          {
                            required: true,
                            message: "Please Input " + title + "!"
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
