import React, { useMemo, useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { isEmpty } from "lodash";

// components
import { AutoComplete, Input, Icon } from "antd";

// ducks
import { getOrgDataSelector } from "../../../../../../src/selectors/user";
import { getSPRStudentDataRequestAction, getStudentsListSelector, getStudentsLoading } from "../../filterDataDucks";

const getFullName = s => `${s.firstName || ""} ${s.lastName || ""}`;

const DEFAULT_SEARCH_TERMS = { text: "", selectedText: "", selectedKey: "" };

const StudentAutoComplete = ({
  userOrgData,
  studentList,
  loading,
  loadStudentList,
  selectedStudent,
  selectedClasses,
  selectCB
}) => {
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS);

  // build search query
  const query = useMemo(() => {
    const { districtId, institutionIds } = userOrgData;
    const q = {
      limit: 20,
      page: 0,
      districtId,
      search: {
        role: ["student"]
      },
      type: "DISTRICT"
    };
    if (searchTerms.text) {
      q.search.searchString = searchTerms.text;
    }
    if (!isEmpty(selectedClasses)) {
      q.search.groupIds = selectedClasses;
    }
    if (!isEmpty(institutionIds)) {
      q.institutionIds = institutionIds;
    }
    return q;
  }, [searchTerms.text, selectedClasses]);

  // handle autocomplete actions
  const onSearch = value => {
    setSearchTerms({ ...searchTerms, text: value });
  };
  const onSelect = key => {
    const value = getFullName(studentList.find(s => s._id === key));
    console.log(key);
    setSearchTerms({ text: value, selectedText: value, selectedKey: key });
    selectCB({ key, title: value });
  };
  const onBlur = () => {
    setSearchTerms({ ...searchTerms, text: searchTerms.selectedText });
  };

  // effects
  useEffect(() => {
    if (!isEmpty(selectedStudent)) {
      const { key, title } = selectedStudent;
      setSearchTerms({ text: title, selectedText: title, selectedKey: key });
    }
  }, []);
  useEffect(() => {
    if (searchTerms.text && searchTerms.text !== searchTerms.selectedText) {
      loadStudentList(query);
    }
  }, [searchTerms]);
  useEffect(() => {
    if (!searchTerms.selectedText && studentList[0]) {
      onSelect(studentList[0]._id);
    }
  }, [studentList]);
  useEffect(() => {
    if (searchTerms.selectedText) {
      setSearchTerms({ ...DEFAULT_SEARCH_TERMS });
    }
    loadStudentList(query);
  }, [selectedClasses]);

  // build dropdown data
  const dropdownData = searchTerms.text
    ? [
        <AutoComplete.OptGroup key="studentList" label="Students [Type to search]">
          {studentList.map(item => (
            <AutoComplete.Option key={item._id} title={getFullName(item)}>
              {getFullName(item)}
            </AutoComplete.Option>
          ))}
        </AutoComplete.OptGroup>
      ]
    : [];

  return (
    <AutoCompleteContainer>
      <AutoComplete
        getPopupContainer={trigger => trigger.parentNode}
        value={searchTerms.text}
        onSearch={onSearch}
        dataSource={dropdownData}
        onSelect={onSelect}
        onBlur={onBlur}
      >
        <Input suffix={<Icon type={loading ? "loading" : "search"} />} />
      </AutoComplete>
    </AutoCompleteContainer>
  );
};

export default connect(
  state => ({
    userOrgData: getOrgDataSelector(state),
    studentList: getStudentsListSelector(state),
    loading: getStudentsLoading(state)
  }),
  {
    loadStudentList: getSPRStudentDataRequestAction
  }
)(StudentAutoComplete);

const AutoCompleteContainer = styled.div`
  .ant-select-auto-complete {
    padding: 5px;
  }
  .ant-select-dropdown-menu-item-group-title {
    font-weight: bold;
  }
`;
