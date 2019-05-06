import React, { Component } from "react";
import { Table, Input, Form, Icon, Checkbox, Button, message } from "antd";

import {
  StyledTableContainer,
  StyledColFromTo,
  StyledButton,
  StyledProP,
  StyledIcon,
  StyledBottomDiv,
  StyledSaveButton,
  StyledDivCenter,
  StyledEnableContainer,
  SaveAlert
} from "./styled";

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  saveToValue = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      handleSave({ ...record, ...values });
    });
  };

  handleChangePro = e => {
    if (isNaN(e.target.value)) {
      return;
    }
  };

  checkPrice = (rule, value, callback) => {
    if (!isNaN(value)) {
      if (parseInt(value) > 100 || parseInt(value) < 0) callback("Please input value between 0 and 100");
      else callback();
      return;
    }
    callback("Please input value between 0 and 100");
  };

  changeBandName = e => {
    if (e.target.value.length > 150) e.target.value = e.target.value.slice(0, 150);
  };

  checkBandNameUnique = (rule, value, callback) => {
    const { record } = this.props;
    const dataSource = this.props.dataSource.filter(item => item.key != record.key);

    const sameNameBand = dataSource.filter(item => item.name === value);
    if (sameNameBand.length > 0) callback("Performance Band name should be unique.");
    else {
      callback();
      return;
    }
  };

  render() {
    const { editing } = this.state;
    const { editable, dataIndex, title, record, index, handleSave, toggleEditToValue, ...restProps } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {form => {
              this.form = form;
              if (dataIndex === "to") {
                return toggleEditToValue ? (
                  <StyledEnableContainer>
                    <StyledButton>
                      <StyledIcon type="minus" />
                    </StyledButton>
                    <FormItem style={{ margin: 0 }}>
                      {form.getFieldDecorator(dataIndex, {
                        rules: [
                          {
                            required: true,
                            message: `${title} is required.`
                          },
                          { validator: this.checkPrice }
                        ],
                        initialValue: parseInt(record[dataIndex])
                      })(
                        <Input
                          onChange={this.handleChangePro}
                          ref={node => (this.toValueInput = node)}
                          onPressEnter={this.saveToValue}
                          onBlur={this.saveToValue}
                          autoFocus
                        />
                      )}
                    </FormItem>
                    <StyledButton>
                      <StyledIcon type="plus" />
                    </StyledButton>
                  </StyledEnableContainer>
                ) : (
                  <div className="editable-cell-value-wrap">{restProps.children}</div>
                );
              } else {
                return editing ? (
                  <React.Fragment>
                    {dataIndex === "name" && (
                      <FormItem style={{ margin: 0 }}>
                        {form.getFieldDecorator(dataIndex, {
                          rules: [
                            {
                              required: true,
                              message: `${title} is required.`
                            },
                            { validator: this.checkBandNameUnique }
                          ],
                          initialValue: record[dataIndex]
                        })(
                          <Input
                            ref={node => (this.input = node)}
                            onPressEnter={this.save}
                            onBlur={this.save}
                            onChange={this.changeBandName}
                          />
                        )}
                      </FormItem>
                    )}
                  </React.Fragment>
                ) : (
                  <div className="editable-cell-value-wrap" onClick={this.toggleEdit}>
                    {restProps.children}
                  </div>
                );
              }
            }}
          </EditableContext.Consumer>
        ) : (
          restProps.children
        )}
      </td>
    );
  }
}

class PerformanceBandTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: "",
        dataIndex: "name",
        width: "20%",
        editable: true,
        render: (text, record) => {
          return (
            <React.Fragment>
              {record.name}&nbsp;
              <Icon type="edit" theme="twoTone" />
            </React.Fragment>
          );
        }
      },
      {
        title: "Above or At Standard",
        dataIndex: "aboveOrAtStandard",
        width: "20%",
        render: (text, record) => {
          return (
            <StyledDivCenter>
              <Checkbox defaultChecked={record.aboveOrAtStandard} onChange={e => this.changeAbove(e, record.key)} />
            </StyledDivCenter>
          );
        }
      },
      {
        title: "From",
        dataIndex: "from",
        width: "20%",
        render: (text, record) => {
          return (
            <StyledColFromTo>
              <StyledButton onClick={e => this.onClickFromTo(e, record.key, "from", -1)}>
                <StyledIcon type="minus" />
              </StyledButton>
              <StyledProP>{record.from}%</StyledProP>
              <StyledButton onClick={e => this.onClickFromTo(e, record.key, "from", 1)}>
                <StyledIcon type="plus" />
              </StyledButton>
            </StyledColFromTo>
          );
        }
      },
      {
        title: "To",
        dataIndex: "to",
        width: "20%",
        editable: true,
        render: (text, record) => {
          return (
            <StyledColFromTo>
              <StyledButton onClick={e => this.onClickFromTo(e, record.key, "to", -1)}>
                <StyledIcon type="minus" />
              </StyledButton>
              <StyledProP>{record.to}%</StyledProP>
              <StyledButton onClick={e => this.onClickFromTo(e, record.key, "to", 1)}>
                <StyledIcon type="plus" />
              </StyledButton>
            </StyledColFromTo>
          );
        }
      },
      {
        title: "",
        dataIndex: "operation",
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <StyledDivCenter>
              <a href="javascript:;" onClick={e => this.handleDelete(e, record.key)}>
                <Icon type="delete" theme="twoTone" />
                &nbsp;Delete
              </a>
            </StyledDivCenter>
          ) : null
      }
    ];

    const { performanceBand } = this.props.performanceBand;

    performanceBand.map((row, index) => {
      row.key = index;
    });

    this.state = {
      dataSource: performanceBand,
      count: performanceBand.length,
      editingKey: -1,
      isChangeState: false
    };
  }

  onClickFromTo = (e, key, keyName, value) => {
    const dataSource = [...this.state.dataSource];

    if (key == 0 && keyName === "from") return;
    if (key == dataSource.length - 1 && keyName === "to") return;

    if (keyName === "from") {
      if (
        dataSource[key].from + value == dataSource[key].to ||
        dataSource[key].from + value == dataSource[key - 1].from
      ) {
        return;
      } else {
        dataSource[key].from += value;
        dataSource[key - 1].to += value;
      }
    }

    if (keyName === "to") {
      if (dataSource[key].to + value == dataSource[key].from || dataSource[key].to + value == dataSource[key + 1].to) {
        return;
      } else {
        dataSource[key].to += value;
        dataSource[key + 1].from += value;
      }
    }

    this.setState({
      dataSource: dataSource,
      isChangeState: true
    });
  };

  changeAbove = (e, key) => {
    const dataSource = this.state.dataSource;
    dataSource.map(row => {
      if (row.key === key) row.aboveOrAtStandard = e.target.checked;
    });
  };

  handleDelete = (e, key) => {
    const dataSource = [...this.state.dataSource];
    if (dataSource.length <= 2) {
      message.error("Performance Band should at least 2.");
      return;
    }
    if (dataSource[0].key === key) dataSource[1].from = 100;
    else if (dataSource[dataSource.length - 1].key === key) dataSource[dataSource.length - 2].to = 0;
    else dataSource[key + 1].from = dataSource[key].from;

    this.setState({
      dataSource: dataSource.filter(item => item.key !== key),
      isChangeState: true
    });
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const performanceBandName = "Performance Band" + dataSource.length;
    const newData = {
      key: count,
      name: performanceBandName,
      aboveOrAtStandard: true,
      from: 0,
      to: 0
    };

    dataSource[dataSource.length - 1].to = dataSource[dataSource.length - 1].from - 1;

    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
      editingKey: dataSource[dataSource.length - 1].key,
      isChangeState: true
    });
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    newData[newData.length - 1].from = newData[newData.length - 2].to;

    this.setState({
      dataSource: newData,
      editingKey: -1,
      isChangeState: true
    });
  };

  updatePerformanceBand = () => {
    const dataSource = [];
    this.state.dataSource.map(row => {
      dataSource.push({
        name: row.name,
        aboveOrAtStandard: row.aboveOrAtStandard,
        from: row.from,
        to: row.to
      });
    });
    this.props.updatePerformanceBand(dataSource);
    this.setState({ isChangeState: false });
  };

  isToValueEditing = record => record.key === this.state.editingKey;

  render() {
    const { dataSource, editingKey, isChangeState } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
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
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
          toggleEditToValue: this.isToValueEditing(record),
          dataSource: dataSource
        })
      };
    });

    const isAddDisable =
      (dataSource[dataSource.length - 1].to == 0 && dataSource[dataSource.length - 1].from == 0) ||
      editingKey != -1 ||
      dataSource.length >= 10
        ? true
        : false;

    return (
      <StyledTableContainer>
        <Table components={components} rowClassName={() => "editable-row"} dataSource={dataSource} columns={columns} />
        <StyledBottomDiv>
          {isChangeState && <SaveAlert>You have unsaved changes.</SaveAlert>}
          <StyledSaveButton type="primary" onClick={this.updatePerformanceBand} disabled={!isChangeState}>
            Save
          </StyledSaveButton>
          <Button type="primary" shape="round" onClick={this.handleAdd} ghost disabled={isAddDisable}>
            + Add Band
          </Button>
        </StyledBottomDiv>
      </StyledTableContainer>
    );
  }
}

export default PerformanceBandTable;
