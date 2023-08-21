import { white } from '@edulastic/colors'
import { EduElse, EduIf, EduThen } from '@edulastic/common'
import IconMagicWand from '@edulastic/icons/src/IconMagicWand'
import React, { useState } from 'react'
import connect from 'react-redux/es/connect/connect'
import { compose } from 'redux'
import SelectGroupModal from '../../../TestPage/components/AddItems/SelectGroupModal'
import { getStandardsListSelector } from '../../../src/selectors/dictionaries'
import AiTestBanner from './CreateAiTestBanner'
import { CreateAiTestModal } from './CreateAiTestModal'
import { aiTestActions } from './ducks'
import { useSaveForm } from './hooks/useSaveForm'
import { AiEduButton } from './styled'

const EduAIQuiz = ({
  test,
  addItems,
  aiTestStatus,
  getAiGeneratedTestItems,
  resetTestDetails,
  standardsList,
}) => {
  const {
    selectSectionVisible,
    setSelectSectionVisible,
    isVisible,
    onCreateItems,
    onCancel,
    handleFieldDataChange,
    handleAiFormSubmit,
    aiFormContent,
    handleChangeStandard,
    updateAlignment,
  } = useSaveForm({
    hasSections: test?.hasSections,
    getAiGeneratedTestItems,
    addItemsView: false,
    resetTestDetails,
    standardsList,
    addItems,
  })

  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0)
  const handleSelectGroupResponse = (groupIndex) => {
    if (groupIndex > -1) {
      setSelectedGroupIndex(groupIndex)
      onCreateItems(false)
    } else {
      setSelectSectionVisible(false)
    }
  }

  return (
    <>
      <EduIf condition={addItems}>
        <EduThen>
          <AiEduButton margin="0 5px" aiStyle onClick={onCreateItems}>
            <IconMagicWand fill={`${white}`} />
            Create Items Using AI
          </AiEduButton>
        </EduThen>
        <EduElse>
          <AiTestBanner onCreateItems={onCreateItems} />
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
  connect(
    (state) => ({
      aiTestStatus: state?.aiTestDetails?.status,
      standardsList: getStandardsListSelector(state),
    }),
    {
      getAiGeneratedTestItems: aiTestActions.getAiGeneratedTestItems,
      resetTestDetails: aiTestActions.resetTestDetails,
    }
  )
)
export default enhance(EduAIQuiz)
