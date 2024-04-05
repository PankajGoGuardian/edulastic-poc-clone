import React, { Component } from 'react'
import PropTypes from 'prop-types'
import uuid from 'uuid/v4'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Menu } from 'antd'
import { questionType } from '@edulastic/constants'
import {
  PaddingDiv,
  withWindowSizes,
  notification,
  EduButton,
  FlexContainer,
} from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { withRouter } from 'react-router'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {
  IconClose,
  IconBarChart,
  IconLayout,
  IconLineChart,
  IconMath,
  IconNewList,
  IconSelection,
  IconTarget,
  IconRulerPencil,
  IconMultipart,
  IconRead,
  IconWrite,
  IconPlay,
  IconExpand,
  IconCollapse,
} from '@edulastic/icons'
import CustomPrompt from '@edulastic/common/src/components/CustomPrompt'
import { TEST_TYPE_SURVEY } from '@edulastic/constants/const/testTypes'
import QuestionTypes from '../QuestionType/QuestionTypes'
import { getItemSelector } from '../../../src/selectors/items'
import Header from '../Header/Header'
import {
  convertItemToMultipartAction,
  convertItemToPassageWithQuestionsAction,
  getItemDetailSelector,
} from '../../../ItemDetail/ducks'
import { setQuestionAction } from '../../../QuestionEditor/ducks'
import { addQuestionAction } from '../../../sharedDucks/questions'
import { toggleSideBarAction } from '../../../src/actions/toggleMenu'
import {
  setQuestionCategory,
  setQuestionTab,
} from '../../../src/actions/pickUpQuestion'
import {
  LeftSide,
  RightSide,
  MenuTitle,
  StyledModal,
  StyledModalContainer,
  MobileButtons,
  SelectWidget,
  BackLink,
  PickQuestionWrapper,
  LeftMenuWrapper,
  AffixWrapper,
} from './styled'
import { toggleCreateItemModalAction } from '../../../src/actions/testItem'
import Breadcrumb from '../../../src/components/Breadcrumb'

import { SMALL_DESKTOP_WIDTH } from '../../../src/constants/others'
import {
  getIsAudioResponseQuestionEnabled,
  isSurveyTestSelector,
  setTestDataAction,
} from '../../../TestPage/ducks'
import { getSearchParams } from '../../../src/utils/util'
import { getCards } from '../QuestionType/constants'

class Container extends Component {
  state = {
    isShowCategories: false,
  }

  componentDidMount() {
    const {
      isSurveyTest,
      setCategory,
      setData,
      selectedCategory,
      history,
    } = this.props
    if (
      window.location.search.includes(`testType=${TEST_TYPE_SURVEY}`) ||
      isSurveyTest
    ) {
      setData({
        testType: TEST_TYPE_SURVEY,
        updated: false,
      })
      setCategory('likert-scale')
    } else if (selectedCategory === 'likert-scale') {
      setCategory('multiple-choice')
    }
    if (history?.location?.state?.changeQType) {
      console.log('Came')
      this.onQChange()
    }
  }

  onQChange = () => {
    const allQuestionTypes = getCards(() => {}, false, true)
    const selectedQuestionTypes = allQuestionTypes.find(
      ({ data: { type } }) => {
        return type === questionType.MULTIPLE_CHOICE
      }
    )

    if (selectedQuestionTypes) {
      this.selectQuestionType({
        ...selectedQuestionTypes.data,
        stimulus: `<p>THis i sample</p>`,
      })
    }
  }

