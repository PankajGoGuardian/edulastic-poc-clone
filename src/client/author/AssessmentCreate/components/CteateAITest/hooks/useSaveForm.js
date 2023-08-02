import { notification } from 'antd'
import { isEmpty } from 'lodash'
import { useState } from 'react'

const initialAiFormData = {
  testName: '',
  itemTypes: '',
  numberOfItems: '',
  grades: [],
  subjects: [],
  dok: [],
  difficulty: [],
  description: '',
}

export const useSaveForm = (getAiGeneratedTestItems, createItems) => {
  const [isVisible, setIsVisible] = useState(false)
  const [aiFormContent, setAiFromContent] = useState(initialAiFormData)

  const onCreateItems = () => {
    setIsVisible(true)
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

  const handleAiFormSubmit = () => {
    const {
      testName,
      itemTypes,
      numberOfItems,
      subjects,
      grades,
    } = aiFormContent

    if (isEmpty(testName) && !createItems) {
      return notification({
        type: 'warn',
        messageKey: 'pleaseEnterName',
      })
    }

    if (isEmpty(itemTypes)) {
      return notification({
        type: 'warn',
        messageKey: 'itemTypesEmpty',
      })
    }

    if (
      numberOfItems === null ||
      (+numberOfItems < 1 && +numberOfItems > 100)
    ) {
      return notification({
        type: 'warn',
        messageKey: 'pleaseProvideValidNumberOfItems',
      })
    }

    if (isEmpty(grades)) {
      return notification({
        type: 'warn',
        messageKey: 'gradeFieldEmpty',
      })
    }

    if (isEmpty(subjects)) {
      return notification({
        type: 'warn',
        messageKey: 'subjectFieldEmpty',
      })
    }

    getAiGeneratedTestItems(aiFormContent)
  }

  return {
    isVisible,
    onCreateItems,
    onCancel,
    handleFieldDataChange,
    aiFormContent,
    resetAiFormData,
    handleAiFormSubmit,
  }
}
