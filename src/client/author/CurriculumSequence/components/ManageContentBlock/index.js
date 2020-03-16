import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Dropdown, Menu, Spin } from "antd";
import { FlexContainer } from "@edulastic/common";
import { IconFilter } from "@edulastic/icons";
import { white, themeColor } from "@edulastic/colors";
import ResourceItem from "../ResourceItem";
import { toggleManageModulesVisibilityCSAction } from "../../ducks";
import slice from "./ducks";
import {
  ManageContentOuterWrapper,
  ManageContentContainer,
  SearchByNavigationBar,
  SearchByTab,
  SearchBar,
  FilterBtn,
  ActionsContainer,
  ManageModuleBtn,
  ResourceDataList,
  LoaderWrapper
} from "./styled";
import PlaylistTestBoxFilter from "../PlaylistTestBoxFilter";
import ManageModulesModal from "../ManageModulesModal";

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

const observeElement = (fetchTests, tests) => {
  const observer = useRef();
  return useCallback(
    node => {
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          fetchTests();
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [tests]
  );
};

const ManageContentBlock = props => {
  const {
    isLoading,
    loadedPage,
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
    resetAndFetchTests,
    searchString,
    setTestSearchAction,
    isManageModulesVisible,
    toggleManageModulesVisibility,
    testsInPlaylist = []
  } = props;

  const lastResourceItemRef = observeElement(fetchTests, tests);

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
      resetAndFetchTests();
    }
    setShowFilter(x => !x);
  };

  const onSearchChange = e => setTestSearchAction(e.target.value);
  const openManageModules = () => toggleManageModulesVisibility(true);
  const closeManageModules = () => toggleManageModulesVisibility(false);

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
  let fetchCall;

  if (tests.length > 10) {
    fetchCall = tests.length - 7;
  }

  return (
    <ManageContentOuterWrapper>
      <ActionsContainer>
        <Dropdown overlay={menu} placement="topCenter">
          <ManageModuleBtn justify="space-between">
            Add Resource
            <i class="fa fa-chevron-down" aria-hidden="true" />
          </ManageModuleBtn>
        </Dropdown>

        <ManageModuleBtn justify="center" onClick={openManageModules}>
          manage modules
        </ManageModuleBtn>
      </ActionsContainer>

      <ManageContentContainer data-cy="play-list-search-container">
        {/* <SearchByNavigationBar>
        <SearchByTab onClick={() => setSearchBy("keywords")} isTabActive={searchBy === "keywords"}>
          keywords
        </SearchByTab>
        <SearchByTab onClick={() => setSearchBy("standards")} isTabActive={searchBy === "standards"}>
          standards
        </SearchByTab>
      </SearchByNavigationBar> */}
        <FlexContainer>
          <SearchBar
            type="search"
            placeholder={`Search by ${searchBy}`}
            onChange={onSearchChange}
            value={searchString}
          />
          <FilterBtn data-cy="test-filter" onClick={toggleTestFilter} isActive={isShowFilter}>
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
            {/* <SearchByNavigationBar justify="space-evenly">
                {resourceTabs.map(tab => (
                  <SearchByTab onClick={() => setSearchResourceBy(tab)} isTabActive={searchResourceBy === tab}>
                    {tab}
                  </SearchByTab>
                ))}
              </SearchByNavigationBar>

              <br /> */}
            <ResourceDataList>
              {isLoading && loadedPage === 0 ? (
                <Spin />
              ) : tests.length ? (
                tests.map((test, idx) => {
                  if (idx === fetchCall) {
                    return <div style={{ height: "1px" }} ref={lastResourceItemRef} />;
                  }
                  return (
                    <ResourceItem
                      type="tests"
                      id={test?._id}
                      title={test?.title}
                      key={test?._id}
                      summary={test?.summary}
                      isAdded={testsInPlaylist.includes(test?._id)}
                    />
                  );
                })
              ) : (
                <h3 style={{ textAlign: "center" }}>No Data</h3>
              ) // TODO: update this component!
              }
              {isLoading && loadedPage !== 0 && (
                <LoaderWrapper>
                  <Spin />
                </LoaderWrapper>
              )}
            </ResourceDataList>
          </>
        )}

        {isManageModulesVisible && <ManageModulesModal visible={isManageModulesVisible} onClose={closeManageModules} />}
      </ManageContentContainer>
    </ManageContentOuterWrapper>
  );
};

export default connect(
  state => ({
    isManageModulesVisible: state.curriculumSequence?.isManageModulesVisible,
    isLoading: state.playlistTestBox?.isLoading,
    loadedPage: state.playlistTestBox?.loadedPage,
    filter: state.playlistTestBox?.filter,
    status: state.playlistTestBox?.status,
    authoredBy: state.playlistTestBox?.authoredBy,
    subject: state.playlistTestBox?.subject,
    grades: state.playlistTestBox?.grades,
    tests: state.playlistTestBox?.tests || [],
    collection: state.playlistTestBox?.collection,
    sources: state.playlistTestBox?.sources,
    searchString: state.playlistTestBox?.searchString
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
    resetAndFetchTests: slice.actions?.resetAndFetchTests,
    setTestSearchAction: slice.actions?.setTestSearchAction,
    toggleManageModulesVisibility: toggleManageModulesVisibilityCSAction
  }
)(ManageContentBlock);
