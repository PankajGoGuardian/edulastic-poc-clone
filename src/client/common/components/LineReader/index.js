import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { EduButton } from '@edulastic/common'
import { IconLineReader } from '@edulastic/icons'
import useLineReader from './components/useLineReader'
import {
  showLineReaderAction,
  hideLineReaderAction,
  lineReaderVisible,
} from './duck'

const LineReader = ({
  showLineReader,
  visible,
  hideLineReader,
  btnComponent,
  btnText,
  onClick,
}) => {
  const [showReader, destoryReader] = useLineReader(hideLineReader)

  const handleClick = () => {
    if (typeof onClick === 'function') {
      onClick()
    }
    showLineReader()
  }

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

  const Button = useMemo(() => {
    if (!btnComponent) {
      return EduButton
    }
    return btnComponent
  }, [btnComponent])

  return (
    <Button
      isGhost
      IconBtn
      disabled={visible}
      data-cy="lineReaderButton"
      onClick={handleClick}
    >
      {btnText || <IconLineReader />}
    </Button>
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
