import React from 'react'
import { connect } from 'react-redux'
import { useSaveForm } from '../../../AssessmentCreate/components/CteateAITest/hooks/useSaveForm'
import { aiTestActions } from '../../../AssessmentCreate/components/CteateAITest/ducks'

const withAiItemsHOC = (Component: any) => {
  const WithAIItemsProps = (props: any) => {
    const { getAiGeneratedTestItems } = props
    const aiGeneratorProps = useSaveForm(getAiGeneratedTestItems, true)

    return <Component {...aiGeneratorProps} {...props} />
  }
  return connect(null, {
    getAiGeneratedTestItems: aiTestActions.getAiGeneratedTestItems,
  })(WithAIItemsProps)
}

export default withAiItemsHOC
