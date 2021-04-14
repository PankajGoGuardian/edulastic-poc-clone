import { curriculumSequencesApi } from '@edulastic/api'
import { themeColor, white } from '@edulastic/colors'
import { FlexContainer, notification } from '@edulastic/common'
import { test as testsConstants } from '@edulastic/constants'
import { IconFilter, IconPlus } from '@edulastic/icons'
import { Dropdown, Empty, Menu, Spin } from 'antd'
import { pick, uniq } from 'lodash'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { getFromLocalStorage } from '@edulastic/api/src/utils/Storage'
import {
  getCurrentDistrictUsersAction,
  getCurrentDistrictUsersSelector,
} from '../../../../student/Login/ducks'
import { setEmbeddedVideoPreviewModal as setEmbeddedVideoPreviewModalAction } from '../../ducks'
import { submitLTIForm } from '../CurriculumModuleRow'
import PlaylistContentFilterModal from '../PlaylistContentFilterModal'
import ResourceItem from '../ResourceItem'
import WebsiteResourceModal from './components/WebsiteResourceModal'
import ExternalVideoLink from './components/ExternalVideoLink'
import LTIResourceModal from './components/LTIResourceModal'
import slice, { getPlaylistContentFilters } from './ducks'
import {
  ActionButton,
  LoaderWrapper,
  ManageContentContainer,
  ManageContentOuterWrapper,
  ResourceDataList,
  SearchBar,
  SearchBoxContainer,
  SearchIcon,
  SearchByNavigationBar,
  SearchByTab,
  CreateNewTestLink,
} from './styled'
import TestPreviewModal from '../../../Assignments/components/Container/TestPreviewModal'
import { setIsTestPreviewVisibleAction } from '../../../../assessment/actions/test'
import { getIsPreviewModalVisibleSelector } from '../../../../assessment/selectors/test'
import { getInterestedCurriculumsSelector } from '../../../src/selectors/user'
import { updateRecentStandardsAction } from '../../../src/actions/dictionaries'

const resourceTabs = ['tests', 'resources']

const observeElement = (fetchContent, content) => {
  const observerRef = useRef()
  return useCallback(
    (node) => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchContent()
        }
      })
      if (node) {
        observerRef.current.observe(node)
      }
    },
    [content]
  )
}

