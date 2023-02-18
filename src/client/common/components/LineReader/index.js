import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { EduButton } from '@edulastic/common'
import { IconLineReader } from '@edulastic/icons'
import useLineReader from './components/useLineReader'
import { Tooltip } from '../../utils/helpers'
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
  hideButton,
  btnText,
  onClick,
}) => {
  const [showReader, destoryReader] = useLineReader(hideLineReader)

  const handleClick = () => {
    if (typeof onClick === 'function') {
      onClick()
    }
    if (visible) {
      destoryReader()
    } else {
      showLineReader()
    }
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
    !hideButton && (
      <Tooltip placement="top" title="Line Reader">
        <Button
          isGhost
          IconBtn
          data-cy="lineReaderButton"
          onClick={handleClick}
        >
          {btnText || <IconLineReader />}
        </Button>
      </Tooltip>
    )
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
