/* eslint-disable no-use-before-define */
import { curriculumSequencesApi } from "@edulastic/api";
import { themeColor, white } from "@edulastic/colors";
import { FlexContainer } from "@edulastic/common";
import { test as testsConstants } from "@edulastic/constants";
import { IconFilter, IconPlus } from "@edulastic/icons";
import { Dropdown, Empty, Menu, message, Spin } from "antd";
import { pick, uniq } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import AssessmentPlayer from "../../../../assessment";
import { getCurrentDistrictUsersAction, getCurrentDistrictUsersSelector } from "../../../../student/Login/ducks";
import { setEmbeddedVideoPreviewModal as setEmbeddedVideoPreviewModalAction } from "../../ducks";
import { submitLTIForm } from "../CurriculumModuleRow";
import PlaylistTestBoxFilter from "../PlaylistTestBoxFilter";
import ResourceItem from "../ResourceItem";
import WebsiteResourceModal from "./components/WebsiteResourceModal";
import ExternalVideoLink from "./components/ExternalVideoLink";
import LTIResourceModal from "./components/LTIResourceModal";
import slice from "./ducks";
import {
  ActionButton,
  LoaderWrapper,
  ManageContentContainer,
  ManageContentOuterWrapper,
  ModalWrapper,
  ResourceDataList,
  SearchBar,
  ManageContentLabel,
  SearchBoxContainer,
  SearchIcon,
  SearchByNavigationBar,
  SearchByTab
} from "./styled";

const resourceTabs = ["tests", "resources"];
const sourceList = ["everything", "learnzillion", "khan academy", "ck12", "grade"];

