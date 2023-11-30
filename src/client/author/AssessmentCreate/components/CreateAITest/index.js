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
import { AiEduButton, StyledDiv } from './styled'
import {
  clearCreatedItemsAction,
  setDefaultTestDataAction,
} from '../../../TestPage/ducks'
import FreeVideoQuizAnnouncement from '../common/FreeVideoQuizAnnouncement'
import { checkIsDateLessThanSep30 } from '../../../TestPage/utils'
import { isVideoQuizAndAIEnabledSelector } from '../../../src/selectors/user'
import AddOnTag from '../common/AddOnTag'

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

  const isDateLessThanSep30 = checkIsDateLessThanSep30()
  return (
    <>
      <EduIf condition={addItems}>
        <EduThen>
          <EduIf condition={isVideoQuizAndAIEnabled}>
            <EduThen>
              <Tooltip
                title={
                  <>
                    <p>{i18.t('author:rubric.infoText')}</p>
                    <EduIf condition={isDateLessThanSep30}>
                      <br />
                      <p>Note: This is free to use until September 30</p>
                    </EduIf>
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
        </EduThen>
        <EduElse>
          <AiTestBanner onCreateItems={onCreateItems} />
          {isDateLessThanSep30 && (
            <StyledDiv>
              <FreeVideoQuizAnnouncement
                title="AI Generated Quiz is free to use until September 30"
                history={history}
                style={{ marginTop: '10px', justifyContent: 'flex-start' }}
              />
            </StyledDiv>
          )}
        </EduElse>
      </EduIf>
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
      />
    </>
  )
}
const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      aiTestStatus: state?.aiTestDetails?.status,
      standardsList: getStandardsListSelector(state),
      isVideoQuizAndAIEnabled: isVideoQuizAndAIEnabledSelector(state),
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
