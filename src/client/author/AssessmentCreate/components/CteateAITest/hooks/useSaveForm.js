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

export const useSaveForm = () => {
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

  return {
    isVisible,
    onCreateItems,
    onCancel,
    handleFieldDataChange,
    aiFormContent,
    resetAiFormData,
  }
}