  // when a particular question type is picked, populate the "authorQuestions" collection
  selectQuestionType = (data) => {
    const {
      convertToMultipart,
      setQuestion,
      addQuestion,
      history,
      match,
      t,
      modalItemId,
      navigateToQuestionEdit,
      isTestFlow,
      convertToPassageWithQuestions,
      selectedCategory,
      addQuestionToPassage,
    } = this.props

    const { testId, itemId, id } = match.params
    const { isMultiDimensionalLayout = false, rowIndex } =
      history.location?.state || {}

    const resourceSelected = ['rulers-calculators', 'instruction'].includes(
      selectedCategory
    )
    const questionSelected = !resourceSelected

    if (isMultiDimensionalLayout) {
      if (
        (rowIndex === 0 && questionSelected) ||
        (rowIndex !== 0 && resourceSelected)
      ) {
        notification({ type: 'warn', messageKey: 'pleaseAddResources' })
        return
      }
    }
    // in case of combination multipart
    if (data.type === questionType.COMBINATION_MULTIPART) {
      convertToMultipart({ isTestFlow, itemId: itemId || id, testId })
      return
    }

    // handle case of passage with questions
    if (
      data.type === questionType.PASSAGE_WITH_QUESTIONS ||
      data.type === questionType.PASSAGE
    ) {
      convertToPassageWithQuestions({
        isTestFlow,
        itemId: itemId || id,
        testId,
        canAddMultipleItems: data.type === questionType.PASSAGE_WITH_QUESTIONS,
        title: data.title,
      })
      return
    }

    // FIXME: Weird! connect not working properly. setQuestion not available as a prop
    // TODO: found the issue because of an indirect circular dependency. Found all the
    // possible locations and eventually need to be fixed all the circular dependency issues

    const question = {
      id: uuid(),
      ...data,
    }

    // 1. Need to remove the item in case of edit item flow in normal and test flow.

    // existing
    //
    setQuestion(question)
    // add question to the questions store.
    // selecting a question (having default values) type should not update the author question
    addQuestion({ ...question, updated: false })

    if (addQuestionToPassage) {
      return
    }

    if (modalItemId) {
      navigateToQuestionEdit()
      return
    }

    if (isTestFlow) {
      history.push({
        pathname: `/author/tests/${testId}/createItem/${itemId}/questions/create/${question.type}`,
        state: {
          ...history.location.state,
          backUrl: match.url,
          backText: t('component.pickupcomponent.headertitle'),
          fadeSidebar: true,
        },
        ...getSearchParams('testType'),
      })
      return
    }

    history.push({
      pathname: `/author/questions/create/${question.type}`,
      state: {
        ...history.location.state,
        backUrl: match.url,
        backText: t('component.pickupcomponent.headertitle'),
      },
    })
  }

  get link() {
    const { history, t } = this.props

    if (history.location.state) {
      return {
        url: history.location.state.backUrl,
        text: history.location.state.backText,
      }
    }

    return {
      url: '/author/items',
      text: t('component.itemDetail.backToItemList'),
    }
  }

  handleCategory = ({ key }) => {
    const { setCategory } = this.props
    setCategory(key)
  }

  handleChangeTab = ({ key }) => {
    const { setCategory, setTab } = this.props

    setTab(key)

    if (key === 'feature-tab') {
      setCategory('feature')
    }

    if (key === 'question-tab') {
      setCategory('multiple-choice')
    }
  }

  toggleCategories = () => {
    const { isShowCategories } = this.state

    this.setState({
      isShowCategories: !isShowCategories,
    })
  }

  get breadcrumb() {
    const {
      testName,
      toggleModalAction,
      testId,
      isTestFlow,
      location: { state },
      match: { params },
    } = this.props

    if (isTestFlow) {
      const test_id = testId || params.testId || ''
      let testPath = `/author/tests/create/description`
      if (test_id) {
        testPath = `/author/tests/tab/description/id/${test_id}`
      }
      return [
        {
          title: 'TEST LIBRARY',
          to: '/author/tests',
        },
        {
          title: testName || state?.testName,
          to: testPath,
          onClick: toggleModalAction,
          state: { persistStore: true },
          ...getSearchParams(),
        },
        {
          title: 'SELECT A QUESTION TYPE',
          to: '',
        },
      ]
    }
    return [
      {
        title: 'ITEM BANK',
        to: '/author/items',
      },
      {
        title: 'SELECT A QUESTION OR RESOURCE',
        to: `/author/items/${
          window.location.pathname.split('/')[3]
        }/item-detail`,
      },
      {
        title: 'SELECT A QUESTION TYPE',
        to: '',
      },
    ]
  }

