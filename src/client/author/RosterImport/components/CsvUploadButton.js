import React, { useRef, useState } from 'react'
import { EduButton, FlexContainer, notification } from '@edulastic/common'
import { IconUpload } from '@edulastic/icons'
import { UploadInput } from '../../TestPage/components/Setting/components/Container/styled'
import { MAX_SIZE } from '../../../assessment/widgets/UploadFile/components/constants'

const CsvUploadButton = ({ title, addFileToUploads }) => {
  const inputRef = useRef()
  const [fileName, setFileName] = useState('')
  const onClickHandler = (e) => {
    if (inputRef.current) {
      inputRef.current.click()
      e.target.blur()
    }
  }
  const handleChange = (e) => {
    const { files } = e.target
    if (files) {
      const file = files[0]
      if (file.size > 5 * MAX_SIZE) {
        notification({ messageKey: 'fileSizeError5MB' })
        return false
      }
      addFileToUploads(file)
      setFileName(file.name)
    }
  }
  return (
    <FlexContainer mt="10px">
      <EduButton isGhost onClick={onClickHandler} width="200px">
        {fileName || title}
        <IconUpload />
      </EduButton>
      <UploadInput
        type="file"
        ref={inputRef}
        onClick={() => {}}
        onChange={handleChange}
        accept=".csv"
      />
    </FlexContainer>
  )
}
export default CsvUploadButton
