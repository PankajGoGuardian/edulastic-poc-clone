import React from "react";
import { Table, Input, InputNumber, Form, Icon, Checkbox, message, Slider, Row, Col } from "antd";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";
import produce from "immer";
import styled from "styled-components";
import { themeColor, white } from "@edulastic/colors";
import ColorPicker, { colors as colorsList } from "../Container/ColorPicker";

import {
  receivePerformanceBandAction,
  createPerformanceBandAction,
  updatePerformanceBandAction,
  setPerformanceBandChangesAction,
  getPerformanceBandList
} from "../../ducks";

import { getUserOrgId } from "../../../src/selectors/user";

import {
  StyledTableContainer,
  StyledColFromTo,
  StyledBottomDiv,
  StyledSaveButton,
  StyledDivCenter,
  StyledEnableContainer,
  SaveAlert,
  PercentText
} from "./styled";
import { ThemeButton } from "../../../src/components/common/ThemeButton";

function Ellipsify({ children: text, limit }) {
  //needed to handle multibyte chars(unicode,emojis)
  const chars = [...text];
  if (chars.length <= limit) {
    return text;
  } else {
    return `${chars.slice(0, limit - 3).join("")}...`;
  }
}

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

const StyledSlider = styled(Slider)`
  margin: 0px;
  min-height: 20px;
  .ant-slider-rail,
  .ant-slider-track,
  .ant-slider-step {
    height: 10px;
    border-radius: 32px;
  }
  .ant-slider-rail {
    background-color: #e5e5e5;
  }
  .ant-slider-track,
  &:hover .ant-slider-track {
    background-color: #4e95f3;
  }
  .ant-slider-handle {
    height: 16px;
    width: 16px;
    margin-top: -3px;
    margin-left: -7px;
    border-color: #4e95f3;
  }
`;

const StyledInputNumber = styled(InputNumber)`
  width: 60px;
  margin-right: 10px;
  margin-top: -5px;
`;

const StyledAddBandButton = styled(ThemeButton)`
  border-radius: 4px;
  color: ${white};
  height: 34px;
  width: 159px;
  text-align: center;
  line-height: 34px;
  font-size: 11px;
`;

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

  checkPrice = (rule, value, callback) => {
    const { dataSource, record } = this.props;
    if (!isNaN(value)) {
      const sameRow = dataSource.filter(item => item.key === record.key);
      const sameDownRow = dataSource.filter(item => item.key === record.key + 1);
      if (sameRow[0].from < parseInt(value)) callback(`To value should be less than ${sameRow[0].from}`);
      else if (sameDownRow[0].to + 1 > parseInt(value))
        callback(`To value shouldn't be less than ${sameDownRow[0].to}`);
      else if (parseInt(value) > 100 || parseInt(value) < 0) callback("Please input value between 0 and 100");
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
                          ref={node => (this.toValueInput = node)}
                          onPressEnter={this.saveToValue}
                          onBlur={this.saveToValue}
                          autoFocus
                        />
                      )}
                    </FormItem>
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

