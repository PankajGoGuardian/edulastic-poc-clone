import React, { useState, useEffect } from "react";
import { Table, Button, InputNumber, Form } from "antd";
import { connect } from "react-redux";
import { get } from "lodash";
import { getUserOrgId } from "../../../../../src/selectors/user";
import { receiveStandardsProficiencyAction } from "../../../../../StandardsProficiency/ducks";

const dataSource = [
  {
    _id: "5cf8eda6231158a3148f387d",
    score: 4,
    masteryLevel: "Exceeds Mastery1",
    shortName: "E",
    threshold: 90,
    color: "#C8EB9B"
  },
  {
    _id: "5cf8eda623115815a98f387c",
    score: 3,
    masteryLevel: "Mastered",
    shortName: "M",
    threshold: 80,
    color: "#F3FCCF"
  },
  {
    _id: "5cf8eda623115827538f387b",
    score: 2,
    masteryLevel: "Almost Mastered",
    shortName: "A",
    threshold: 70,
    color: "#FDFDC8"
  },
  {
    _id: "5cf8eda623115806668f387a",
    score: 1,
    masteryLevel: "Proficiency 1",
    shortName: "P1",
    threshold: 0,
    color: "#D4E9FA"
  }
];

const EditableContext = React.createContext();

const EditableCell = ({ editing, dataIndex, title, record, index, children, dataSource, ...restProps }) => {
  const checkPerThre = (rule, value = "", callback) => {
    var isnum = /^\d+$/.test(value);
    if (value.length && !isnum) {
      return callback("Please input valid number.");
    }

    value = parseInt(value);

    if (value > 100) {
      return callback("Should not exceed 100.");
    }
    const currentIndex = dataSource.length - record.score;
    //last standard should always be zero
    if (currentIndex === dataSource.length - 1 && value > 0) {
      return callback("value should not be greater than zero");
    }

    //All standards threshold should be greater than the previous standard threshold. Not checking this case for last threshold as it can go upto 100 and greater than hundred is already handled
    if (currentIndex < dataSource.length - 1 && value < dataSource[currentIndex + 1].threshold) {
      return callback(`value should not be less than ${dataSource[currentIndex + 1].masteryLevel}`);
    }

    if (currentIndex > 0 && value > dataSource[currentIndex - 1].threshold) {
      return callback(`value should not be greater than ${dataSource[currentIndex - 1].masteryLevel}`);
    }
    console.log(dataSource[currentIndex], "===");
    return callback();
  };

  const renderCell = ({ getFieldDecorator }) => {
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input valid threshold!`
                },
                {
                  validator: checkPerThre
                }
              ],
              initialValue: record[dataIndex]
            })(<InputNumber max={100} min={0} />)}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  return <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>;
};

const StandardProficiencyTable = ({ form, loadStandardsProficiency, standardsData }) => {
  const [standardsProficiency, setStandardsProficiency] = useState([]);
  const [editingKey, setEditingKey] = useState("");

  useEffect(() => {
    // loadStandardsProficiency();
    setStandardsProficiency(dataSource.map(item => ({ ...item, key: item._id })));
  }, []);

  const isEditing = record => record._id === editingKey;

  const save = (form, key) => {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...standardsProficiency];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
      } else {
        newData.push(row);
      }
      setStandardsProficiency(newData);
      setEditingKey("");
    });
  };

  const tableColumns = [
    {
      title: "Score",
      dataIndex: "score",
      key: "score"
    },
    {
      title: "Mastery Level",
      dataIndex: "masteryLevel",
      key: "masteryLevel"
    },
    {
      title: "Short Name",
      dataIndex: "shortName",
      key: "shortName"
    },
    {
      title: "Performance Threshold",
      dataIndex: "threshold",
      key: "threshold",
      editable: true
    },
    {
      title: "",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <EditableContext.Consumer>
              {form => (
                <a href="javascript:;" onClick={() => save(form, record.key)} style={{ marginRight: 8 }}>
                  Save
                </a>
              )}
            </EditableContext.Consumer>
            <Button onClick={() => setEditingKey("")}>
              <a>Cancel</a>
            </Button>
          </span>
        ) : (
          <a
            disabled={editingKey !== ""}
            onClick={() => {
              console.log(record);
              setEditingKey(record.key);
            }}
          >
            Edit
          </a>
        );
      }
    }
  ];

  const components = {
    body: {
      cell: EditableCell
    }
  };

  const columns = tableColumns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        inputType: col.dataIndex,
        context: EditableContext,
        dataSource: standardsProficiency,
        key: record._id
      })
    };
  });
  console.log(editingKey, "=editingKey");
  return (
    <EditableContext.Provider value={form}>
      <Table components={components} dataSource={standardsProficiency} columns={columns} pagination={false} />
    </EditableContext.Provider>
  );
};

const EditableStandardProficiencyTable = Form.create()(StandardProficiencyTable);

export default connect(
  state => ({
    standardsData: get(state, ["standardsProficiencyReducer", "data", "scale"], []),
    userOrgId: getUserOrgId(state)
  }),
  {
    loadStandardsProficiency: receiveStandardsProficiencyAction
  }
)(EditableStandardProficiencyTable);
