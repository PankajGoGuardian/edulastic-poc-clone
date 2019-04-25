import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import * as moment from "moment";
import { Table, Input, Popconfirm, Form, Icon, DatePicker } from "antd";

import { StyledTableContainer, StyledButton, StyledAddButton } from "./styled";

// selectors
import { getCreatedTermSelector } from "../../ducks";

const FormItem = Form.Item;
const EditableContext = React.createContext();

class EditableCell extends React.Component {
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
                  {inputType === "text"
                    ? getFieldDecorator(dataIndex, {
                        rules: [
                          {
                            required: true,
                            message: "Please Input " + title + "!"
                          }
                        ],
                        initialValue: record[dataIndex]
                      })(<Input />)
                    : getFieldDecorator(dataIndex, {
                        rules: [{ required: true, message: "Please Input " + title + "!" }],
                        initialValue: moment(record[dataIndex], "DD MMM YYYY")
                      })(<DatePicker format={"DD MMM YYYY"} />)}
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

class TermTable extends React.Component {
  constructor(props) {
    super(props);

    const data = [];
    for (let i = 0; i < this.props.termSetting.length; i++) {
      data.push({
        key: i,
        name: this.props.termSetting[i].name,
        startDate: this.props.termSetting[i].startDate,
        endDate: this.props.termSetting[i].endDate,
        startDateVisible: moment(this.props.termSetting[i].startDate).format("DD MMM YYYY"),
        endDateVisible: moment(this.props.termSetting[i].endDate).format("DD MMM YYYY"),
        _id: this.props.termSetting[i]._id,
        districtId: this.props.termSetting[i].districtId
      });
    }

    this.state = { data, editingKey: "", isAdding: false };

    this.columns = [
      {
        title: "School Year Name",
        dataIndex: "name",
        width: "25%",
        editable: true
      },
      {
        title: "Start Date",
        dataIndex: "startDateVisible",
        width: "25%",
        editable: true
      },
      {
        title: "End Date",
        dataIndex: "endDateVisible",
        width: "25%",
        editable: true
      },
      {
        title: <StyledAddButton onClick={this.handleAdd}>+ Add School Year</StyledAddButton>,
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

  componentWillReceiveProps(nextProps) {
    if (
      Object.keys(nextProps.createdTerm.data).length > 0 &&
      this.props.createdTerm.key !== nextProps.createdTerm.key
    ) {
      const { createdTerm } = nextProps;

      const newData = [...this.state.data];
      newData.map(data => {
        if (data.key === createdTerm.key) {
          data._id = createdTerm._id;
        }
      });
      this.setState({ data: newData, editingKey: "" });
    }
  }

  isEditing = record => record.key === this.state.editingKey;

  cancel = key => {
    if (this.state.isAdding) {
      const data = [...this.state.data];
      this.setState({ data: data.filter(item => item.key !== key) });
    }
    this.setState({ editingKey: "", isAdding: false });
  };

  save = (form, key) => {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const saveValue = row;

      if (saveValue.hasOwnProperty("startDateVisible")) {
        saveValue.startDate = saveValue.startDateVisible.valueOf();
        saveValue.startDateVisible = saveValue.startDateVisible.format("DD MMM YYYY");
      }

      if (saveValue.hasOwnProperty("endDateVisible")) {
        saveValue.endDate = saveValue.endDateVisible.valueOf();
        saveValue.endDateVisible = saveValue.endDateVisible.format("DD MMM YYYY");
      }

      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...saveValue
        });
        this.setState({ data: newData, editingKey: "" });
      } else {
        newData.push(saveValue);
        this.setState({ data: newData, editingKey: "" });
      }

      if (this.state.isAdding) {
        const createTermData = {
          body: {
            name: saveValue.name,
            districtId: this.state.data[key].districtId,
            startDate: saveValue.startDate,
            endDate: saveValue.endDate
          },
          key: key
        };
        this.props.createTerm(createTermData);
      } else {
        const updateTermData = {
          _id: this.state.data[key]._id,
          name: saveValue.name,
          districtId: this.state.data[key].districtId,
          startDate: saveValue.startDate,
          endDate: saveValue.endDate
        };
        this.props.updateTerm(updateTermData);
      }

      this.setState({ isAdding: false });
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
      name: `New School Year`,
      startDate: moment().valueOf(),
      endDate: moment().valueOf(),
      startDateVisible: moment().format("DD MMM YYYY"),
      endDateVisible: moment().format("DD MMM YYYY"),
      _id: "",
      districtId: this.props.districtId
    };

    this.setState({
      data: [newData, ...data],
      editingKey: data.length,
      isAdding: true
    });
  };

  handleDelete = key => {
    const data = [...this.state.data];
    this.setState({ data: data.filter(item => item.key !== key) });
    const selectedTerm = data.filter(item => item.key == key);
    this.props.deleteTerm(selectedTerm[0]._id);
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
          inputType: col.dataIndex === "name" ? "text" : "date",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record)
        })
      };
    });

    return (
      <StyledTableContainer>
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
      </StyledTableContainer>
    );
  }
}

const EditableTermTable = Form.create()(TermTable);

const enhance = compose(
  connect(state => ({
    createdTerm: getCreatedTermSelector(state)
  }))
);

export default enhance(EditableTermTable);
