import { AutoComplete, Icon, Input } from "antd";
import { debounce, map } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getOrgDataSelector } from "../../../../../../src/selectors/user";
import { getSPRStudentDataRequestAction, getStudentsListSelector, getStudentsLoading } from "../../filterDataDucks";

const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;

const delay = 250;

const StudentAutoComplete = ({
  userOrgData,
  studentList,
  selectCB,
  loading,
  selectedStudent,
  selectedClasses,
  getSPRStudentData
}) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [text, setText] = useState("");
  const [prevStudentList, setPrevStudentList] = useState([]);

  const studentOptions = useMemo(
    () =>
      map(studentList, student => ({
        key: student._id,
        title: `${student.firstName || ""} ${student.lastName || ""}`
      })),
    [studentList]
  );

  const searchUser = (searchTerm, groupIds, orgData) => {
    const { districtId, institutionIds } = orgData;
    const q = {
      page: 0,
      limit: 20,
      search: {
        role: ["student"],
        groupIds
      },
      type: "DISTRICT",
      districtId,
      institutionIds
    };
    if (searchTerm) {
      q.search.searchString = searchTerm;
    }
    getSPRStudentData(q);
  };

  const debouncedSearchUser = useCallback(debounce(searchUser, delay), []);

  useEffect(() => {
    searchUser("", selectedClasses, userOrgData);
    setPrevStudentList(studentList);
  }, [selectedClasses]);

  if (studentList !== prevStudentList) {
    setPrevStudentList(studentList);
    const title = studentOptions[0]?.title || "";
    const key = studentOptions[0]?.key || "";
    setSelectedValue(title);
    setText(title);
    selectCB({ key , title });
  }

  useEffect(() => {
    if (selectedStudent.title !== "") {
      setSelectedValue(selectedStudent.title);
      setText(selectedStudent.title);
    }
  }, [selectedStudent]);

  const buildDropDownData = datum => {
    const arr = [
      <OptGroup key="group" label="Students [Type to find]">
        {datum.map(item => (
          <Option key={item.key} title={item.title}>
            {item.title}
          </Option>
        ))}
      </OptGroup>
    ];
    return arr;
  };

  const onSearchTermChange = value => {
    debouncedSearchUser(value, selectedClasses, userOrgData);
    setText(value);
  };

  const onBlur = () => {
    setText(selectedValue);
  };

  const onSelect = (key, item) => {
    setSelectedValue(item.props.title);
    setText(item.props.title);
    selectCB({ key, title: item.props.title });
  };

  let options = buildDropDownData(studentOptions);
  options = options.length ? options : [selectedStudent];

  return (
    <AutoCompleteContainer>
      <AutoComplete
        getPopupContainer={trigger => trigger.parentNode}
        value={text}
        onSearch={onSearchTermChange}
        dataSource={options}
        onSelect={onSelect}
        onBlur={onBlur}
      >
        <Input suffix={<Icon type={loading ? "loading" : "search"} />} />
      </AutoComplete>
    </AutoCompleteContainer>
  );
};

const enchance = connect(
  state => ({
    studentList: getStudentsListSelector(state),
    userOrgData: getOrgDataSelector(state),
    loading: getStudentsLoading(state)
  }),
  {
    getSPRStudentData: getSPRStudentDataRequestAction
  }
);

export default enchance(StudentAutoComplete);

const AutoCompleteContainer = styled.div`
  .ant-select-auto-complete {
    padding: 5px;
  }
  .ant-select-dropdown-menu-item-group-title {
    font-weight: bold;
  }
`;
