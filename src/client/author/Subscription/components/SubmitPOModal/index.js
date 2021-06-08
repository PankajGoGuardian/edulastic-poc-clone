import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Radio, message } from 'antd'
import produce from 'immer'
import { aws } from '@edulastic/constants'
import { IconUpload } from '@edulastic/icons'
import { dragDropUploadText } from '@edulastic/colors'
import {
  CustomModalStyled,
  EduButton,
  FlexContainer,
  notification,
  uploadToS3,
} from '@edulastic/common'
import {
  getUserFullNameSelector,
  getUserOrgData,
} from '../../../src/selectors/user'
import {
  slice,
  getRequestOrSubmitActionStatus,
  getSubscriptionSelector,
} from '../../ducks'
import {
  ModalTitle,
  Label,
  StyledInputTextArea,
} from '../RequestInvoviceModal/styled'
import { Container } from '../RequestQuoteModal/styled'
import { getUserDetails } from '../../../../student/Login/ducks'
import { StyledDragger, StyledInputNumber } from './styled'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'

const getFooterComponent = ({ handleSubmit, isSubmitPOActionPending }) => (
  <AuthorCompleteSignupButton
    renderButton={(handleClick) => (
      <EduButton
        loading={isSubmitPOActionPending}
        fontSize="14px"
        width="200px"
        height="48px"
        onClick={handleClick}
        inverse
      >
        SUBMIT
      </EduButton>
    )}
    onClick={handleSubmit}
  />
)

