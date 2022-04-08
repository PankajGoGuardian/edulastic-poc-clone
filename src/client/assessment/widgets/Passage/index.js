import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { compose } from 'redux'
import { connect } from 'react-redux'
import get from 'lodash/get'

import { Paper } from '@edulastic/common'
import { white, boxShadowDefault } from '@edulastic/colors'
import { withNamespaces } from '@edulastic/localization'
import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'
import { replaceVariables } from '../../utils/variables'

import { ContentArea } from '../../styled/ContentArea'

import PassageView from './PassageView'
import Details from './Details'

import { saveUserWorkAction, clearUserWorkAction } from '../../actions/userWork'
import { setTextHighlightedAction } from '../../../common/components/Scratchpad/duck'

const EmptyWrapper = styled.div``

// Do not change id here
const PassageWrapper = styled(Paper).attrs(() => ({
  id: 'passage-wrapper',
  className: 'passage-wrapper',
}))`
  border-radius: ${({ flowLayout }) => (flowLayout ? 0 : 10)}px;
  background: ${({ flowLayout }) => (flowLayout ? 'transparent' : white)};
  box-shadow: ${({ flowLayout }) =>
    flowLayout ? 'unset' : `0 3px 10px 0 ${boxShadowDefault}`};
  position: relative;
  text-align: justify;
  word-break: break-word;
`

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
  setTextHighlighted,
  ...restProps
}) => {
  const Wrapper = smallSize ? EmptyWrapper : PassageWrapper
  const itemForPreview = useMemo(() => replaceVariables(item), [item])
  if (view === 'edit') {
    return (
      <ContentArea>
        <Details
          item={item}
          fillSections={fillSections}
          cleanSections={cleanSections}
          setQuestionData={setQuestionData}
        />
      </ContentArea>
    )
  }

  if (view === 'preview') {
    return (
      <Wrapper flowLayout={flowLayout}>
        <PassageView
          preview
          item={itemForPreview}
          flowLayout={flowLayout}
          setQuestionData={setQuestionData}
          setTextHighlighted={setTextHighlighted}
          {...restProps}
        />
      </Wrapper>
    )
  }
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
      setTextHighlighted: setTextHighlightedAction,
    }
  )
)

const PassageContainer = enhance(Passage)

export { PassageContainer as Passage }