export class PerformanceBandTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: "Band Name",
        dataIndex: "name",
        width: "20%",
        editable: !this.props.readOnly,
        render: (text, record) => {
          return (
            <React.Fragment>
              <ColorPicker
                disabled={this.props.readOnly}
                value={record.color}
                onChange={c => this.changeColor(c, record.key)}
              />{" "}
              <span title={record.name}>
                <Ellipsify limit={20}>{record.name}</Ellipsify>
              </span>
              &nbsp;
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
              <Checkbox
                defaultChecked={record.aboveOrAtStandard}
                checked={record.aboveOrAtStandard}
                disabled={this.props.readOnly}
                onChange={e => this.changeAbove(e, record.key)}
              />
            </StyledDivCenter>
          );
        }
      },
      {
        title: "From",
        dataIndex: "from",
        width: "25%",
        render: (text, record) => {
          return (
            <StyledColFromTo>
              <Row type="flex" align="center" style={{ flex: "1 1 auto" }}>
                {this.props.readOnly ? (
                  <PercentText>{record.from}%</PercentText>
                ) : (
                  <StyledInputNumber
                    value={record.from}
                    onChange={v => {
                      const delta = v - record.from;
                      this.onClickFromTo(v, record.key, "from", delta);
                    }}
                  />
                )}
                <Col style={{ flex: "1 1 auto" }}>
                  <StyledSlider
                    disabled={this.props.readOnly}
                    onChange={v => {
                      const delta = v - record.from;
                      this.onClickFromTo(v, record.key, "from", delta);
                    }}
                    value={parseInt(record.from)}
                    max={100}
                    step={1}
                    min={0}
                  />
                </Col>
              </Row>
            </StyledColFromTo>
          );
        }
      },
      {
        title: "To",
        dataIndex: "to",
        width: "25%",
        editable: !this.props.readOnly,
        render: (text, record) => {
          return (
            <StyledColFromTo>
              <Row type="flex" align="center" style={{ flex: "1 1 auto" }}>
                {this.props.readOnly ? (
                  <PercentText>{record.to}%</PercentText>
                ) : (
                  <StyledInputNumber
                    value={record.to}
                    onChange={v => {
                      const delta = v - record.to;
                      this.onClickFromTo(v, record.key, "to", delta);
                    }}
                  />
                )}
                <Col style={{ flex: "1 1 auto" }}>
                  <StyledSlider
                    disabled={this.props.readOnly}
                    onChange={v => {
                      const delta = v - record.to;
                      this.onClickFromTo(v, record.key, "to", delta);
                    }}
                    value={parseInt(record.to)}
                    max={100}
                    step={1}
                    min={0}
                  />
                </Col>
              </Row>
            </StyledColFromTo>
          );
        }
      },
      {
        title: this.props.readOnly ? "" : <StyledAddBandButton onClick={this.handleAdd}>ADD BAND</StyledAddBandButton>,
        dataIndex: "operation",
        width: "15%",
        render: (text, record) =>
          this.state.dataSource.length >= 3 && !this.props.readOnly ? (
            <StyledDivCenter>
              <a href="javascript:;" onClick={e => this.handleDelete(e, record.key)}>
                <Icon type="delete" theme="filled" twoToneColor={themeColor} />
              </a>
            </StyledDivCenter>
          ) : null
      }
    ];

    this.state = {
      editingKey: -1,
      isChangeState: false
    };
  }

  componentDidMount() {
    const { loadPerformanceBand, userOrgId } = this.props;
    if (loadPerformanceBand) {
      loadPerformanceBand({ orgId: userOrgId });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return { dataSource: nextProps.dataSource, performanceBandId: nextProps.performanceBandId };
  }

  setChanged = v => this.setState({ isChangeState: v });

  onClickFromTo = (e, key, keyName, value) => {
    const dataSource = [...this.state.dataSource];
    if (key == 0 && keyName === "from") return;
    if (key == dataSource.length - 1 && keyName === "to") return;

    if (keyName === "from") {
      if (
        parseInt(dataSource[key].from) + value <= parseInt(dataSource[key].to) ||
        parseInt(dataSource[key].from) + value >= parseInt(dataSource[key - 1].from)
      ) {
        return;
      } else {
        dataSource[key].from = parseInt(dataSource[key].from) + value;
        dataSource[key - 1].to = parseInt(dataSource[key - 1].to) + value;
      }
    }

    if (keyName === "to") {
      if (
        parseInt(dataSource[key].to) + value >= parseInt(dataSource[key].from) ||
        parseInt(dataSource[key].to) + value <= parseInt(dataSource[key + 1].to)
      ) {
        console.warn("return early", { value, to: dataSource[key].to, from: dataSource[key].from, key });
        return;
      } else {
        dataSource[key].to = parseInt(dataSource[key].to) + value;
        dataSource[key + 1].from = parseInt(dataSource[key + 1].from) + value;
      }
    }

    this.setState({ isChangeState: true });
    this.props.setPerformanceBandData(dataSource);
  };

  changeAbove = (e, key) => {
    const dataSource = [...this.state.dataSource];
    dataSource.map(row => {
      if (row.key === key) row.aboveOrAtStandard = e.target.checked;
    });
    this.setState({ isChangeState: true });
    this.props.setPerformanceBandData(dataSource);
  };

  changeColor = (color, key) => {
    const index = this.state.dataSource.findIndex(x => x.key === key);
    const colorExists = this.state.dataSource
      .filter((x, ind) => ind != index)
      .map(x => x.color)
      .includes(color);

    if (colorExists) {
      message.error("Please select a different color. The selected color is already used for different Band");
      return;
    }
    const data = produce(this.state.dataSource, ds => {
      ds[index].color = color;
    });
    this.setState({ isChangeState: true, dataSource: data });
    this.props.setPerformanceBandData(data);
  };

  getUnusedColor = () => {
    const existingColors = this.state.dataSource.map(x => x.color);
    return colorsList.find(x => !existingColors.includes(x));
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

    this.setState({ isChangeState: true });
    this.props.setPerformanceBandData(dataSource.filter(item => item.key !== key));
  };

  handleAdd = () => {
    const { dataSource } = this.state;
    const keyArray = [];
    for (let i = 0; i < dataSource.length; i++) {
      keyArray.push(dataSource[i].key);
    }

    const newData = {
      key: Math.max(...keyArray) + 1,
      name: "Performance Band" + (Math.max(...keyArray) + 1),
      aboveOrAtStandard: true,
      color: this.getUnusedColor() || "#fff",
      from: 0,
      to: 0
    };

    dataSource[dataSource.length - 1].to = dataSource[dataSource.length - 1].from - 1;

    this.setState({
      editingKey: dataSource[dataSource.length - 1].key,
      isChangeState: true
    });
    this.props.setPerformanceBandData([...dataSource, newData]);
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
      editingKey: -1,
      isChangeState: true
    });

    this.props.setPerformanceBandData(newData);
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

    let performanceBandData = {
      orgId: this.props.userOrgId,
      orgType: "district",
      performanceBand: dataSource
    };

    if (this.state.performanceBandId.length === 0) {
      this.props.createPerformanceband(performanceBandData);
    } else {
      this.props.updatePerformanceBand(performanceBandData);
    }
    this.setState({ isChangeState: false });
  };

  isToValueEditing = record => record.key === this.state.editingKey;

  render() {
    const { dataSource, editingKey, isChangeState, performanceBandId } = this.state;

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
      dataSource.length == 0 ||
      (dataSource[dataSource.length - 1].to == 0 && dataSource[dataSource.length - 1].from == 0) ||
      editingKey != -1 ||
      dataSource.length >= 10
        ? true
        : false;

    return (
      <StyledTableContainer>
        <Table
          components={components}
          rowClassName={() => "editable-row"}
          dataSource={dataSource}
          pagination={false}
          columns={columns}
          bordered={false}
        />
        <StyledBottomDiv>
          {isChangeState && <SaveAlert>You have unsaved changes.</SaveAlert>}
          {performanceBandId.length == 0 ? (
            <StyledSaveButton disabled={this.props.readOnly} type="primary" onClick={this.updatePerformanceBand}>
              Create
            </StyledSaveButton>
          ) : (
            <StyledSaveButton
              disabled={this.props.readOnly}
              type="primary"
              onClick={this.updatePerformanceBand}
              disabled={!isChangeState}
            >
              Save
            </StyledSaveButton>
          )}
        </StyledBottomDiv>
      </StyledTableContainer>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      dataSource: getPerformanceBandList(state),
      performanceBandId: get(state, ["performanceBandReducer", "data", "_id"], ""),
      userOrgId: getUserOrgId(state)
    }),
    {
      loadPerformanceBand: receivePerformanceBandAction,
      createPerformanceband: createPerformanceBandAction,
      updatePerformanceBand: updatePerformanceBandAction,
      setPerformanceBandData: setPerformanceBandChangesAction
    }
  )
);
export default enhance(PerformanceBandTable);