  render() {
    const {
      t,
      windowWidth,
      toggleSideBar,
      modalItemId,
      onModalClose,
      selectedCategory,
      selectedTab,
      location: { pathname = '' },
      history: { push },
      itemDetails = {},
      addQuestionToPassage,
      isInModal,
      onToggleFullModal,
      isTestFlow,
      testId,
      match: { params },
      enableAudioResponseQuestion,
      isSurveyTest,
    } = this.props
    const { mobileViewShow, isShowCategories } = this.state
    const { multipartItem } = itemDetails
    const audioResponseQuestionTypeText = enableAudioResponseQuestion
      ? 'Written & Recorded'
      : 'Writing'
    if (!itemDetails._id) {
      if (pathname.includes('/author/tests')) {
        push({
          pathname: '/author/tests/create/description',
          ...getSearchParams(),
        })
        return <div />
      }
      if (pathname.includes('/author/items')) {
        push('/author/items')
        return <div />
      }
    }

    const hasUnsavedChangesInTestFlow =
      isTestFlow && !testId && params.testId === 'undefined'

    return (
      <div showMobileView={mobileViewShow}>
        <CustomPrompt
          when={hasUnsavedChangesInTestFlow}
          onUnload
          message={(loc, action) => {
            if (
              // going back
              action === 'POP' &&
              loc.pathname === '/author/tests/create/addItems'
            ) {
              return t('component.common.modal.exitPageWarning')
            }
          }}
        />
        <Header
          title={
            <>
              {t('header:common.selectQuestionWidget')}
              <button onClick={this.onQChange}>Change Q Type</button>
            </>
          }
          link={this.link}
          noEllipsis
          addQuestionToPassage={addQuestionToPassage}
          toggleSideBar={toggleSideBar}
          isInModal={isInModal}
          renderExtra={() =>
            (modalItemId || addQuestionToPassage) && (
              <FlexContainer>
                <EduButton
                  isBlue
                  IconBtn
                  data-cy="closeModal"
                  onClick={onToggleFullModal}
                >
                  {isInModal ? <IconExpand /> : <IconCollapse />}
                </EduButton>
                <EduButton
                  isBlue
                  IconBtn
                  data-cy="closeModal"
                  onClick={onModalClose}
                >
                  <IconClose />
                </EduButton>
              </FlexContainer>
            )
          }
        />
        <PickQuestionWrapper isInModal={isInModal}>
          <LeftSide isInModal={isInModal}>
            <Menu
              mode="horizontal"
              selectedKeys={[selectedTab]}
              onClick={this.handleChangeTab}
              style={{
                background: 'transparent',
                borderBottom: 0,
                display: 'none',
              }}
            >
              <Menu.Item key="question-tab">
                {t('component.pickupcomponent.question')}
              </Menu.Item>
              <Menu.Item key="feature-tab">
                {t('component.pickupcomponent.feature')}
              </Menu.Item>
            </Menu>
            <MenuTitle>{t('component.pickupcomponent.selectAType')}</MenuTitle>
            <AffixWrapper addQuestionToPassage={addQuestionToPassage}>
              <PerfectScrollbar options={{ suppressScrollX: true }}>
                <LeftMenuWrapper
                  mode="inline"
                  selectedKeys={[selectedCategory]}
                  onClick={this.handleCategory}
                >
                  {!isSurveyTest && [
                    <Menu.Item key="multiple-choice">
                      <IconNewList />
                      Multiple Choice
                    </Menu.Item>,
                    <Menu.Item key="fill-blanks">
                      <IconSelection />
                      Fill in the Blanks
                    </Menu.Item>,
                    <Menu.Item key="classify">
                      <IconLayout />
                      Classify, Match & Order
                    </Menu.Item>,
                    <Menu.Item key="edit">
                      <IconWrite />
                      {audioResponseQuestionTypeText}
                    </Menu.Item>,
                  ]}
                  {!multipartItem && !isSurveyTest && (
                    <Menu.Item key="read">
                      <IconRead />
                      PASSAGE
                    </Menu.Item>
                  )}
                  {!isSurveyTest && [
                    <Menu.Item key="highlight">
                      <IconTarget />
                      Highlight
                    </Menu.Item>,
                    <Menu.Item key="math">
                      <IconMath />
                      Math
                    </Menu.Item>,
                    <Menu.Item key="graphing">
                      <IconLineChart />
                      Graphing
                    </Menu.Item>,
                    <Menu.Item key="charts">
                      <IconBarChart />
                      Charts
                    </Menu.Item>,
                    <Menu.Item key="multipart">
                      <IconMultipart />
                      Multipart
                    </Menu.Item>,
                  ]}
                  <Menu.Item key="instruction">
                    <IconPlay />
                    Instructions
                  </Menu.Item>
                  {!isSurveyTest && multipartItem && (
                    <Menu.Item key="rulers-calculators">
                      <IconRulerPencil />
                      Tools
                    </Menu.Item>
                  )}
                  {isSurveyTest && (
                    <Menu.Item key="likert-scale">
                      <IconMultipart />
                      Likert Scale
                    </Menu.Item>
                  )}
                  {/* implementation is in progress */}
                  {/* <Menu.Item key="other">
                    <IconMore />
                    Other
                  </Menu.Item> */}
                </LeftMenuWrapper>
              </PerfectScrollbar>
            </AffixWrapper>
          </LeftSide>
          <RightSide>
            {!addQuestionToPassage && (
              <Breadcrumb
                data={this.breadcrumb}
                style={{
                  position: 'relative',
                  top: 0,
                  padding: '0px 0px 15px',
                  display: windowWidth > SMALL_DESKTOP_WIDTH ? 'block' : 'none',
                }}
              />
            )}
            <MobileButtons>
              <BackLink
                to={`/author/items/${
                  window.location.pathname.split('/')[3]
                }/item-detail`}
              >
                Back to Item Detail
              </BackLink>
              <SelectWidget
                data-cy="selectWidget"
                onClick={this.toggleCategories}
              >
                Select widget
              </SelectWidget>
            </MobileButtons>
            <PaddingDiv
              style={{
                position: 'relative',
                top: 0,
                overflow: 'auto',
                height: 'auto',
                background: '#fff',
                minHeight: 'calc(100vh - 190px)',
              }}
            >
              <QuestionTypes
                onSelectQuestionType={this.selectQuestionType}
                questionType={selectedCategory}
              />
            </PaddingDiv>
          </RightSide>
        </PickQuestionWrapper>

        <StyledModal
          open={isShowCategories}
          onClose={this.toggleCategories}
          classNames={{
            overlay: 'modal-overlay',
            modal: 'modal',
          }}
        >
          <StyledModalContainer>
            <MenuTitle>{t('component.pickupcomponent.selectAType')}</MenuTitle>
            <Menu
              mode="inline"
              style={{
                background: 'transparent',
                border: 0,
              }}
              selectedKeys={[selectedCategory]}
              onClick={this.handleCategory}
            >
              {!isSurveyTest && [
                <Menu.Item
                  key="multiple-choice"
                  onClick={this.toggleCategories}
                >
                  <IconNewList />
                  Multiple Choice
                </Menu.Item>,
                <Menu.Item key="fill-blanks" onClick={this.toggleCategories}>
                  <IconSelection />
                  Fill in the Blanks
                </Menu.Item>,
                <Menu.Item key="classify" onClick={this.toggleCategories}>
                  <IconLayout />
                  Classify, Match & Order
                </Menu.Item>,
                <Menu.Item key="edit" onClick={this.toggleCategories}>
                  <IconWrite />
                  {audioResponseQuestionTypeText}
                </Menu.Item>,
              ]}
              {!multipartItem && !isSurveyTest && (
                <Menu.Item key="read" onClick={this.toggleCategories}>
                  <IconRead />
                  Reading
                </Menu.Item>
              )}
              {!isSurveyTest && [
                <Menu.Item key="highlight" onClick={this.toggleCategories}>
                  <IconTarget />
                  Highlight
                </Menu.Item>,
                <Menu.Item key="math" onClick={this.toggleCategories}>
                  <IconMath />
                  Math
                </Menu.Item>,
                <Menu.Item key="graphing" onClick={this.toggleCategories}>
                  <IconLineChart />
                  Graphing
                </Menu.Item>,
                <Menu.Item key="charts" onClick={this.toggleCategories}>
                  <IconBarChart />
                  Charts
                </Menu.Item>,
                <Menu.Item key="multipart">
                  <IconMultipart />
                  Multipart
                </Menu.Item>,
              ]}
              <Menu.Item key="instruction">
                <IconPlay />
                Instructions
              </Menu.Item>
              {isSurveyTest && (
                <Menu.Item key="likert-scale">
                  <IconMultipart />
                  Likert Scale
                </Menu.Item>
              )}
              {!isSurveyTest && (
                <Menu.Item
                  key="rulers-calculators"
                  onClick={this.toggleCategories}
                >
                  <IconRulerPencil />
                  Tools
                </Menu.Item>
              )}
              {/* implementation is in progress */}
              {/* <Menu.Item key="other" onClick={this.toggleCategories}>
                <IconMore />
                Other
              </Menu.Item> */}
            </Menu>
          </StyledModalContainer>
        </StyledModal>
      </div>
    )
  }
}