const ManageContentBlock = (props) => {
  const {
    contentFilters,
    setDefaults,
    fetchTests,
    fetchResources,
    setFilterAction,
    setStatusAction,
    setGradesAction,
    setSubjectAction,
    setCollectionAction,
    resetAndFetchTests,
    resetAndSearchResources,
    setTestSearchAction,
    testsInPlaylist = [],
    testPreviewModalVisible = false,
    showPreviewModal,
    closePreviewModal,
    subjectsFromCurriculumSequence,
    gradesFromCurriculumSequence,
    collectionFromCurriculumSequence = '',
    collections = [],
    currentDistrictUsers,
    districtId,
    getCurrentDistrictUsers,
    userFeatures,
    fetchExternalToolProvidersAction,
    urlHasUseThis,
    setSearchByTab,
    addResource,
    setEmbeddedVideoPreviewModal,
    isDifferentiationTab = false,
    setIsTestPreviewVisible,
    interestedCurriculums,
    setAlignment,
    setSelectedStandards,
    setResourceSearch,
    updateRecentStandardAction,
  } = props

  const {
    isLoading,
    loadedPage,
    filter,
    status,
    subject,
    grades,
    tests = [],
    collection,
    alignment = {},
    selectedStandards = [],
    searchString: searchStrings,
    selectedTestForPreview = '',
    externalToolsProviders,
    searchResourceBy,
    resources = [],
  } = contentFilters || {}

  const lastResourceItemRef =
    searchResourceBy === 'tests'
      ? observeElement(fetchTests, tests)
      : observeElement(fetchResources, resources)

  const [searchBy] = useState('keywords')
  // const [searchResourceBy] = useState("all");
  const [showContentFilterModal, setShowContentFilterModal] = useState(false)
  const [isWebsiteUrlResourceModal, setWebsiteUrlResourceModal] = useState(
    false
  )

  const [
    isExternalVideoResourceModal,
    setExternalVideoResourceModal,
  ] = useState(false)
  const [isLTIResourceModal, setLTIResourceModal] = useState(false)
  const [searchExpand, setSearchExpand] = useState(false)

  useEffect(() => {
    setDefaults({
      subject: subjectsFromCurriculumSequence,
      grades: gradesFromCurriculumSequence,
      collection: collectionFromCurriculumSequence,
    })
    !isLoading && fetchTests()
    fetchExternalToolProvidersAction({ districtId })
    // remove this condition once BE is fixed
    if (userFeatures.isCurator && !currentDistrictUsers)
      getCurrentDistrictUsers(districtId)
    return () => setSearchByTab('tests')
  }, [])

  const updateRecentStandards = () => {
    const recentStandards = JSON.parse(
      getFromLocalStorage('recentStandards') || '[]'
    )
    updateRecentStandardAction(recentStandards)
  }

  const onChange = ({ key }) => {
    updateRecentStandards()
    switch (key) {
      case '1':
        setWebsiteUrlResourceModal(true)
        break
      case '2':
        setExternalVideoResourceModal(true)
        break
      case '3':
        setLTIResourceModal(true)
        break
      default:
        break
    }
  }

  const openContentFilterModal = () => setShowContentFilterModal(true)
  const closeContentFilterModal = () => {
    setShowContentFilterModal(false)
    setAlignment({})
  }

  const handleApplyFilters = () => {
    if (searchResourceBy === 'tests') {
      resetAndFetchTests()
    } else {
      resetAndSearchResources()
    }
    closeContentFilterModal()
  }

  const onSearchChange = (list) => {
    if (searchResourceBy === 'tests') {
      setTestSearchAction(list)
    } else {
      setResourceSearch(list)
    }
  }

  const enhanceTextWeight = (text) => (
    <span style={{ fontWeight: 600 }}>{text}</span>
  )

  const menu = (
    <Menu onClick={onChange}>
      <Menu.Item data-cy="websiteUrlResource" key="1">
        {enhanceTextWeight('Website URL')}
      </Menu.Item>
      <Menu.Item data-cy="youtubeResource" key="2">
        {enhanceTextWeight('Youtube')}
      </Menu.Item>
      <Menu.Item data-cy="externalLtiResource" key="3">
        {enhanceTextWeight('External LTI Resource')}
      </Menu.Item>
    </Menu>
  )

  const testMenu = (
    <Menu>
      <Menu.Item data-cy="createNew" key="1">
        <CreateNewTestLink href="/author/tests/select" target="_blank">
          {enhanceTextWeight('Create New test')}
        </CreateNewTestLink>
      </Menu.Item>
    </Menu>
  )
  let fetchCall

  if (searchResourceBy === 'resources') {
    if (resources.length > 10) {
      fetchCall = resources.length - 7
    }
  } else if (tests.length > 10) {
    fetchCall = tests.length - 7
  }

  const showResource = async (resource) => {
    resource =
      resource &&
      pick(resource, [
        'toolProvider',
        'url',
        'customParams',
        'consumerKey',
        'sharedSecret',
      ])
    try {
      const signedRequest = await curriculumSequencesApi.getSignedRequest({
        resource,
      })
      submitLTIForm(signedRequest)
    } catch (e) {
      notification({ messageKey: 'failedToLoadResource' })
    }
  }

  const previewResource = (type, data) => {
    if (type === 'lti_resource') showResource(data)
    if (type === 'website_resource') window.open(data.url, '_blank')
    if (type === 'video_resource')
      setEmbeddedVideoPreviewModal({ title: data.contentTitle, url: data.url })
  }

  const handleCloseResourcesModals = () => {
    setWebsiteUrlResourceModal(false)
    setExternalVideoResourceModal(false)
    setLTIResourceModal(false)
    setAlignment({})
  }

  const handleOnFocus = () => {
    setSearchExpand(true)
  }
  const handleOnBlur = () => {
    setSearchExpand(false)
  }

  const renderList = () => {
    const listToRender = []
    if (searchResourceBy === 'resources') {
      if (resources.length) {
        resources.forEach((resource, idx) => {
          if (idx === fetchCall) {
            listToRender.push(
              <div style={{ height: '1px' }} ref={lastResourceItemRef} />
            )
          }
          listToRender.push(
            <ResourceItem
              key={resource?.contentId}
              type={resource?.contentType}
              id={resource?.contentId}
              contentTitle={resource?.contentTitle}
              contentDescription={resource?.contentDescription}
              contentUrl={resource?.contentUrl}
              hasStandardsOnCreation={resource?.hasStandardsOnCreation}
              alignment={resource?.alignment}
              standards={resource?.standards}
              isAdded={testsInPlaylist.includes(resource?._id)}
              interestedCurriculums={interestedCurriculums}
              previewTest={() =>
                previewResource(resource?.contentType, {
                  url: resource?.contentUrl,
                  contentTitle: resource?.contentTitle,
                })
              }
            />
          )
        })
      }
    }
    if (searchResourceBy === 'tests') {
      if (tests.length) {
        tests.forEach((test, idx) => {
          if (idx === fetchCall) {
            listToRender.push(
              <div style={{ height: '1px' }} ref={lastResourceItemRef} />
            )
          }
          listToRender.push(
            <ResourceItem
              type="test"
              id={test._id}
              contentTitle={test.title}
              key={test._id}
              summary={test?.summary}
              alignment={test?.alignment}
              isAdded={testsInPlaylist.includes(test?._id)}
              interestedCurriculums={interestedCurriculums}
              previewTest={() => {
                showPreviewModal(test._id)
                setIsTestPreviewVisible(true)
              }}
              status={test?.status}
              testType={test?.testType}
            />
          )
        })
      }
    }
    if (listToRender.length) return listToRender

    return (
      <Empty style={{ margin: 'auto' }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
    )
  }

  return (
    <>
      <ManageContentOuterWrapper>
        <div className="inner-wrapper">
          <ManageContentContainer data-cy="play-list-search-container">
            <SearchByNavigationBar justify="flex-start">
              {resourceTabs.map((tab) => (
                <SearchByTab
                  key={tab}
                  data-cy={tab}
                  onClick={() => setSearchByTab(tab)}
                  isTabActive={tab.includes(searchResourceBy)}
                >
                  {tab}
                </SearchByTab>
              ))}
            </SearchByNavigationBar>
            <br />
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
                  mode="tags"
                  tokenSeparators={[',']}
                  placeholder={`Search by ${searchBy}`}
                  onChange={onSearchChange}
                  onFocus={handleOnFocus}
                  onBlur={handleOnBlur}
                  value={searchStrings}
                  dropdownStyle={{ display: 'none' }}
                  data-cy="container-search-bar"
                />
                <SearchIcon color={themeColor} />
              </SearchBoxContainer>
              {!searchExpand && (
                <>
                  <ActionButton
                    data-cy={
                      searchResourceBy === 'tests'
                        ? 'test-filter'
                        : 'resource-filter'
                    }
                    onClick={openContentFilterModal}
                    isActive={showContentFilterModal}
                  >
                    <IconFilter
                      color={showContentFilterModal ? white : themeColor}
                      width={20}
                      height={20}
                    />
                  </ActionButton>
                  <Dropdown
                    overlay={searchResourceBy === 'tests' ? testMenu : menu}
                    placement="bottomRight"
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    <ActionButton
                      data-cy={
                        searchResourceBy === 'tests'
                          ? 'addTest'
                          : 'addResources'
                      }
                    >
                      <IconPlus color={themeColor} width={15} height={15} />
                    </ActionButton>
                  </Dropdown>
                </>
              )}
            </FlexContainer>
            <br />

            <ResourceDataList
              urlHasUseThis={urlHasUseThis}
              isDifferentiationTab={isDifferentiationTab}
            >
              {isLoading && loadedPage === 0 ? <Spin /> : renderList()}
              {isLoading && loadedPage !== 0 && (
                <LoaderWrapper>
                  <Spin />
                </LoaderWrapper>
              )}
            </ResourceDataList>

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
        </div>

        {showContentFilterModal && (
          <PlaylistContentFilterModal
            isVisible={showContentFilterModal}
            onCancel={closeContentFilterModal}
            collectionsList={uniq(
              [
                ...testsConstants.collectionDefaultFilter?.filter(
                  (c) => c?.value
                ),
                ...collections.map((o) => ({
                  value: o?._id,
                  text: o?.name,
                })),
              ],
              'value'
            )}
            filter={filter}
            status={status}
            grades={grades}
            subject={subject}
            collection={collection}
            onFilterChange={(prop) => setFilterAction(prop)}
            onStatusChange={(prop) => setStatusAction(prop)}
            onGradesChange={(prop) => setGradesAction(prop)}
            onSubjectChange={(prop) => setSubjectAction(prop)}
            onCollectionChange={(prop) => setCollectionAction(prop)}
            handleApplyFilters={handleApplyFilters}
            searchResourceBy={searchResourceBy}
            alignment={alignment}
            setAlignment={setAlignment}
            setSelectedStandards={setSelectedStandards}
          />
        )}

        {isWebsiteUrlResourceModal && (
          <WebsiteResourceModal
            closeCallback={handleCloseResourcesModals}
            isVisible={isWebsiteUrlResourceModal}
            addResource={addResource}
            alignment={alignment}
            setAlignment={setAlignment}
            selectedStandards={selectedStandards}
            setSelectedStandards={setSelectedStandards}
            curriculum={collectionFromCurriculumSequence}
          />
        )}

        {isExternalVideoResourceModal && (
          <ExternalVideoLink
            closeCallback={handleCloseResourcesModals}
            isVisible={isExternalVideoResourceModal}
            addResource={addResource}
            alignment={alignment}
            setAlignment={setAlignment}
            selectedStandards={selectedStandards}
            setSelectedStandards={setSelectedStandards}
            curriculum={collectionFromCurriculumSequence}
          />
        )}

        {isLTIResourceModal && (
          <LTIResourceModal
            closeCallback={handleCloseResourcesModals}
            isVisible={isLTIResourceModal}
            addResource={addResource}
            externalToolsProviders={externalToolsProviders}
            alignment={alignment}
            setAlignment={setAlignment}
            selectedStandards={selectedStandards}
            setSelectedStandards={setSelectedStandards}
            curriculum={collectionFromCurriculumSequence}
          />
        )}
      </ManageContentOuterWrapper>
      {testPreviewModalVisible && selectedTestForPreview && (
        <TestPreviewModal
          isModalVisible={testPreviewModalVisible}
          testId={selectedTestForPreview}
          showStudentPerformance
          closeTestPreviewModal={() => {
            closePreviewModal()
            setIsTestPreviewVisible(false)
          }}
          resetOnClose={closePreviewModal}
          unmountOnClose
        />
      )}
    </>
  )
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      testPreviewModalVisible: getIsPreviewModalVisibleSelector(state),
      collections: state.user?.user?.orgData?.itemBanks,
      currentDistrictUsers: getCurrentDistrictUsersSelector(state),
      districtId: state?.user?.user?.orgData?.districtIds?.[0],
      userFeatures: state?.user?.user?.features,
      interestedCurriculums: getInterestedCurriculumsSelector(state),
      contentFilters: getPlaylistContentFilters(state),
    }),
    {
      setFilterAction: slice.actions?.setFilterAction,
      setDefaults: slice.actions?.setDefaults,
      fetchTests: slice.actions?.fetchTests,
      fetchResources: slice.actions?.fetchResources,
      setStatusAction: slice.actions?.setStatusAction,
      setSubjectAction: slice.actions?.setSubjectAction,
      setGradesAction: slice.actions?.setGradesAction,
      setCollectionAction: slice.actions?.setCollectionAction,
      resetAndFetchTests: slice.actions?.resetAndFetchTests,
      searchResource: slice.actions?.searchResource,
      resetAndSearchResources: slice.actions?.resetAndSearchResources,
      setTestSearchAction: slice.actions?.setTestSearchAction,
      showPreviewModal: slice.actions?.showTestPreviewModal,
      closePreviewModal: slice.actions?.closeTestPreviewModal,
      getCurrentDistrictUsers: getCurrentDistrictUsersAction,
      fetchExternalToolProvidersAction:
        slice.actions?.fetchExternalToolProvidersAction,
      setSearchByTab: slice.actions?.setSearchByTab,
      addResource: slice.actions?.addResource,
      setEmbeddedVideoPreviewModal: setEmbeddedVideoPreviewModalAction,
      setIsTestPreviewVisible: setIsTestPreviewVisibleAction,
      setAlignment: slice.actions.setAlignmentAction,
      setSelectedStandards: slice.actions.setSelectedStandardsAction,
      setResourceSearch: slice.actions.setResourceSearchAction,
      updateRecentStandardAction: updateRecentStandardsAction,
    }
  )
)

export default enhance(ManageContentBlock)
