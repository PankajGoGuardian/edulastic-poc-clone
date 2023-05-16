import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { EduIf } from '@edulastic/common'
import { compose } from 'redux'
import { connect } from 'react-redux'
import get from 'lodash/get'
import { withNamespaces } from '@edulastic/localization'
import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'

import PassageView from './components/PassageView'
import PassageDetails from './components/PassageDetails'
import { EmptyWrapper, PassageWrapper } from './components/styled-components'

import { saveUserWorkAction, clearUserWorkAction } from '../../actions/userWork'
import { replaceVariables } from '../../utils/variables'

import { ContentArea } from '../../styled/ContentArea'

const Passage = ({
  item,
  view,
  smallSize,
  setQuestionData,
  t,
  fillSections,
  cleanSections,
  advancedAreOpen,
  flowLayout,
  isDefaultTheme = true,
  ...restProps
}) => {
  const itemForPreview = useMemo(() => replaceVariables(item), [item])
  const Wrapper = useMemo(() => {
    return smallSize ? EmptyWrapper : PassageWrapper
  }, [smallSize])

  return (
    <>
      <EduIf condition={view === 'edit'}>
        <ContentArea>
          <PassageDetails
            item={item}
            fillSections={fillSections}
            cleanSections={cleanSections}
            setQuestionData={setQuestionData}
          />
        </ContentArea>
      </EduIf>
      <EduIf condition={view === 'preview'}>
        <Wrapper flowLayout={flowLayout} isDefaultTheme={isDefaultTheme}>
          <PassageView
            preview
            item={itemForPreview}
            flowLayout={flowLayout}
            setQuestionData={setQuestionData}
            {...restProps}
          />
        </Wrapper>
      </EduIf>
    </>
  )
}

Passage.propTypes = {
  item: PropTypes.object.isRequired,
  view: PropTypes.string.isRequired,
  smallSize: PropTypes.bool,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
}

Passage.defaultProps = {
  smallSize: false,
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {},
}

function getHighlightForAuthor(state, props) {
  const { item } = props
  return get(state, `userWork.present[${item.id}]`)
}

const enhance = compose(
  withNamespaces('assessment'),
  connect(
    (state, props) => ({
      userWork: getHighlightForAuthor(state, props),
    }),
    {
      setQuestionData: setQuestionDataAction,
      saveUserWork: saveUserWorkAction,
      clearUserWork: clearUserWorkAction,
    }
  )
)

const PassageContainer = enhance(Passage)

export { PassageContainer as Passage }
