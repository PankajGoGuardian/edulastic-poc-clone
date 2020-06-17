import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { get, isEmpty } from "lodash";

// components & constants
import { AutoComplete, Input, Icon } from "antd";
import { roleuser } from "@edulastic/constants";

// ducks
import { getUser } from "../../../../../../src/selectors/user";
import { receiveClassListAction, getClassListSelector } from "../../../../../../Classes/ducks";

const DEFAULT_SEARCH_TERMS = { text: "", selectedText: "", selectedKey: "" };

const ClassAutoComplete = ({ userDetails, classList, loading, loadClassList, selectedClass, selectCB }) => {
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS);

  // build search query
  const { email, institutionIds, role: userRole, orgData } = userDetails;
  const { districtId } = orgData;
  const query = {
    limit: 25,
    page: 1,
    districtId,
    search: {
      name: searchTerms.text,
      active: [1],
      type: ["class"]
    }
  };
  if (userRole === roleuser.TEACHER) {
    query.search.teachers = [{ type: "eq", value: email }];
  }
  if (userRole === roleuser.SCHOOL_ADMIN) {
    query.search.institutionIds = institutionIds;
  }

  // handle autocomplete actions
  const onSearch = value => {
    setSearchTerms({ ...searchTerms, text: value });
  };
  const onSelect = key => {
    const value = classList[key]._source.name;
    setSearchTerms({ text: value, selectedText: value, selectedKey: key });
    selectCB({ key, title: value });
  };
  const onBlur = () => {
    if (searchTerms.text === "" && searchTerms.selectedText !== "") {
      setSearchTerms(DEFAULT_SEARCH_TERMS);
      selectCB({ key: "", title: "" });
    } else {
      setSearchTerms({ ...searchTerms, text: searchTerms.selectedText });
    }
  };

  // effects
  useEffect(() => {
    if (!isEmpty(selectedClass)) {
      const { key, title } = selectedClass;
      setSearchTerms({ text: title, selectedText: title, selectedKey: key });
    }
  }, []);
  useEffect(() => {
    if (searchTerms.text && searchTerms.text !== searchTerms.selectedText) {
      loadClassList(query);
    }
  }, [searchTerms]);

  // build dropdown data
  const dropdownData = searchTerms.text
    ? [
        <AutoComplete.OptGroup key="classList" label="Classes [Type to search]">
          {Object.values(classList).map(item => (
            <AutoComplete.Option key={item._id} title={item._source.name}>
              {item._source.name}
            </AutoComplete.Option>
          ))}
        </AutoComplete.OptGroup>
      ]
    : [];

  return (
    <AutoCompleteContainer>
      <AutoComplete
        getPopupContainer={trigger => trigger.parentNode}
        placeholder="All Classes"
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
    userDetails: getUser(state),
    classList: getClassListSelector(state),
    loading: get(state, ["classesReducer", "loading"], false)
  }),
  {
    loadClassList: receiveClassListAction
  }
)(ClassAutoComplete);

const AutoCompleteContainer = styled.div`
  .ant-select-auto-complete {
    padding: 5px;
  }
  .ant-select-dropdown-menu-item-group-title {
    font-weight: bold;
  }
`;
