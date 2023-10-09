import React, { useEffect, useRef } from 'react'
import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import { FlexContainer } from '@edulastic/common'
import ProgressBar from './ProgressBar'

const FilesView = ({
  files,
  hideDelete,
  onDelete,
  cols,
  mt,
  disableLink,
  openAttachmentViewModal = false,
}) => {
  const contRef = useRef()
  if (isEmpty(files)) {
    return null
  }

  useEffect(() => {
    if (contRef.current) {
      setTimeout(() => {
        contRef.current?.setAttribute('tabindex', 0)
        contRef.current.focus()
      }, 10)
    }
  }, [contRef])

  return (
    <FlexContainer
      ref={contRef}
      flexWrap="wrap"
      justifyContent="flex-start"
      mt={mt}
      tabIndex="0"
      width="100%"
    >
      {files.map((f, i) => (
        <ProgressBar
          data={f}
          key={i}
          onCancel={onDelete}
          index={i}
          hidebar
          hideDelete={hideDelete}
          cols={cols}
          disableLink={disableLink}
          openAttachmentViewModal={openAttachmentViewModal}
        />
      ))}
    </FlexContainer>
  )
}

FilesView.propTypes = {
  files: PropTypes.array,
  onDelete: PropTypes.func,
  cols: PropTypes.number,
  hideDelete: PropTypes.bool,
  mt: PropTypes.string,
}

FilesView.defaultProps = {
  files: [],
  onDelete: () => null,
  cols: 2,
  mt: '',
  hideDelete: false,
}

export default FilesView
