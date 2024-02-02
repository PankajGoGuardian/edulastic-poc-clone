import { white } from '@edulastic/colors'
import { EduElse, EduIf, EduThen } from '@edulastic/common'
import IconMagicWand from '@edulastic/icons/src/IconMagicWand'
import React, { useEffect } from 'react'
import qs from 'qs'
import connect from 'react-redux/es/connect/connect'
import { compose } from 'redux'
import i18 from '@edulastic/localization'
import { Tooltip } from 'antd'
import { withRouter } from 'react-router-dom'
import SelectGroupModal from '../../../TestPage/components/AddItems/SelectGroupModal'
import { getStandardsListSelector } from '../../../src/selectors/dictionaries'
import AiTestBanner from './CreateAiTestBanner'
import { CreateAiTestModal } from './CreateAiTestModal'
import { aiTestActions } from './ducks'
import { useSaveForm } from './hooks/useSaveForm'
import { AiEduButton, FullHeightAiEduButton } from './styled'
import {
  clearCreatedItemsAction,
  setDefaultTestDataAction,
} from '../../../TestPage/ducks'
import {
  isGcpsDistrictSelector,
  isVideoQuizAndAIEnabledSelector,
} from '../../../src/selectors/user'
import AddOnTag from '../common/AddOnTag'
import { CREATE_AI_TEST_DISPLAY_SCREENS } from './constants'
import CreateAiTestBannerSmall from './CreateAiTestBannerSmall'

const {
  NEW_TEST_SCREEN,
  ADD_ITEMS_SCREEN,
  CREATE_TEST_SCREEN,
  CREATE_ITEMS_SCREEN,
  SEARCH_NO_DATA_SCREEN,
} = CREATE_AI_TEST_DISPLAY_SCREENS

const EduAIQuiz = ({
  test,
  addItems,
  aiTestStatus,
  getAiGeneratedTestItems,
  resetTestDetails,
  standardsList,
  setDefaultTest,
  clearCreatedItem,
  history,
  isVideoQuizAndAIEnabled,
  currentGroupIndexValueFromStore,
  showSelectGroupIndexModal,
  isGcpsDistrict,
  displayScreen = NEW_TEST_SCREEN,
  isAIQuizFromManualAssessments = false,
}) => {
  const {
    selectSectionVisible,
    isVisible,
    onCreateItems,
    onCancel,
    handleFieldDataChange,
    handleAiFormSubmit,
    aiFormContent,
    handleChangeStandard,
    updateAlignment,
    selectedGroupIndex,
    handleSelectGroupResponse,
  } = useSaveForm({
    hasSections: test?.hasSections,
    getAiGeneratedTestItems,
    addItemsView: false,
    resetTestDetails,
    standardsList,
    addItems,
    setDefaultTest,
    clearCreatedItem,
    history,
    isVideoQuizAndAIEnabled,
    currentGroupIndexValueFromStore,
    showSelectGroupIndexModal,
    savePreselected: displayScreen === CREATE_ITEMS_SCREEN,
    isAIQuizFromManualAssessments,
  })

  const { open = '' } = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })

  useEffect(() => {
    if (open === 'aiquiz') {
      onCreateItems(undefined, 'Dashboard')
    }
  }, [])

  const EduAiAddItemsButton = (
    <AiEduButton
      aiStyle
      disabled={!isVideoQuizAndAIEnabled}
      onClick={onCreateItems}
      data-cy="createItemUsingAi"
    >
      <IconMagicWand fill={`${white}`} />
      Create Items Using AI
    </AiEduButton>
  )

  const EduAiAddItems = (
    <EduIf condition={isVideoQuizAndAIEnabled}>
      <EduThen>
        <Tooltip
          title={
            <>
              <p>{i18.t('author:rubric.infoText')}</p>
            </>
          }
        >
          {EduAiAddItemsButton}
        </Tooltip>
      </EduThen>
      <EduElse>
        <AddOnTag
          component={EduAiAddItemsButton}
          message={i18.t('author:aiSuite.addOnText')}
        />
      </EduElse>
    </EduIf>
  )

  const EduCreateAddonTag = (
    <EduIf condition={!isVideoQuizAndAIEnabled}>
      <AddOnTag message={i18.t('author:aiSuite.addOnText')} />
    </EduIf>
  )

  const EduCreateItemsWithAiButton = (
    <FullHeightAiEduButton
      aiStyle
      margin
      onClick={onCreateItems}
      data-cy="createItemsWithAi"
    >
      <IconMagicWand fill={`${white}`} />
      Create Items with AI
      {EduCreateAddonTag}
    </FullHeightAiEduButton>
  )

  const EduAiCreateTestButton = (
    <FullHeightAiEduButton
      aiStyle
      onClick={onCreateItems}
      data-cy="createTestWithAi"
    >
      <IconMagicWand fill={`${white}`} />
      Create Test with AI
      {EduCreateAddonTag}
    </FullHeightAiEduButton>
  )

  const getComponentToDisplay = (screen) => {
    switch (screen) {
      case ADD_ITEMS_SCREEN:
        return EduAiAddItems
      case NEW_TEST_SCREEN:
        return (
          <AiTestBanner
            onCreateItems={onCreateItems}
            isAIQuizFromManualAssessments={isAIQuizFromManualAssessments}
          />
        )
      case CREATE_TEST_SCREEN:
        return EduAiCreateTestButton
      case CREATE_ITEMS_SCREEN:
        return EduCreateItemsWithAiButton
      case SEARCH_NO_DATA_SCREEN:
        return <CreateAiTestBannerSmall onCreateItems={onCreateItems} />
      default:
        return <></>
    }
  }

  return (
    <EduIf condition={!isGcpsDistrict}>
      {getComponentToDisplay(displayScreen)}
      <EduIf condition={addItems}>
        <SelectGroupModal
          visible={selectSectionVisible}
          test={test}
          handleResponse={handleSelectGroupResponse}
        />
      </EduIf>
      <CreateAiTestModal
        onCancel={onCancel}
        isVisible={isVisible}
        handleFieldDataChange={handleFieldDataChange}
        handleAiFormSubmit={() => handleAiFormSubmit(selectedGroupIndex)}
        aiTestStatus={aiTestStatus}
        handleChangeStandard={handleChangeStandard}
        aiFormContent={aiFormContent}
        updateAlignment={updateAlignment}
        addItems={addItems}
        isAIQuizFromManualAssessments={isAIQuizFromManualAssessments}
      />
    </EduIf>
  )
}
const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      aiTestStatus: state?.aiTestDetails?.status,
      standardsList: getStandardsListSelector(state),
      isVideoQuizAndAIEnabled: isVideoQuizAndAIEnabledSelector(state),
      isGcpsDistrict: isGcpsDistrictSelector(state),
    }),
    {
      getAiGeneratedTestItems: aiTestActions.getAiGeneratedTestItems,
      resetTestDetails: aiTestActions.resetTestDetails,
      setDefaultTest: setDefaultTestDataAction,
      clearCreatedItem: clearCreatedItemsAction,
    }
  )
)
export default enhance(EduAIQuiz)
