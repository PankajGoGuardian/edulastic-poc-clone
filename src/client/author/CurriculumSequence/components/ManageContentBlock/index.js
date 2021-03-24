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
import slice from './ducks'
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
} from './styled'
import TestPreviewModal from '../../../Assignments/components/Container/TestPreviewModal'
import { setIsTestPreviewVisibleAction } from '../../../../assessment/actions/test'
import { getIsPreviewModalVisibleSelector } from '../../../../assessment/selectors/test'
import { getInterestedCurriculumsByOrgType } from '../../../src/selectors/user'

const resourceTabs = ['tests', 'resources']

const observeElement = (fetchTests, tests) => {
  const observerRef = useRef()
  return useCallback(
    (node) => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchTests()
        }
      })
      if (node) {
        observerRef.current.observe(node)
      }
    },
    [tests]
  )
}

const ManageContentBlock = (props) => {
  const {
    isLoading,
    loadedPage,
    filter,
    status,
    grades,
    subject,
    collection,
    setDefaults,
    fetchTests,
    tests = [],
    setFilterAction,
    setStatusAction,
    setGradesAction,
    setSubjectAction,
    setCollectionAction,
    resetAndFetchTests,
    fetchResource,
    searchStrings,
    setTestSearchAction,
    testsInPlaylist = [],
    selectedTestForPreview = '',
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
    externalToolsProviders,
    urlHasUseThis,
    searchResourceBy,
    setSearchByTab,
    addResource,
    resources = [],
    setEmbeddedVideoPreviewModal,
    isDifferentiationTab = false,
    setIsTestPreviewVisible,
    interestedCurriculums,
    history,
  } = props

  const lastResourceItemRef = observeElement(fetchTests, tests)

  const [searchBy] = useState('keywords')
  // const [searchResourceBy] = useState("all");
  const [showContentFilterModal, setShowContentFilterModal] = useState(false)
  const [isWebsiteUrlResourceModal, setWebsiteUrlResourceModal] = useState(
    false
  )
  const [alignment, setAlignment] = useState({})
  const [selectedStandards, setSelectedStandards] = useState([])

  const [
    isExternalVideoResourceModal,
    setExternalVideoResourceModal,
  ] = useState(false)
  const [isLTIResourceModal, setLTIResourceModal] = useState(false)

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

  const onChange = ({ key }) => {
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

  const onTestMenuChange = ({ key }) => {
    switch (key) {
      case '1':
        history.push('/author/tests/select')
        break
      default:
        break
    }
  }

  const openContentFilterModal = () => setShowContentFilterModal(true)
  const closeContentFilterModal = () => setShowContentFilterModal(false)

  const handleApplyFilters = () => {
    if (searchResourceBy === 'tests') {
      resetAndFetchTests()
    } else {
      const selectedStandardIds = selectedStandards?.map((x) => x._id) || []
      fetchResource({ standardIds: selectedStandardIds })
    }
    closeContentFilterModal()
  }

  const onSearchChange = (list) => setTestSearchAction(list)

  const enhanceTextWeight = (text) => (
    <span style={{ fontWeight: 600 }}>{text}</span>
  )

  const menu = (
    <Menu onClick={onChange}>
      <Menu.Item key="1">{enhanceTextWeight('Website URL')}</Menu.Item>
      <Menu.Item key="2">{enhanceTextWeight('Youtube')}</Menu.Item>
      <Menu.Item key="3">
        {enhanceTextWeight('External LTI Resource')}
      </Menu.Item>
    </Menu>
  )

  const testMenu = (
    <Menu onClick={onTestMenuChange}>
      <Menu.Item key="1">{enhanceTextWeight('Create New test')}</Menu.Item>
    </Menu>
  )
  let fetchCall

  if (tests.length > 10) {
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

  const renderList = () => {
    const listToRender = []
    if (searchResourceBy === 'resources') {
      resources.forEach(
        (
          {
            _id,
            contentType,
            contentTitle,
            contentDescription,
            data,
            contentUrl,
            hasStandardsOnCreation,
            standards,
          },
          idx
        ) => {
          listToRender.push(
            <ResourceItem
              type={contentType}
              id={_id}
              contentTitle={contentTitle}
              contentDescription={contentDescription}
              contentUrl={contentUrl}
              hasStandardsOnCreation={hasStandardsOnCreation}
              standards={standards}
              key={`resource-${idx}`}
              data={data}
              isAdded={testsInPlaylist.includes(_id)}
              previewTest={() =>
                previewResource(contentType, {
                  url: contentUrl,
                  contentTitle,
                  ...data,
                })
              }
            />
          )
        }
      )
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
                  value={searchStrings}
                  dropdownStyle={{ display: 'none' }}
                  data-cy="container-search-bar"
                />
                <SearchIcon color={themeColor} />
              </SearchBoxContainer>
              <ActionButton
                data-cy="test-filter"
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
                <ActionButton>
                  <IconPlus color={themeColor} width={15} height={15} />
                </ActionButton>
              </Dropdown>
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
            closeCallback={() => setWebsiteUrlResourceModal(false)}
            isVisible={isWebsiteUrlResourceModal}
            addResource={addResource}
            alignment={alignment}
            setAlignment={setAlignment}
            selectedStandards={selectedStandards}
            setSelectedStandards={setSelectedStandards}
          />
        )}

        {isExternalVideoResourceModal && (
          <ExternalVideoLink
            closeCallback={() => setExternalVideoResourceModal(false)}
            isVisible={isExternalVideoResourceModal}
            addResource={addResource}
            alignment={alignment}
            setAlignment={setAlignment}
            selectedStandards={selectedStandards}
            setSelectedStandards={setSelectedStandards}
          />
        )}

        {isLTIResourceModal && (
          <LTIResourceModal
            closeCallback={() => setLTIResourceModal(false)}
            isVisible={isLTIResourceModal}
            addResource={addResource}
            externalToolsProviders={externalToolsProviders}
            alignment={alignment}
            setAlignment={setAlignment}
            selectedStandards={selectedStandards}
            setSelectedStandards={setSelectedStandards}
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
      isLoading: state.playlistTestBox?.isLoading,
      loadedPage: state.playlistTestBox?.loadedPage,
      filter: state.playlistTestBox?.filter,
      status: state.playlistTestBox?.status,
      subject: state.playlistTestBox?.subject,
      grades: state.playlistTestBox?.grades,
      tests: state.playlistTestBox?.tests,
      collection: state.playlistTestBox?.collection,
      searchStrings: state.playlistTestBox?.searchString,
      testPreviewModalVisible: getIsPreviewModalVisibleSelector(state),
      selectedTestForPreview: state.playlistTestBox?.selectedTestForPreview,
      externalToolsProviders: state.playlistTestBox?.externalToolsProviders,
      collections: state.user?.user?.orgData?.itemBanks,
      currentDistrictUsers: getCurrentDistrictUsersSelector(state),
      districtId: state?.user?.user?.orgData?.districtIds?.[0],
      userFeatures: state?.user?.user?.features,
      searchResourceBy: state.playlistTestBox?.searchResourceBy,
      resources: state.playlistTestBox?.resources,
      interestedCurriculums: getInterestedCurriculumsByOrgType(state),
    }),
    {
      setFilterAction: slice.actions?.setFilterAction,
      setDefaults: slice.actions?.setDefaults,
      fetchTests: slice.actions?.fetchTests,
      setStatusAction: slice.actions?.setStatusAction,
      setSubjectAction: slice.actions?.setSubjectAction,
      setGradesAction: slice.actions?.setGradesAction,
      setCollectionAction: slice.actions?.setCollectionAction,
      resetAndFetchTests: slice.actions?.resetAndFetchTests,
      fetchResource: slice.actions?.fetchResource,
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
    }
  )
)

export default enhance(ManageContentBlock)
