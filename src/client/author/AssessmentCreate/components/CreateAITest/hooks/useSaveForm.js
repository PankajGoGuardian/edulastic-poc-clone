import { notification } from '@edulastic/common'
import { cloneDeep, isEmpty } from 'lodash'
import { useState } from 'react'
import { segmentApi } from '@edulastic/api'
import { selectsData } from '../../../../TestPage/components/common'

export const useSaveForm = ({
  hasSections,
  getAiGeneratedTestItems,
  addItems,
  resetTestDetails,
  testTitle = '',
}) => {
  const initialAiFormData = {
    itemTypes: '',
    numberOfItems: 5,
    dok: [],
    difficulty: [],
    preference: '',
    testName: testTitle,
    alignment: [
      {
        curriculum: '',
        curriculumId: '',
        domains: [],
        grades: [],
        standards: [],
        subject: '',
      },
    ],
    standardNames: [],
  }

  const [selectSectionVisible, setSelectSectionVisible] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [aiFormContent, setAiFromContent] = useState(initialAiFormData)

  const updateAlignment = (alignment) => {
    setAiFromContent((state) => ({ ...state, alignment }))
  }

  const onCreateItems = (showSelectGroup = true) => {
    segmentApi.genericEventTrack('AIQuizCreateTestClick', {})
    resetTestDetails()
    if (addItems && showSelectGroup && hasSections) {
      setSelectSectionVisible(true)
    } else {
      setSelectSectionVisible(false)
      setIsVisible(true)
    }
  }

  const resetAiFormData = () => {
    setAiFromContent({ ...initialAiFormData })
  }

  const onCancel = () => {
    setIsVisible(false)
    resetAiFormData()
  }

  const handleFieldDataChange = (field, value) => {
    setAiFromContent({ ...aiFormContent, [field]: value })
  }

  const handleAiFormSubmit = (selectedGroupIndex = 0) => {
    const _aiFormContent = cloneDeep(aiFormContent)
    const {
      testName,
      itemType,
      numberOfItems,
      alignment,
      dok,
      difficulty,
    } = _aiFormContent

    if (isEmpty(testName) && !addItems) {
      return notification({
        type: 'warn',
        messageKey: 'pleaseEnterName',
      })
    }

    if (isEmpty(itemType)) {
      return notification({
        type: 'warn',
        messageKey: 'itemTypesEmpty',
      })
    }

    if (
      numberOfItems === null ||
      numberOfItems === '' ||
      (parseInt(numberOfItems, 10) < 1 && parseInt(numberOfItems, 10) > 20)
    ) {
      return notification({
        type: 'warn',
        messageKey: 'pleaseProvideValidNumberOfItems',
      })
    }

    if (isEmpty(alignment[0].grades)) {
      return notification({
        type: 'warn',
        messageKey: 'gradeFieldEmpty',
      })
    }

    if (isEmpty(alignment[0].subject)) {
      return notification({
        type: 'warn',
        messageKey: 'subjectFieldEmpty',
      })
    }

    if (isEmpty(alignment[0].curriculum)) {
      return notification({
        type: 'warn',
        messageKey: 'emptyStandardsSet',
      })
    }

    if (isEmpty(alignment[0].standards)) {
      return notification({
        type: 'warn',
        messageKey: 'emptyStandards',
      })
    }

    if (isEmpty(dok) || dok.some((x) => !x)) {
      _aiFormContent.dok = selectsData.allDepthOfKnowledge
        .map(({ value }) => value)
        .filter((x) => x)
    }
    if (isEmpty(difficulty) || difficulty.some((x) => !x)) {
      _aiFormContent.difficulty = selectsData.allAuthorDifficulty
        .map(({ value }) => value)
        .filter((x) => x)
    }

    getAiGeneratedTestItems({
      ..._aiFormContent,
      groupIndex: selectedGroupIndex,
    })
  }

  return {
    selectSectionVisible,
    setSelectSectionVisible,
    isVisible,
    onCreateItems,
    onCancel,
    handleFieldDataChange,
    aiFormContent,
    resetAiFormData,
    handleAiFormSubmit,
    updateAlignment,
  }
}
