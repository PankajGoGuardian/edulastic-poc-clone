import { curriculumSequencesApi } from "@edulastic/api";
import { themeColor, white } from "@edulastic/colors";
import { FlexContainer } from "@edulastic/common";
import { test as testsConstants } from "@edulastic/constants";
import { IconClose, IconFilter } from "@edulastic/icons";
import { Dropdown, Empty, Menu, message, Spin } from "antd";
import { pick, uniq } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import AssessmentPlayer from "../../../../assessment";
import { getCurrentDistrictUsersAction, getCurrentDistrictUsersSelector } from "../../../../student/Login/ducks";
import { toggleManageModulesVisibilityCSAction } from "../../ducks";
import { submitLTIForm } from "../CurriculumModuleRow";
import ManageModulesModal from "../ManageModulesModal";
import PlaylistTestBoxFilter from "../PlaylistTestBoxFilter";
import ResourceItem from "../ResourceItem";
import WebsiteResourceModal from "./components/WebsiteResourceModal";
import ExternalVideoLink from "./components/ExternalVideoLink";
import ExternalLTIModalForm from "./components/ExternalLTIModalContent";
import slice from "./ducks";
import {
  ActionsContainer,
  FilterBtn,
  LoaderWrapper,
  ManageContentContainer,
  ManageContentOuterWrapper,
  ManageModuleBtn,
  ModalWrapper,
  ResourceDataList,
  SearchBar,
  ToggleManageContent,
  SearchByNavigationBar,
  SearchByTab
} from "./styled";

const resourceTabs = ["tests", "resources"];

const sourceList = ["everything", "learnzillion", "khan academy", "ck12", "grade"];

const observeElement = (fetchTests, tests) => {
  return useCallback(
    node => {
      if (observer) {
        observer.disconnect();
      }
      const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          fetchTests();
        }
      });
      if (node) {
        observer.observe(node);
      }
    },
    [tests]
  );
};

