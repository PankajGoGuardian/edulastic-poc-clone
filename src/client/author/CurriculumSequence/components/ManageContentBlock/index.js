import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Dropdown, Menu } from "antd";
import { FlexContainer } from "@edulastic/common";
import { IconFilter } from "@edulastic/icons";
import { white, themeColor } from "@edulastic/colors";
import ResourceItem from "../ResourceItem";
import slice from "./ducks";
import {
  ManageContentContainer,
  SearchByNavigationBar,
  SearchByTab,
  SearchBar,
  FilterBtn,
  ActionsContainer,
  ManageModuleBtn,
  ResourceDataList
} from "./styled";
import PlaylistTestBoxFilter from "../PlaylistTestBoxFilter";

// Static resources data
const resourceData = [
  {
    type: "video",
    title: "Recognize Transformations with Parall"
  },
  {
    type: "tests",
    title: "Identifying Exponential …"
  },
  {
    type: "lessons",
    title: "Triangles and Angle Properties"
  },
  {
    type: "video",
    title: "Operations with Scientific Notation"
  },
  {
    type: "tests",
    title: "Triangles and Angle Properties"
  },
  {
    type: "lessons",
    title: "QUIZ - Identifying Exponential Expressions"
  }
];

const resourceTabs = ["all", "tests", "video", "lessons"];

const sourceList = ["everything", "learnzillion", "khan academy", "ck12", "grade"];

const ManageContentBlock = props => {
  const {
    filter,
    status,
    authoredBy,
    grades,
    subject,
    collection,
    sources,
    setDefaults,
    fetchTests,
    tests,
    setFilterAction,
    setStatusAction,
    setAuthoredAction,
    setGradesAction,
    setSubjectAction,
    setCollectionAction,
    setSourcesAction,
    resetLoadedPage,
    resetAndFetchTests
  } = props;

  const [searchBy, setSearchBy] = useState("keywords");
  const [searchResourceBy, setSearchResourceBy] = useState("all");
  const [isShowFilter, setShowFilter] = useState(false);

  useEffect(() => {
    setDefaults({ subject, grades });
    fetchTests();
  }, []);

  const onChange = () => {};

  const toggleTestFilter = () => {
    if (isShowFilter) {
      resetLoadedPage();
      resetAndFetchTests();
    }
    setShowFilter(x => !x);
  };

  const menu = (
    <Menu onClick={onchange}>
      <Menu.Item key="1">Website URL</Menu.Item>
      <Menu.Item key="2">Youtube</Menu.Item>
      <Menu.Item key="3">External LTI Resource</Menu.Item>
    </Menu>
  );

  const filteredData =
    searchResourceBy === "all" ? resourceData : resourceData.filter(x => x?.type === searchResourceBy) || [];

  const onFilterChange = prop => setFilterAction(prop);
  const onStatusChange = prop => setStatusAction(prop);
  const onAuthoredChange = prop => setAuthoredAction(prop);
  const onSubjectChange = prop => setSubjectAction(prop);
  const onGradesChange = prop => setGradesAction(prop);
  const onCollectionChange = prop => setCollectionAction(prop);
  const onSourceChange = ({ checked, value }) =>
    setSourcesAction(checked ? sources?.concat(value) : sources?.filter(x => x !== value) || []);

  return (
    <ManageContentContainer>
      <SearchByNavigationBar>
        <SearchByTab onClick={() => setSearchBy("keywords")} isTabActive={searchBy === "keywords"}>
          keywords
        </SearchByTab>
        <SearchByTab onClick={() => setSearchBy("standards")} isTabActive={searchBy === "standards"}>
          standards
        </SearchByTab>
      </SearchByNavigationBar>
      <FlexContainer>
        <SearchBar placeholder={`Search by ${searchBy}`} onChange={onchange} />
        <FilterBtn onClick={toggleTestFilter} isActive={isShowFilter}>
          <IconFilter color={isShowFilter ? white : themeColor} width={20} height={20} />
        </FilterBtn>
      </FlexContainer>
      <br />
      {isShowFilter ? (
        <PlaylistTestBoxFilter
          authoredList={[]} /// Send authors data
          collectionsList={[]} /// send collections data
          sourceList={sourceList}
          filter={filter}
          status={status}
          authoredBy={authoredBy}
          grades={grades}
          subject={subject}
          collection={collection}
          sources={sources}
          onFilterChange={onFilterChange}
          onStatusChange={onStatusChange}
          onAuthoredChange={onAuthoredChange}
          onGradesChange={onGradesChange}
          onSubjectChange={onSubjectChange}
          onCollectionChange={onCollectionChange}
          onSourceChange={onSourceChange}
        />
      ) : (
        <>
          {false && (
            <SearchByNavigationBar justify="space-evenly">
              {resourceTabs.map(tab => (
                <SearchByTab onClick={() => setSearchResourceBy(tab)} isTabActive={searchResourceBy === tab}>
                  {tab}
                </SearchByTab>
              ))}
            </SearchByNavigationBar>
          )}
          <br />
          <ResourceDataList>
            {tests.map(test => (
              <ResourceItem type="tests" title={test.title} key={test._id} />
            ))}
          </ResourceDataList>
        </>
      )}

      <ActionsContainer>
        <Dropdown overlay={menu} placement="topCenter">
          <ManageModuleBtn width="190px">
            Add Resource
            <i class="fa fa-chevron-down" aria-hidden="true" />
          </ManageModuleBtn>
        </Dropdown>

        <ManageModuleBtn>manage modules</ManageModuleBtn>
      </ActionsContainer>
    </ManageContentContainer>
  );
};

export default connect(
  state => ({
    filter: state.playlistTestBox?.filter,
    status: state.playlistTestBox?.status,
    authoredBy: state.playlistTestBox?.authoredBy,
    subject: state.playlistTestBox?.subject,
    grades: state.playlistTestBox?.grades,
    tests: state.playlistTestBox?.tests || [],
    collection: state.playlistTestBox?.collection,
    sources: state.playlistTestBox?.sources
  }),
  {
    setFilterAction: slice.actions?.setFilterAction,
    setDefaults: slice.actions?.setDefaults,
    fetchTests: slice.actions?.fetchTests,
    setStatusAction: slice.actions?.setStatusAction,
    setAuthoredAction: slice.actions?.setAuthoredAction,
    setSubjectAction: slice.actions?.setSubjectAction,
    setGradesAction: slice.actions?.setGradesAction,
    setCollectionAction: slice.actions?.setCollectionAction,
    setSourcesAction: slice.actions?.setSourcesAction,
    resetLoadedPage: slice.actions?.resetLoadedPage,
    resetAndFetchTests: slice.actions?.resetAndFetchTests
  }
)(ManageContentBlock);