const enhance = compose(
  withNamespaces(['author', 'header']),
  withWindowSizes,
  withRouter,
  connect(
    (state) => ({
      item: getItemSelector(state),
      selectedCategory: state.pickUpQuestion.selectedCategory,
      selectedTab: state.pickUpQuestion.selectedTab,
      testName: state.tests.entity.title,
      testId: state.tests.entity._id,
      itemDetails: getItemDetailSelector(state),
      enableAudioResponseQuestion: getIsAudioResponseQuestionEnabled(state),
      isSurveyTest: isSurveyTestSelector(state),
    }),
    {
      setQuestion: setQuestionAction,
      addQuestion: addQuestionAction,
      toggleSideBar: toggleSideBarAction,
      setCategory: setQuestionCategory,
      setTab: setQuestionTab,
      toggleModalAction: toggleCreateItemModalAction,
      convertToMultipart: convertItemToMultipartAction,
      convertToPassageWithQuestions: convertItemToPassageWithQuestionsAction,
      setData: setTestDataAction,
    }
  )
)

Container.propTypes = {
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  setQuestion: PropTypes.func.isRequired,
  addQuestion: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  windowWidth: PropTypes.number.isRequired,
  toggleSideBar: PropTypes.func.isRequired,
  modalItemId: PropTypes.string,
  onModalClose: PropTypes.func,
  navigateToQuestionEdit: PropTypes.func,
  setCategory: PropTypes.func.isRequired,
  setTab: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  selectedTab: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  testName: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
  toggleModalAction: PropTypes.string.isRequired,
  isTestFlow: PropTypes.bool.isRequired,
  itemDetails: PropTypes.object.isRequired,
  convertToMultipart: PropTypes.func.isRequired,
  convertToPassageWithQuestions: PropTypes.func.isRequired,
}

Container.defaultProps = {
  modalItemId: undefined,
  onModalClose: () => {},
  navigateToQuestionEdit: () => {},
}

export default enhance(Container)