const ManageContentBlock = props => {
  const {
    isDifferentiationTab = false,
    onShowManageContent,
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
    tests = [],
    externalLTIModal,
    externalLTIResources,
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
    testsInPlaylist = [],
    changeExternalLTIModal,
    addExternalLTIResouce,
    selectedTestForPreview = "",
    testPreviewModalVisible = false,
    showPreviewModal,
    closePreviewModal,
    subjectsFromCurriculumSequence,
    gradesFromCurriculumSequence,
    collectionFromCurriculumSequence = "",
    collections = [],
    currentDistrictUsers,
    districtId,
    getCurrentDistrictUsers,
    userFeatures,
    fetchExternalToolProvidersAction,
    externalToolsProviders,
    toggleManageContent,
    searchResourceBy,
    setSearchByTab,
    addResource,
    resources = []
  } = props;

  const lastResourceItemRef = observeElement(fetchTests, tests);

  const [searchBy, setSearchBy] = useState("keywords");
  const [isAddNew, setAddNew] = useState(false);
  const [isShowFilter, setShowFilter] = useState(false);
  const [isWebsiteUrlResourceModal, setWebsiteUrlResourceModal] = useState(false);
  const [isExternalVideoResourceModal, setExternalVideoResourceModal] = useState(false);
  const [isShowExternalLTITool, setShowExternalLTITool] = useState(false);

  useEffect(() => {
    setDefaults({
      subject: subjectsFromCurriculumSequence,
      grades: gradesFromCurriculumSequence,
      collection: collectionFromCurriculumSequence
    });
    !isLoading && fetchTests();
    fetchExternalToolProvidersAction({ districtId });
    // remove this condition once BE is fixed
    if (userFeatures.isCurator && !currentDistrictUsers) getCurrentDistrictUsers(districtId);
  }, []);

  const onChange = ({ key }) => {
    switch (key) {
      case "1":
        setWebsiteUrlResourceModal(true);
        break;
      case "2":
        setExternalVideoResourceModal(true);
        break;
      case "3":
        setShowExternalLTITool(true);
        break;
      default:
        break;
    }
  };

  const onModalClose = () => {
    setShowExternalLTITool(false);
    setAddNew(false);
  };

  const toggleTestFilter = () => {
    if (isShowFilter) {
      resetAndFetchTests();
    }
    setShowFilter(x => !x);
  };

  const onSearchChange = e => setTestSearchAction(e.target.value);
  const openManageModules = () => toggleManageModulesVisibility(true);
  const closeManageModules = () => toggleManageModulesVisibility(false);

  const addLTIResource = () => {
    addExternalLTIResouce();
    setShowExternalLTITool(false);
  };

  const menu = (
    <Menu onClick={onChange}>
      <Menu.Item key="1">Website URL</Menu.Item>
      <Menu.Item key="2">Youtube</Menu.Item>
      <Menu.Item key="3">External LTI Resource</Menu.Item>
    </Menu>
  );

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

  const showResource = async resource => {
    resource = resource && pick(resource, ["toolProvider", "url", "customParams", "consumerKey", "sharedSecret"]);
    try {
      const signedRequest = await curriculumSequencesApi.getSignedRequest({ resource });
      submitLTIForm(signedRequest);
    } catch (e) {
      message.error("Failed to load the resource");
    }
  };

  const renderList = () => {
    const listToRender = [];
    if (searchResourceBy === "resources") {
      // map resources to an element
      if (externalLTIResources.length) {
        externalLTIResources.forEach((resource, idx) => {
          listToRender.push(
            <ResourceItem
              type="lti_resource"
              id={resource.resourceId}
              title={resource.contentTitle}
              key={idx}
              data={resource?.data}
              previewTest={() => showResource(resource?.data)}
            />
          );
        });
      }

      resources.forEach((resource, idx) => {
        listToRender.push(
          <ResourceItem
            type={resource.contentType}
            id={resource.resourceId}
            title={resource.contentTitle}
            key={`resource-${idx}`}
            data={resource?.data}
            previewTest={() => showResource(resource?.data)}
          />
        );
      });
    }
    if (searchResourceBy === "tests") {
      // map tests to an element.
      if (tests.length) {
        tests.forEach((test, idx) => {
          if (idx === fetchCall) {
            listToRender.push(<div style={{ height: "1px" }} ref={lastResourceItemRef} />);
          }
          listToRender.push(
            <ResourceItem
              type="test"
              id={test._id}
              title={test.title}
              key={test._id}
              summary={test?.summary}
              isAdded={testsInPlaylist.includes(test?._id)}
              previewTest={() => showPreviewModal(test._id)}
              status={test?.status}
              testType={test?.testType}
            />
          );
        });
      }
    }
    if (listToRender.length) return listToRender;

    return <Empty style={{ margin: "auto" }} image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  };

  return (
    <ManageContentOuterWrapper>
      <ToggleManageContent onClick={toggleManageContent}>
        <IconClose />
      </ToggleManageContent>
      <div className="inner-wrapper">
        <ActionsContainer>
          {isDifferentiationTab ? (
            <>
              <ManageModuleBtn active justify="center" onClick={onShowManageContent}>
                manage content
              </ManageModuleBtn>
              <Dropdown overlay={menu} placement="topCenter">
                <ManageModuleBtn justify="space-between">
                  add resource
                  <i class="fa fa-chevron-down" aria-hidden="true" />
                </ManageModuleBtn>
              </Dropdown>
            </>
          ) : (
            <>
              <Dropdown data-cy="add-resource" overlay={menu} placement="topCenter">
                <ManageModuleBtn justify="space-between">
                  add resource
                  <i class="fa fa-chevron-down" aria-hidden="true" />
                </ManageModuleBtn>
              </Dropdown>

              <ManageModuleBtn data-cy="ManageModules" justify="center" onClick={openManageModules}>
                manage modules
              </ManageModuleBtn>
            </>
          )}
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
              collectionsList={uniq(
                [
                  ...testsConstants.collectionDefaultFilter?.filter(c => c?.value),
                  ...collections.map(o => ({ value: o?._id, text: o?.name }))
                ],
                "value"
              )}
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
              <SearchByNavigationBar justify="flex-start">
                {resourceTabs.map(tab => (
                  <SearchByTab onClick={() => setSearchByTab(tab)} isTabActive={tab.includes(searchResourceBy)}>
                    {tab}
                  </SearchByTab>
                ))}
              </SearchByNavigationBar>

              <br />
              <ResourceDataList>
                {isLoading && loadedPage === 0 ? <Spin /> : renderList()}
                {isLoading && loadedPage !== 0 && (
                  <LoaderWrapper>
                    <Spin />
                  </LoaderWrapper>
                )}
              </ResourceDataList>
            </>
          )}

          {isManageModulesVisible && (
            <ManageModulesModal visible={isManageModulesVisible} onClose={closeManageModules} />
          )}
        </ManageContentContainer>
        <ModalWrapper
          footer={null}
          visible={testPreviewModalVisible}
          onCancel={closePreviewModal}
          width="100%"
          height="100%"
          destroyOnClose
        >
          <AssessmentPlayer testId={selectedTestForPreview} preview closeTestPreviewModal={closePreviewModal} />
        </ModalWrapper>
      </div>

      {isWebsiteUrlResourceModal && (
        <WebsiteResourceModal
          closeCallback={() => setWebsiteUrlResourceModal(false)}
          isVisible={isWebsiteUrlResourceModal}
          addResource={addResource}
        />
      )}

      {isExternalVideoResourceModal && (
        <ExternalVideoLink
          closeCallback={() => setExternalVideoResourceModal(false)}
          isVisible={isExternalVideoResourceModal}
          addResource={addResource}
        />
      )}

      {isShowExternalLTITool && (
        <ExternalLTIModalForm
          onModalClose={onModalClose}
          isShowExternalLTITool={isShowExternalLTITool}
          externalToolsProviders={externalToolsProviders}
          onChange={(key, value) => changeExternalLTIModal({ key, value })}
          isAddNew={isAddNew}
          setAddNew={setAddNew}
          addLTIResource={addLTIResource}
        />
      )}
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
    tests: state.playlistTestBox?.tests,
    collection: state.playlistTestBox?.collection,
    sources: state.playlistTestBox?.sources,
    searchString: state.playlistTestBox?.searchString,
    externalLTIModal: state.playlistTestBox?.externalLTIModal,
    externalLTIResources: state.playlistTestBox?.externalLTIResources,
    testPreviewModalVisible: state.playlistTestBox?.testPreviewModalVisible,
    selectedTestForPreview: state.playlistTestBox?.selectedTestForPreview,
    externalToolsProviders: state.playlistTestBox?.externalToolsProviders,
    collections: state.user?.user?.orgData?.itemBanks,
    currentDistrictUsers: getCurrentDistrictUsersSelector(state),
    districtId: state?.user?.user?.orgData?.districtId,
    userFeatures: state?.user?.user?.features,
    searchResourceBy: state.playlistTestBox?.searchResourceBy,
    resources: state.playlistTestBox?.resources
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
    toggleManageModulesVisibility: toggleManageModulesVisibilityCSAction,
    changeExternalLTIModal: slice.actions?.changeExternalLTIModalAction,
    addExternalLTIResouce: slice.actions?.addExternalLTIResourceAction,
    showPreviewModal: slice.actions?.showTestPreviewModal,
    closePreviewModal: slice.actions?.closeTestPreviewModal,
    getCurrentDistrictUsers: getCurrentDistrictUsersAction,
    fetchExternalToolProvidersAction: slice.actions?.fetchExternalToolProvidersAction,
    setSearchByTab: slice.actions?.setSearchByTab,
    addResource: slice.actions?.addResource
  }
)(ManageContentBlock);
