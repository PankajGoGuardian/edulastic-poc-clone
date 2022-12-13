import React, { memo, useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { compose } from 'redux'
import { connect } from 'react-redux'

import { withNamespaces } from '@edulastic/localization'

import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'
import { replaceVariables } from '../../utils/variables'

import { ContentArea } from '../../styled/ContentArea'

import AdvancedOptions from './components/AdvancedOptions'
import VideoPreview from './VideoPreview'
import VideoPlayer from './VideoPlayer'
import { StyledPaperWrapper } from '../../styled/Widget'

const EmptyWrapper = styled.div``

const Video = ({
  item,
  view,
  smallSize,
  setQuestionData,
  t,
  fillSections,
  cleanSections,
  advancedAreOpen,
  advancedLink,
  ...restProps
}) => {
  const Wrapper = smallSize ? EmptyWrapper : StyledPaperWrapper
  const itemForPreview = useMemo(() => replaceVariables(item), [item])

  if (view === 'edit') {
    return (
      <ContentArea>
        <VideoPlayer
          item={item}
          fillSections={fillSections}
          cleanSections={cleanSections}
        />

        {advancedLink}

        <AdvancedOptions
          t={t}
          item={item}
          fillSections={fillSections}
          cleanSections={cleanSections}
          advancedAreOpen={advancedAreOpen}
          setQuestionData={setQuestionData}
        />
      </ContentArea>
    )
  }

  return (
    <Wrapper>
      <VideoPreview item={itemForPreview} {...restProps} />
    </Wrapper>
  )
}

Video.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    videoType: PropTypes.string.isRequired,
    sourceURL: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    transcript: PropTypes.string.isRequired,
    uiStyle: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      posterImage: PropTypes.string.isRequired,
      captionURL: PropTypes.string.isRequired,
      hideControls: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
  view: PropTypes.string.isRequired,
  smallSize: PropTypes.bool,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedLink: PropTypes.any,
  advancedAreOpen: PropTypes.bool,
}

Video.defaultProps = {
  smallSize: false,
  advancedLink: null,
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {},
}

const enhance = compose(
  withNamespaces('assessment'),
  memo,
  connect(null, { setQuestionData: setQuestionDataAction })
)

const VideoContainer = enhance(Video)

export { VideoContainer as Video }
