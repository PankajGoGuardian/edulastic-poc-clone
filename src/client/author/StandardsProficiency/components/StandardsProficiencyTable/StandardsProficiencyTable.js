import React, { Component } from "react";
import * as moment from "moment";
import { Table, Input, Popconfirm, Form, Icon, Radio, Select } from "antd";

const Option = Select.Option;

import ScoreContentDiv from "./ScoreContentDiv/ScoreContentDiv";

import {
  StyledTableContainer,
  TopDiv,
  InfoDiv,
  SaveButtonDiv,
  SaveAlert,
  StyledH3,
  StyledUl,
  StyledDescription,
  StyledMasterDiv,
  StyledScoreSelect,
  StyledMasteryLevelSelect,
  StyledButton,
  StyledSaveButton,
  StyledAddButton,
  StyledRadioGroup
} from "./styled";

const FormItem = Form.Item;
const EditableContext = React.createContext();

class EditableCell extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { editing, dataIndex, title, inputType, record, index, ...restProps } = this.props;
    return (
      <EditableContext.Consumer>
        {form => {
          const { getFieldDecorator } = form;

          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
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
                      <StyledScoreSelect>
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
                      </StyledScoreSelect>
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
                </FormItem>
              ) : (
                restProps.children
              )}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

class StandardsProficiencyTable extends React.Component {
  constructor(props) {
    super(props);
    const { scale } = this.props;
    const data = [];
    for (let i = 0; i < scale.length; i++) {
      data.push({
        key: i,
        score: scale[i].score,
        _id: scale[i]._id,
        shortName: scale[i].shortName,
        threshold: scale[i].threshold,
        masteryLevel: scale[i].masteryLevel
      });
    }

    this.state = {
      data,
      editingKey: "",
      isAdding: false,
      isChangeState: false
    };

    this.columns = [
      {
        title: "Score",
        dataIndex: "score",
        width: "15%",
        editable: true,
        render: text => {
          return <ScoreContentDiv text={text} />;
        }
      },
      {
        title: "Mastery Level",
        dataIndex: "masteryLevel",
        width: "20%",
        editable: true
      },
      {
        title: "Short Name",
        dataIndex: "shortName",
        width: "25%",
        editable: true
      },
      {
        title: "Performance Threshold",
        dataIndex: "threshold",
        width: "25%",
        editable: true,
        render: text => {
          return <React.Fragment>{text}%</React.Fragment>;
        }
      },
      {
        title: "",
        dataIndex: "operation",
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a href="javascript:;" onClick={() => this.save(form, record.key)} style={{ marginRight: 8 }}>
                        Save
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
              ) : (
                <React.Fragment>
                  <StyledButton disabled={editingKey !== ""} onClick={() => this.edit(record.key)}>
                    <Icon type="edit" theme="twoTone" />
                  </StyledButton>
                  <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                    <StyledButton disabled={editingKey !== ""}>
                      <Icon type="delete" theme="twoTone" />
                    </StyledButton>
                  </Popconfirm>
                </React.Fragment>
              )}
            </div>
          );
        }
      }
    ];
  }

  isEditing = record => record.key === this.state.editingKey;

  cancel = key => {
    if (this.state.isAdding) this.handleDelete(key);
    this.setState({ editingKey: "", isAdding: false });
  };

  save = (form, key) => {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }

      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        this.setState({ data: newData, editingKey: "" });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: "" });
      }

      this.setState({ isAdding: false, isChangeState: true });
    });
  };

  edit = key => {
    this.setState({ editingKey: key });
  };

  handleAdd = () => {
    const { data, editingKey } = this.state;

    if (editingKey !== "") return;

    const newData = {
      key: data.length,
      score: 1,
      masteryLevel: "",
      shortName: "New User",
      threshold: 80
    };

    this.setState({
      data: [newData, ...data],
      editingKey: data.length,
      isChangeState: true
    });
  };

  handleDelete = key => {
    const data = [...this.state.data];
    this.setState({ data: data.filter(item => item.key !== key) });
  };

  changeCalcType = e => {
    this.setState({
      calcType: e.target.value,
      isChangeState: true
    });
  };

  saveScale = e => {
    if (this.state.isAdding) return;

    const { data } = this.state;
    data.map(row => {
      delete row.key;
      delete row._id;
    });

    const updateData = {
      scale: data,
      calcType: this.state.calcType
    };

    this.setState({ isChangeState: false });

    this.props.updateStandardsProficiency(updateData);
  };

  render() {
    const components = {
      body: {
        cell: EditableCell
      }
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record)
        })
      };
    });

    const { isChangeState } = this.state;

    return (
      <StyledTableContainer>
        <TopDiv>
          <InfoDiv>
            <StyledH3>Set Standards Based Grading Scale</StyledH3>
            <StyledDescription>
              Select scale and minimum percentage criteria for standard score
              <br />
              Note: Teachers can edit the performance threshould while assigning
            </StyledDescription>
          </InfoDiv>
          <SaveButtonDiv>
            {isChangeState && <SaveAlert>You have unsaved changes.</SaveAlert>}
            <StyledSaveButton onClick={this.saveScale}>Save</StyledSaveButton>
          </SaveButtonDiv>
        </TopDiv>

        <EditableContext.Provider value={this.props.form}>
          <Table
            components={components}
            dataSource={this.state.data}
            columns={columns}
            rowClassName="editable-row"
            pagination={{
              onChange: this.cancel
            }}
          />
        </EditableContext.Provider>
        <StyledAddButton onClick={this.handleAdd}>+ Add Level</StyledAddButton>
        <StyledMasterDiv>
          <StyledH3>Mastery Calculation Method</StyledH3>
          <StyledUl>
            <li>Select calcuation method to determine the student's mastery</li>
            <li>Standards based scores persist across classes(they do NOT reset automatically)</li>
            <li>Mastery score is rounded up when the calcaulated score is at/above mid point between two levels</li>
          </StyledUl>
          <StyledRadioGroup onChange={this.changeCalcType}>
            <Radio value="most recent">Most Recent</Radio>
            <Radio value="max score">Max Score</Radio>
            <Radio value="mode score">Mode Score</Radio>
            <Radio value="simple average">Simple Average</Radio>
            <Radio value="decaying average">Decaying Average</Radio>
            <Radio value="moving average">Moving Average</Radio>
            <Radio value="power law">Power Law</Radio>
          </StyledRadioGroup>
        </StyledMasterDiv>
      </StyledTableContainer>
    );
  }
}
const EditableStandardsProficiencyTable = Form.create()(StandardsProficiencyTable);

export default EditableStandardsProficiencyTable;