const SubmitPOModal = ({
  visible = false,
  onCancel = () => {},
  userOrgData = {},
  isSubmitPOActionPending = false,
  handleSubmitPO = () => {},
  userFullname,
  userDetails,
}) => {
  const [licenseType, setLicenseType] = useState('Enterprise')
  const [otherInfo, setOtherInfo] = useState()
  const [studentLicenseCount, setStudentLicenseCount] = useState()
  const [attachments, setAttachments] = useState({})
  const [fileList, setFilesList] = useState([])
  const [totalAttachmentsSize, setTotalAttachmentsSize] = useState(0)

  const onLicenseTypeChange = (e) => setLicenseType(e.target.value)
  const handleicenseCountChange = (value) => {
    const re = /^[0-9\b]+$/
    if (!re.test(value)) {
      return
    }
    setStudentLicenseCount(value)
  }
  const handleSetOtherInfo = (e) => setOtherInfo(e.target.value)

  const validateFields = () => {
    if (!studentLicenseCount) {
      notification({
        type: 'warning',
        msg: 'Please specify the # of licenses.',
      })
      return false
    }
    if (!Object.values(attachments).length) {
      notification({
        type: 'warning',
        msg: 'Please upload atleast one Purchase Order.',
      })
      return false
    }
    return true
  }

  const resetFields = () => {
    setLicenseType('Enterprise')
    setOtherInfo(undefined)
    setStudentLicenseCount(undefined)
    setAttachments({})
    setFilesList([])
    setTotalAttachmentsSize(0)
  }

  const handleSubmit = () => {
    if (!validateFields()) {
      return false
    }
    const school = userOrgData?.schools?.[0]
    const { districtName, districtId } = userOrgData?.districts?.[0] || {}
    const district = {
      _id: districtId,
      name: districtName,
    }
    const reqPayload = {
      userFullname,
      userEmail: userDetails.email,
      school,
      district,
      otherInfo,
      licenseType,
      studentLicenseCount,
      attachments: Object.values(attachments),
    }
    handleSubmitPO({
      reqPayload,
      closeCallback: () => {
        resetFields()
        onCancel()
      },
    })
  }

  const validateFileUpload = (file) => {
    if (!file) return 'No file found.'
    if (
      ![
        'doc',
        'docx',
        'msword',
        'vnd',
        'wordprocessingml',
        'pdf',
        'image',
      ].some((x) => file.type.includes(x))
    ) {
      return 'Unsupported file format.'
    }
    const { size = 0 } = file || {}
    const sizeInMegaByte = parseInt((size / (1024 * 1024)).toFixed(2), 10)

    if (sizeInMegaByte > 10 || totalAttachmentsSize + sizeInMegaByte > 10)
      return 'Max file upload limit is upto 10MB.'
    setTotalAttachmentsSize(totalAttachmentsSize + sizeInMegaByte)
    return false
  }

  const uploadProps = {
    name: 'file',
    onChange: async (info) => {
      let hideLoader = () => {}
      try {
        const { file, fileList: _fileList = [] } = info
        const fileExists = _fileList.find((x) => x.uid === file.uid)
        if (fileExists) {
          const validitionError = validateFileUpload(file)
          if (validitionError) {
            notification({
              type: 'warn',
              msg: validitionError,
            })
            return
          }
          hideLoader = message.loading('Uploading...', 0)
          const fileUrl = await uploadToS3(file, aws.s3Folders.PO_SUBMISSIONS)
          setAttachments((x) => ({ ...x, [file.uid]: fileUrl }))
          setFilesList((x) => [...x, file])
          notification({
            type: 'success',
            msg: 'File Uploaded Successfully.',
          })
        } else {
          setFilesList((x) => x.filter((y) => y.uid !== file.uid))
          setAttachments(
            produce(attachments, (draft) => {
              delete draft[file.uid]
              return draft
            })
          )
        }
      } catch (e) {
        console.log(e)
        notification({
          msg: 'Failed Uploading PO.',
        })
      } finally {
        hideLoader()
      }
    },
    beforeUpload: () => false,
    accept:
      '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,image/*',
    multiple: false,
    showUploadList: true,
    fileList,
    onRemove: (file) => {
      setFilesList((x) => x.filter((y) => y.uid !== file.uid))
      setAttachments(
        produce(attachments, (draft) => {
          delete draft[file.uid]
          return draft
        })
      )
    },
  }

  return (
    <CustomModalStyled
      width="580px"
      visible={visible}
      title={<ModalTitle>Submit a Purchase Order</ModalTitle>}
      onCancel={onCancel}
      footer={[
        getFooterComponent({
          handleSubmit,
          isSubmitPOActionPending,
        }),
      ]}
      centered
    >
      <Container width="500">
        <Label mb="-2px">PO For</Label>
        <FlexContainer width="330px" flexDirection="column">
          <Radio.Group onChange={onLicenseTypeChange} value={licenseType}>
            <Radio value="Enterprise">Enterprise</Radio>
            <Radio value="Teacher Premium">Teacher Premium</Radio>
          </Radio.Group>
        </FlexContainer>

        <FlexContainer
          width="100%"
          alignItems="center"
          justifyContent="flex-start"
        >
          <Label width="220px" required>
            # Student Licenses{' '}
          </Label>{' '}
        </FlexContainer>
        <StyledInputNumber
          min={1}
          step={1}
          type="number"
          placeholder="Add the # of licenses"
          value={studentLicenseCount}
          onChange={handleicenseCountChange}
        />

        <Label>Addons or other comments</Label>
        <StyledInputTextArea
          rows={4}
          placeholder="What other products are being purchased with this PO?"
          value={otherInfo}
          onChange={handleSetOtherInfo}
        />

        <Label>Upload PO</Label>
        <StyledDragger {...uploadProps}>
          <div className="ant-upload-drag-icon">
            <IconUpload width="36" height="36" color={dragDropUploadText} />
          </div>
          <div className="ant-upload-text">DRAG &amp; DROP YOUR FILE</div>
          <div className="ant-upload-hint">
            OR <span>BROWSE</span> PNG, JPG, GIF (TOTAL 10MB MAX.)
          </div>
        </StyledDragger>
      </Container>
    </CustomModalStyled>
  )
}

export default connect(
  (state) => ({
    userOrgData: getUserOrgData(state),
    isSubmitPOActionPending: getRequestOrSubmitActionStatus(state),
    userSubscription: getSubscriptionSelector(state),
    userFullname: getUserFullNameSelector(state),
    userDetails: getUserDetails(state),
  }),
  {
    handleSubmitPO: slice.actions.submitPOAction,
  }
)(SubmitPOModal)
