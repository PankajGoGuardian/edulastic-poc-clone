import React, { useEffect, useRef, useCallback, useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'
import { aws, fileTypes } from '@edulastic/constants'
import {
  EduButton,
  FlexContainer,
  PortalSpinner,
  FileIcon,
  formatFileSize,
  notification,
  uploadToS3,
} from '@edulastic/common'
import { cardTitleColor, linkColor1, themeColor } from '@edulastic/colors'
import { IconClose } from '@edulastic/icons'
import {
  toggleRefMaterialAction,
  isEnabledRefMaterialSelector,
  getTestsCreatingSelector,
} from '../../TestPage/ducks'

const allowedFiles = [
  fileTypes.PDF,
  fileTypes.PNG,
  fileTypes.JPEG,
  fileTypes.JPG,
]

const folder = aws.s3Folders.DEFAULT

const MAX_SIZE = 2 * 1024 * 1024 // 2 MB
// const reference = {
//   name: 'bird.png',
//   size: 532360,
//   source: 'file path',
//   type: 'image/png',
// }

export const withRefMaterial = (WrappedComponent) => {
  const hocComponent = (props) => {
    const {
      setData,
      enableUpload,
      premium,
      disabled,
      referenceDocAttributes,
      toggleRefMaterial,
      creating,
    } = props

    const hasRefMaterial = !isEmpty(referenceDocAttributes)

    const inputRef = useRef()
    const [isUploading, setIsUploading] = useState(false)

    const onChooseFile = useCallback((evt) => {
      if (inputRef.current) {
        inputRef.current.click()
        evt.target.blur()
      }
    }, [])

    const handleChangeFile = async (evt) => {
      const { files } = evt.target
      const fileToUpload = files[0]
      inputRef.current.value = ''

      if (fileToUpload) {
        try {
          const { name, size, type } = fileToUpload
          if (!allowedFiles.includes(type)) {
            notification({ messageKey: 'fileTypeErr' })
            return
          }
          if (size > MAX_SIZE) {
            notification({ messageKey: 'imageSizeError' })
            return
          }
          setIsUploading(true)
          const uri = await uploadToS3(fileToUpload, folder)
          if (typeof setData === 'function') {
            setData({ name, size, source: uri, type })
          }
        } catch (error) {
          console.log(error)
        }
        setIsUploading(false)
      }
    }

    const handleToggleSwitch = (checked) => {
      toggleRefMaterial(checked)
    }

    const handRemoveFile = () => {
      setData({})
    }

    useEffect(() => {
      if (hasRefMaterial && !disabled) {
        toggleRefMaterial(true)
      }

      return () => {
        if (!disabled) {
          toggleRefMaterial(false)
        }
      }
    }, [disabled])

    useEffect(() => {
      if (disabled) {
        return
      }

      if (enableUpload && creating && !hasRefMaterial) {
        toggleRefMaterial(false)
      }
      if (!premium && hasRefMaterial) {
        setData({})
        toggleRefMaterial(false)
      }
    }, [disabled, creating, enableUpload, premium, hasRefMaterial])

    return (
      <WrappedComponent
        {...props}
        onChangeSwitch={handleToggleSwitch}
        hasRefMaterial={hasRefMaterial}
      >
        {!hasRefMaterial && enableUpload && premium && (
          <FlexContainer
            mt="16px"
            justifyContent="flex-start"
            alignItems="center"
          >
            <EduButton height="28px" mr="24px" ml="0px" onClick={onChooseFile}>
              UPLOAD FILE
            </EduButton>
            <NormalText>PNG, JPG, PDF (Max 2MB)</NormalText>
          </FlexContainer>
        )}
        {hasRefMaterial && (
          <FlexContainer
            mt="16px"
            justifyContent="flex-start"
            alignItems="center"
          >
            <FileIcon type={referenceDocAttributes?.type} />
            <FileName>{referenceDocAttributes.name}</FileName>
            <NormalText>
              {formatFileSize(referenceDocAttributes.size)}
            </NormalText>
            {!disabled && (
              <CloseIcon
                width={12}
                height={12}
                role="presentation"
                onClick={handRemoveFile}
              />
            )}
          </FlexContainer>
        )}
        <UploadInput
          multiple
          type="file"
          ref={inputRef}
          onChange={handleChangeFile}
          accept={allowedFiles.join()}
        />
        {isUploading && <PortalSpinner />}
      </WrappedComponent>
    )
  }

  return connect(
    (state) => ({
      creating: getTestsCreatingSelector(state),
      enableUpload: isEnabledRefMaterialSelector(state),
    }),
    {
      toggleRefMaterial: toggleRefMaterialAction,
    }
  )(hocComponent)
}

const UploadInput = styled.input`
  display: none;
`

const NormalText = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${cardTitleColor};
`

const CloseIcon = styled(IconClose)`
  fill: ${linkColor1};
  margin-left: 24px;
`

const FileName = styled.span`
  color: ${themeColor};
  font-size: 13px;
  font-weight: 600;
  margin: 0px 24px;
`
