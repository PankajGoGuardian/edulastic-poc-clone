import React, { useEffect, useState } from 'react'
// import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import { Progress } from 'antd'

import { aws } from '@edulastic/constants'
import { uploadToS3 } from '@edulastic/common/src/helpers'
import StyledDropZone from '../../assessment/components/StyledDropZone'

const ScanScore = () => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState([])

  useEffect(() => {
    console.log('uploadedFiles =>', uploadedFiles)
  }, [uploadedFiles])

  const handleProgress = (progressInfo) => {
    const { loaded: uploaded, total } = progressInfo
    const _progress = Math.floor((uploaded / total) * 100)
    setProgress(_progress)
  }

  const handleCancelUpload = (obj) => {
    console.log(obj)
  }

  const handleDrop = async ([file]) => {
    setUploading(true)
    try {
      const fileUri = await uploadToS3(
        file,
        aws.s3Folders.DEFAULT,
        handleProgress,
        handleCancelUpload
      )
      if (fileUri) {
        setUploadedFiles([...uploadedFiles, { uri: fileUri, name: file.name }])
      }
    } catch (error) {
      console.log(error)
    }
    setUploading(false)
  }

  const handleLength = (str) => {
    if (str.length > 60) return `${str.substring(0, 58)}...`
    return str
  }

  return (
    <Dropzone
      onDrop={handleDrop}
      accept="image/*, application/pdf"
      className="dropzone"
      activeClassName="active-dropzone"
      multiple={false}
    >
      {({ getRootProps, getInputProps, isDragActive, fileRejections }) => (
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'dropzone--isActive' : ''}`}
        >
          <input {...getInputProps()} />

          <StyledDropZone
            isDragActive={isDragActive}
            thumb={null}
            dropzoneSettings={{
              name: 'File',
              allowedFiles: 'PDF, PNG, JPG, GIF',
            }}
          >
            {/* {props.selectedFiles.length > 0
               ?<ul>
                  <h1>Selected Files:</h1>
                  {props.selectedFiles.map(file => (
                     <li key={file.path}>
                        {handleLength(file.path)} - {file.size} bytes
                     </li>
                  ))}
               </ul>  
               : null
            } */}
            {/* {(uploadedFiles || []).length > 0 ? (
              <ul>
                <h1>Uploaded Files:</h1>
                {uploadedFiles.map((uploadedFile) => (
                  <li key={uploadedFile.file.name}>
                    {handleLength(uploadedFile.file.name)} -{' '}
                    {uploadedFile.file.size} bytes
                  </li>
                ))}
              </ul>
            ) : null} */}
            {/* {fileRejections.length > 0 ? (
              <ul>
                <br />
                <h1>Rejected Files:</h1>
                {fileRejections.map((file) => (
                  <li key={file.path}>
                    {handleLength(file.path)} - {file.size} bytes
                  </li>
                ))}
              </ul>
            ) : null} */}
            <Progress
              strokeColor={{ from: '#108ee9', to: '#87d068' }}
              percent={progress}
              status="active"
            />
          </StyledDropZone>
        </div>
      )}
    </Dropzone>
  )
}

export default ScanScore

// export default connect((state) => {}, {})(ScanScore)
