import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { EduButton } from '@edulastic/common'
// import lineReader from './components/lineReader'
import useLineReader from './components/useLineReader'
import {
  showLineReaderAction,
  hideLineReaderAction,
  lineReaderVisible,
} from './duck'

const LineReader = ({ showLineReader, visible, hideLineReader }) => {
  const [showReader, destoryReader] = useLineReader(hideLineReader)
  useEffect(() => {
    if (visible) {
      showReader()
    }
  }, [visible])

  useEffect(() => {
    return () => {
      // destory all line readers on unmount
      destoryReader()
    }
  }, [])

  return (
    <EduButton
      isGhost
      height="40px"
      disabled={visible}
      data-cy="lineReaderButton"
      onClick={showLineReader}
    >
      Line Reader
    </EduButton>
  )
}

export default connect(
  (state) => ({
    visible: lineReaderVisible(state),
  }),
  {
    showLineReader: showLineReaderAction,
    hideLineReader: hideLineReaderAction,
  }
)(LineReader)
