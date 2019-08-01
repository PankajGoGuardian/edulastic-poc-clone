import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { map, debounce } from "lodash";
import { AutoComplete, Input, Icon } from "antd";
import {
  receiveStudentsListAction,
  getStudentsListSelector,
  getStudentsLoading
} from "../../../../../../Student/ducks.js";
import { getOrgDataSelector } from "../../../../../../src/selectors/user";

const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;

const delay = 250;

const StudentAutoComplete = ({
  orgData,
  studentList,
  selectCB,
  loading,
  selectedStudent,
  receiveStudentsListAction
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValue, setSelectedValue] = useState("");

  const studentOptions = map(studentList, student => ({
    key: student._id,
    title: `${student.firstName || ""} ${student.lastName || ""}`
  }));

  const searchUser = (searchTerm, orgData) => {
    const { districtId, institutionIds } = orgData;

    const q = {
      page: 0,
      limit: 20,
      search: {
        username: { type: "cont", value: searchTerm }
      },
      districtId,
      role: "student"
    };

    receiveStudentsListAction(q);
  };

  const debouncedSearchUser = useCallback(debounce(searchUser, delay), []);

  useEffect(() => {
    if (selectedStudent.title !== searchTerm) {
      setSelectedValue(selectedStudent.title);
    }
  }, [selectedStudent]);

  useEffect(() => {
    setSelectedValue(searchTerm);

    if (searchTerm) {
      debouncedSearchUser(searchTerm, orgData);
    }
  }, [searchTerm]);

  const buildDropDownData = datum => {
    let arr = [
      <OptGroup key={"group"} label={"Students"}>
        {datum.map((item, index) => {
          return (
            <Option key={item.key} title={item.title}>
              {item.title}
            </Option>
          );
        })}
      </OptGroup>
    ];
    return arr;
  };

  const onSelect = (key, item) => {
    setSelectedValue(item.props.title);
    selectCB({ key: key, title: item.props.title });
  };

  let options = buildDropDownData(studentOptions);
  options = options.length ? options : [selectedStudent];

  return (
    <AutoComplete value={selectedValue} onSearch={setSearchTerm} dataSource={options} onSelect={onSelect}>
      <Input suffix={<Icon type={loading ? "loading" : "search"} />} />
    </AutoComplete>
  );
};

const enchance = connect(
  state => ({
    studentList: getStudentsListSelector(state),
    orgData: getOrgDataSelector(state),
    loading: getStudentsLoading(state)
  }),
  {
    receiveStudentsListAction
  }
);

export default enchance(StudentAutoComplete);
