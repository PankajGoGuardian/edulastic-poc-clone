import React, { useState, useEffect, useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { map, debounce, isEmpty } from "lodash";
import { AutoComplete, Input, Icon } from "antd";
import { getSPRStudentDataRequestAction, getStudentsListSelector, getStudentsLoading } from "../../filterDataDucks";
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
  getSPRStudentDataRequestAction
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [text, setText] = useState("");
  const [prevStudentList, setPrevStudentList] = useState([]);

  const studentOptions = useMemo(() => {
    return map(studentList, student => ({
      key: student._id,
      title: `${student.firstName || ""} ${student.lastName || ""}`
    }));
  }, [studentList]);

  const searchUser = (searchTerm, orgData) => {
    if (!searchTerm) {
      return;
    }

    const { districtId, institutionIds } = orgData;

    const q = {
      page: 0,
      limit: 20,
      search: {
        searchString: searchTerm,
        role: "student"
      },
      type: "DISTRICT",
      districtId,
      institutionIds
    };

    getSPRStudentDataRequestAction(q);
  };

  const debouncedSearchUser = useCallback(debounce(searchUser, delay), []);

  if (studentList !== prevStudentList && !isEmpty(studentList) && isEmpty(prevStudentList)) {
    // first Render
    setPrevStudentList(studentList);
    if (!selectedStudent.key) {
      // select a default student if no student is present in url
      setSelectedValue(studentOptions[0].title);
      setText(studentOptions[0].title);
      selectCB({ key: studentOptions[0].key, title: studentOptions[0].title });
    }
  }

  useEffect(() => {
    if (selectedStudent.title !== searchTerm) {
      setSelectedValue(selectedStudent.title);
      setText(selectedStudent.title);
    }
  }, [selectedStudent]);

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

  const onSearchTermChange = value => {
    debouncedSearchUser(value, orgData);
    setText(value);
  };

  const onBlur = key => {
    setText(selectedValue);
  };

  const onSelect = (key, item) => {
    setSelectedValue(item.props.title);
    setText(item.props.title);
    selectCB({ key: key, title: item.props.title });
  };

  let options = buildDropDownData(studentOptions);
  options = options.length ? options : [selectedStudent];

  return (
    <AutoComplete value={text} onSearch={onSearchTermChange} dataSource={options} onSelect={onSelect} onBlur={onBlur}>
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
    getSPRStudentDataRequestAction
  }
);

export default enchance(StudentAutoComplete);
