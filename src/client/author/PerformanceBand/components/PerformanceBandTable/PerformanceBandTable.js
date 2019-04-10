import React, { Component } from "react";
import { Table, Input, Popconfirm, Form, Icon, Checkbox } from "antd";

import {
  StyledTableContainer,
  StyledColFromTo,
  StyledButton,
  StyledProP,
  StyledIcon,
  StyledBottomDiv,
  StyledAddButton,
  StyledSaveButton,
  StyledDivCenter
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

  render() {
    const { editing } = this.state;
    const { editable, dataIndex, title, record, index, handleSave, ...restProps } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {form => {
              this.form = form;
              return editing ? (
                <FormItem style={{ margin: 0 }}>
                  {form.getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: `${title} is required.`
                      }
                    ],
                    initialValue: record[dataIndex]
                  })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
                </FormItem>
              ) : (
                <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={this.toggleEdit}>
                  {restProps.children}
                </div>
              );
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
            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
              <StyledDivCenter>
                <a href="javascript:;">
                  <Icon type="delete" theme="twoTone" />
                  &nbsp;Delete
                </a>
              </StyledDivCenter>
            </Popconfirm>
          ) : null
      }
    ];

    const { performanceBand } = this.props.performanceBand;

    performanceBand.map((row, index) => {
      row.key = index;
    });

    this.state = {
      dataSource: performanceBand,
      count: performanceBand.length
    };
  }

  onClickFromTo = (e, key, keyName, value) => {
    const dataSource = this.state.dataSource;
    dataSource.map(row => {
      if (row.key === key) row[keyName] += value;
      if (row[keyName] > 100) row[keyName] = 100;
      if (row[keyName] < 0) row[keyName] = 0;
    });
    this.setState({ dataSource: dataSource });
    console.log(dataSource);
  };

  changeAbove = (e, key) => {
    const dataSource = this.state.dataSource;
    dataSource.map(row => {
      if (row.key === key) row.aboveOrAtStandard = e.target.checked;
    });
  };

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      name: `New`,
      aboveOrAtStandard: true,
      from: 50,
      to: 100
    };

    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1
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
    this.setState({ dataSource: newData });
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
  };

  render() {
    const { dataSource } = this.state;
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
          handleSave: this.handleSave
        })
      };
    });
    return (
      <StyledTableContainer>
        <Table components={components} rowClassName={() => "editable-row"} dataSource={dataSource} columns={columns} />
        <StyledBottomDiv>
          <StyledSaveButton onClick={this.updatePerformanceBand}>Save</StyledSaveButton>
          <StyledAddButton onClick={this.handleAdd}>+ Add Band</StyledAddButton>
        </StyledBottomDiv>
      </StyledTableContainer>
    );
  }
}

export default PerformanceBandTable;
