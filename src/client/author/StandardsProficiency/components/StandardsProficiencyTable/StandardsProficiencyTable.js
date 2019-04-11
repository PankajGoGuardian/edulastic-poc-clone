import React, { Component } from "react";
import * as moment from "moment";
import { Table, Input, Popconfirm, Form, Icon, Radio, Select } from "antd";

const Option = Select.Option;

import StandardsProficiencyEditableCell from "./StandardsProficiencyEditableCell/StandardsProficiencyEditableCell";
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
  StyledButton,
  StyledSaveButton,
  StyledAddButton,
  StyledRadioGroup,
  StyledAverageRadioDiv,
  StyledAverageInput,
  StyledLabel
} from "./styled";

const FormItem = Form.Item;
const EditableContext = React.createContext();

class StandardsProficiencyTable extends React.Component {
  constructor(props) {
    super(props);
    const { scale, calcType, calcAttribute } = this.props.standardsProficiencyData;
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
      isChangeState: false,
      calcType: calcType,
      calcDecayingAttr: calcType === "DECAYING_AVERAGE" ? calcAttribute : 0,
      calcMovingAvrAttr: calcType === "MOVING_AVERAGE" ? calcAttribute : 0
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

    const dataSource = [];
    const { data } = this.state;
    data.map(row => {
      dataSource.push({
        score: row.score,
        masteryLevel: row.masteryLevel,
        shortName: row.shortName,
        threshold: row.threshold
      });
    });

    const { calcType } = this.state;
    const updateData = {
      scale: dataSource,
      calcType: calcType
    };

    if (calcType === "DECAYING_AVERAGE") {
      const { calcDecayingAttr } = this.state;
      updateData.calcAttribute = calcDecayingAttr;
    } else if (calcType === "MOVING_AVERAGE") {
      const { calcMovingAvrAttr } = this.state;
      updateData.calcAttribute = calcMovingAvrAttr;
    }

    this.setState({ isChangeState: false });

    this.props.updateStandardsProficiency(updateData);
  };

  onChangeCalcAttr = (e, keyName) => {
    const { value } = e.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!Number.isNaN(value) && reg.test(value)) || value === "" || value === "-") {
      if (keyName === "DECAYING_AVERAGE") this.setState({ calcDecayingAttr: value });
      else if (keyName === "MOVING_AVERAGE") this.setState({ calcMovingAvrAttr: value });
      this.setState({ isChangeState: true });
    }
  };

  render() {
    const components = {
      body: {
        cell: StandardsProficiencyEditableCell
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
          editing: this.isEditing(record),
          context: EditableContext
        })
      };
    });

    const { isChangeState, calcType, calcDecayingAttr, calcMovingAvrAttr } = this.state;

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
          <StyledRadioGroup defaultValue={calcType} onChange={this.changeCalcType}>
            <Radio value="MOST_RECENT">Most Recent</Radio>
            <Radio value="MAX_SCORE">Max Score</Radio>
            <Radio value="MODE_SCORE">Mode Score</Radio>
            <Radio value="AVERAGE">Simple Average</Radio>
            <StyledAverageRadioDiv>
              <Radio value="DECAYING_AVERAGE">Decaying Average</Radio>
              {calcType === "DECAYING_AVERAGE" && (
                <React.Fragment>
                  <StyledLabel>Decay %</StyledLabel>
                  <StyledAverageInput
                    defaultValue={calcDecayingAttr}
                    value={calcDecayingAttr}
                    maxLength={2}
                    onChange={e => this.onChangeCalcAttr(e, "DECAYING_AVERAGE")}
                  />
                </React.Fragment>
              )}
            </StyledAverageRadioDiv>
            <StyledAverageRadioDiv>
              <Radio value="MOVING_AVERAGE">Moving Average</Radio>
              {calcType === "MOVING_AVERAGE" && (
                <React.Fragment>
                  <StyledLabel>Not of Assesments</StyledLabel>
                  <StyledAverageInput
                    defaultValue={calcMovingAvrAttr}
                    value={calcMovingAvrAttr}
                    onChange={e => this.onChangeCalcAttr(e, "MOVING_AVERAGE")}
                  />
                </React.Fragment>
              )}
            </StyledAverageRadioDiv>
            <Radio value="POWER_LOW">Power Law</Radio>
          </StyledRadioGroup>
        </StyledMasterDiv>
      </StyledTableContainer>
    );
  }
}
const EditableStandardsProficiencyTable = Form.create()(StandardsProficiencyTable);

export default EditableStandardsProficiencyTable;