const observeElement = (fetchTests, tests) =>
  useCallback(
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
    tests = [],
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
    testsInPlaylist = [],
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
    urlHasUseThis,
    searchResourceBy,
    setSearchByTab,
    addResource,
    resources = [],
    setEmbeddedVideoPreviewModal
  } = props;

  const lastResourceItemRef = observeElement(fetchTests, tests);

  const [searchBy] = useState("keywords");
  // const [searchResourceBy] = useState("all");
  const [isShowFilter, setShowFilter] = useState(false);
  const [isWebsiteUrlResourceModal, setWebsiteUrlResourceModal] = useState(false);
  const [isExternalVideoResourceModal, setExternalVideoResourceModal] = useState(false);
  const [isLTIResourceModal, setLTIResourceModal] = useState(false);

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
    return () => setSearchByTab("tests");
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
        setLTIResourceModal(true);
        break;
      default:
        break;
    }
  };

  const toggleTestFilter = () => {
    if (isShowFilter) {
      resetAndFetchTests();
    }
    setShowFilter(x => !x);
  };

  const onSearchChange = e => setTestSearchAction(e.target.value);

  const enhanceTextWeight = text => <span style={{ fontWeight: 600 }}>{text}</span>;

  const menu = (
    <Menu onClick={onChange}>
      <Menu.Item key="1">{enhanceTextWeight("Website URL")}</Menu.Item>
      <Menu.Item key="2">{enhanceTextWeight("Youtube")}</Menu.Item>
      <Menu.Item key="3">{enhanceTextWeight("External LTI Resource")}</Menu.Item>
    </Menu>
  );

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

  const previewResource = (type, data) => {
    if (type === "lti_resource") showResource(data);
    if (type === "website_resource") window.open(data.url, "_blank");
    if (type === "video_resource") setEmbeddedVideoPreviewModal({ title: data.contentTitle, url: data.url });
  };

  const renderList = () => {
    const listToRender = [];
    if (searchResourceBy === "resources") {
      resources.forEach(({ _id, contentType, contentTitle, contentDescription, data, contentUrl }, idx) => {
        listToRender.push(
          <ResourceItem
            type={contentType}
            id={_id}
            contentTitle={contentTitle}
            contentDescription={contentDescription}
            contentUrl={contentUrl}
            key={`resource-${idx}`}
            data={data}
            isAdded={testsInPlaylist.includes(_id)}
            previewTest={() => previewResource(contentType, { url: contentUrl, contentTitle, ...data })}
          />
        );
      });
    }
    if (searchResourceBy === "tests") {
      if (tests.length) {
        tests.forEach((test, idx) => {
          if (idx === fetchCall) {
            listToRender.push(<div style={{ height: "1px" }} ref={lastResourceItemRef} />);
          }
          listToRender.push(
            <ResourceItem
              type="test"
              id={test._id}
              contentTitle={test.title}
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
      <div className="inner-wrapper">
        <ManageContentContainer data-cy="play-list-search-container">
          <ManageContentLabel>Select Content to Add</ManageContentLabel>
          {/* <SearchByNavigationBar>
            <SearchByTab onClick={() => setSearchBy("keywords")} isTabActive={searchBy === "keywords"}>
              keywords
        </SearchByTab>
            <SearchByTab onClick={() => setSearchBy("standards")} isTabActive={searchBy === "standards"}>
              standards
        </SearchByTab>
          </SearchByNavigationBar> */}
          <FlexContainer>
            <SearchBoxContainer>
              <SearchBar
                type="search"
                placeholder={`Search by ${searchBy}`}
                onChange={onSearchChange}
                value={searchString}
              />
              <SearchIcon color={themeColor} />
            </SearchBoxContainer>
            <ActionButton data-cy="test-filter" onClick={toggleTestFilter} isActive={isShowFilter}>
              <IconFilter color={isShowFilter ? white : themeColor} width={20} height={20} />
            </ActionButton>
            <Dropdown overlay={menu} placement="bottomRight">
              <ActionButton>
                <IconPlus color={themeColor} width={15} height={15} />
              </ActionButton>
            </Dropdown>
          </FlexContainer>
          <br />
          {isShowFilter ? (
            <PlaylistTestBoxFilter
              authoredList={[]} // Send authors data
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
              onFilterChange={prop => setFilterAction(prop)}
              onStatusChange={prop => setStatusAction(prop)}
              onAuthoredChange={prop => setAuthoredAction(prop)}
              onGradesChange={prop => setGradesAction(prop)}
              onSubjectChange={prop => setSubjectAction(prop)}
              onCollectionChange={prop => setCollectionAction(prop)}
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
              <ResourceDataList urlHasUseThis={urlHasUseThis}>
                {isLoading && loadedPage === 0 ? <Spin /> : renderList()}
                {isLoading && loadedPage !== 0 && (
                  <LoaderWrapper>
                    <Spin />
                  </LoaderWrapper>
                )}
              </ResourceDataList>
            </>
          )}

          {/* <ExternalLTIModalForm
            onModalClose={onModalClose}
            isShowExternalLTITool={isShowExternalLTITool}
            externalToolsProviders={externalToolsProviders}
            onChange={(key, value) => changeExternalLTIModal({ key, value })}
            isAddNew={isAddNew}
            setAddNew={setAddNew}
            addLTIResource={addLTIResource}
          /> */}
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

      {isLTIResourceModal && (
        <LTIResourceModal
          closeCallback={() => setLTIResourceModal(false)}
          isVisible={isLTIResourceModal}
          addResource={addResource}
          externalToolsProviders={externalToolsProviders}
        />
      )}
    </ManageContentOuterWrapper>
  );
};

export default connect(
  state => ({
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
    showPreviewModal: slice.actions?.showTestPreviewModal,
    closePreviewModal: slice.actions?.closeTestPreviewModal,
    getCurrentDistrictUsers: getCurrentDistrictUsersAction,
    fetchExternalToolProvidersAction: slice.actions?.fetchExternalToolProvidersAction,
    setSearchByTab: slice.actions?.setSearchByTab,
    addResource: slice.actions?.addResource,
    setEmbeddedVideoPreviewModal: setEmbeddedVideoPreviewModalAction
  }
)(ManageContentBlock);
