import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  EduButton,
  FlexContainer,
  SelectInputStyled,
  notification,
  EduIf,
  EduThen,
  EduElse,
} from '@edulastic/common'
import Progress from '@edulastic/common/src/components/Progress'
import loadable from '@loadable/component'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import { Form, Select, Spin, Divider, Tooltip } from 'antd'
import { debounce, difference, differenceBy, isEmpty, uniqBy } from 'lodash'
import { feedbackApi, userApi } from '@edulastic/api'
import { roleuser } from '@edulastic/constants'
import { formatName } from '@edulastic/constants/reportUtils/common'
import { IconEmptyProfile, IconEye } from '@edulastic/icons'
import {
  ModalTitle,
  StudentInfoContainer,
  StyledFormItem,
  StyledModal,
  StyledImg,
  StyledStudentName,
  StyledSelect,
  StyledObservationTypeSelect,
} from './styled'
import { getUserDetails } from '../../../../../student/Login/ducks'
import {
  FEEDBACK_TYPES,
  SHARE_TYPES,
  SHARE_TYPES_VALUES,
  SHARE_TYPES_VALUE_TO_KEY_MAP,
  SHARE_TYPES_DISPLAY_TEXT,
  SHARE_TYPES_INFO_TEXT,
} from './constants'

const { Option } = Select

const FroalaEditor = loadable(() =>
  import(
    /* webpackChunkName: "froalaCommonChunk" */ '@edulastic/common/src/components/FroalaEditor'
  )
)

const FeedbackModal = (props) => {
  const {
    form,
    feedbackStudentId,
    onClose,
    feedbackStudent,
    currentUser,
    isEditFlow = false,
    setData,
    data: oldData,
    termId,
  } = props

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFetchingUsers, setIsFetchingUsers] = useState(false)
  const [userList, setUserList] = useState(
    isEditFlow ? feedbackStudent.sharedWith.users : []
  )
  const [sharedUserList, setSharedUserList] = useState(
    isEditFlow ? feedbackStudent.sharedWith.users : []
  )
  const [searchText, setSearchText] = useState('')

  const student = useMemo(() => {
    if (isEmpty(feedbackStudent)) return null
    const fullName = formatName(
      [feedbackStudent.firstName, '', feedbackStudent.lastName],
      { lastNameFirst: false }
    )
    return {
      ...feedbackStudent,
      name: fullName || '-',
    }
  }, [feedbackStudent])

  useEffect(() => {
    form.resetFields()
    setIsSubmitting(false)
  }, [student])

  useEffect(() => {
    if (isEditFlow && feedbackStudent?.feedback) {
      form.setFieldsValue({
        feedback: feedbackStudent.feedback,
      })
    }
  }, [isEditFlow, feedbackStudent?.feedback])

  const handleClose = () => {
    if (!isSubmitting) onClose()
  }

  const handleSubmit = () => {
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) return
      try {
        setIsSubmitting(true)
        const { sharedType, type, feedback } = values
        const data = {
          sharedWith: {
            type: sharedType,
            users: sharedUserList,
          },
          type,
          feedback,
        }
        if (feedbackStudent.classId && !isEditFlow) {
          Object.assign(data, { classId: feedbackStudent.classId })
        }
        if (!isEditFlow) {
          Object.assign(data, {
            givenBy: {
              _id: currentUser._id,
              role: currentUser.role,
              firstName: currentUser.firstName,
              lastName: currentUser.lastName,
              email: currentUser.email,
              ...(currentUser.thumbnail
                ? { thumbnail: currentUser.thumbnail }
                : {}),
            },
            givenTo: {
              email: feedbackStudent.email,
              role: feedbackStudent.role,
              firstName: feedbackStudent.firstName,
              lastName: feedbackStudent.lastName,
              _id: feedbackStudentId,
              ...(feedbackStudent.thumbnail
                ? { thumbnail: feedbackStudent.thumbnail }
                : {}),
            },
            termId,
          })
        }
        const response = isEditFlow
          ? await feedbackApi.editFeedback(feedbackStudentId, data)
          : await feedbackApi.addFeedback(feedbackStudentId, data)
        if (response.error) {
          throw new Error(response.error)
        }
        if (response?.result?._id && setData) {
          const existingData = oldData || []
          if (isEditFlow) {
            setData([
              response.result,
              ...existingData.filter((o) => o._id !== response.result._id),
            ])
          } else {
            setData([response.result, ...existingData])
          }
        }
        onClose()
        notification({
          type: 'success',
          msg: `Observation ${isEditFlow ? 'Edited' : 'Added'} Successfully`,
        })
      } catch (responseErr) {
        notification({
          type: 'error',
          msg: `Unable to save observation`,
        })
      } finally {
        setIsSubmitting(false)
      }
    })
  }

  const fetchUsers = async (searchString) => {
    try {
      const searchBody = {
        limit: 10,
        page: 1,
        type: SHARE_TYPES.INDIVIDUAL,
        search: {
          role: ['teacher', 'school-admin', 'district-admin'],
          searchString,
          status: 1,
        },
      }
      const {
        result: { data },
      } = await userApi.fetchUsersForShare(searchBody)
      const filteredUserList = data.filter(
        (user) => user._id !== currentUser._id
      )

      if (!isEmpty(data)) {
        let _users = differenceBy(
          filteredUserList,
          sharedUserList,
          (user) => user._id
        )
        _users = uniqBy(_users, (o) => o._id).map((o) => ({
          _id: o._id,
          ...o._source,
        }))
        setUserList(_users)
      } else {
        setUserList([])
      }
    } catch (e) {
      setUserList([])
      console.warn(e)
    } finally {
      setIsFetchingUsers(false)
    }
  }

  const handleUsersFetch = useCallback(debounce(fetchUsers, 800), [
    feedbackStudentId,
  ])

  const handleUsersSearch = (searchString) => {
    setSearchText(searchString)
    if (searchString.length < 3) return
    setIsFetchingUsers(true)
    handleUsersFetch(searchString)
  }

  const handleOnChange = (selectedSharedUserIds) =>
    setSharedUserList((prevState) => {
      const existingSelectedUser = prevState.filter(({ _id }) =>
        selectedSharedUserIds.includes(_id)
      )
      const [newSharedUserId] = difference(
        selectedSharedUserIds,
        existingSelectedUser.map(({ _id }) => _id)
      )
      const newUser = userList.find((user) => user._id === newSharedUserId)
      return [...existingSelectedUser, ...(newUser ? [newUser] : [])]
    })

  const notFoundText =
    searchText.length < 3
      ? 'Please enter 3 or more characters'
      : 'No result found'

  const selectedSharedWith = form.getFieldValue('sharedType')

  return (
    <StyledModal
      visible={!!feedbackStudentId}
      onCancel={handleClose}
      closable={!isSubmitting}
      centered
      footer={null}
      title={
        <>
          <ModalTitle>
            <div>{isEditFlow ? 'Edit' : 'Add'} Observation</div>
          </ModalTitle>
          <Divider />
        </>
      }
      modalWidth="700px"
      modalMinHeight="660px"
    >
      <Form
        form={form}
        hideRequiredMark
        layout="vertical"
        onSubmit={handleSubmit}
      >
        <FlexContainer justifyContent="space-between" alignItems="center">
          <FlexContainer alignItems="center" maxWidth="50%" marginLeft="10px">
            <EduIf condition={student.thumbnail}>
              <EduThen>
                <StyledImg src={student.thumbnail} />
              </EduThen>
              <EduElse>
                <IconEmptyProfile height="50" width="50" />
              </EduElse>
            </EduIf>
            <StudentInfoContainer>
              <Tooltip title={student.name}>
                <StyledStudentName>{student.name}</StyledStudentName>
              </Tooltip>
            </StudentInfoContainer>
          </FlexContainer>
          <div style={{ width: '40%' }}>
            <StyledFormItem labelAlign="left">
              {form.getFieldDecorator('type', {
                rules: [
                  {
                    required: true,
                    message: 'Type is required',
                  },
                ],
                ...(isEditFlow ? { initialValue: feedbackStudent.type } : {}),
              })(
                <StyledObservationTypeSelect
                  size="large"
                  placeholder="Observation type"
                  getPopupContainer={(e) => e.parentNode}
                  style={{ width: '100%' }}
                >
                  {FEEDBACK_TYPES.map((ft) => (
                    <Option key={ft} value={ft}>
                      {ft}
                    </Option>
                  ))}
                </StyledObservationTypeSelect>
              )}
            </StyledFormItem>
          </div>
        </FlexContainer>
        <div style={{ marginTop: '48px' }}>
          <StyledFormItem labelAlign="left">
            {form.getFieldDecorator('feedback', {
              rules: [
                {
                  required: true,
                  message: 'Observation is required',
                },
                {
                  max: 500,
                  message: 'Observation should be max 500 characters',
                },
                {
                  min: 10,
                  message: 'Observation should be min 10 characters',
                },
              ],
              ...(isEditFlow ? { initialValue: feedbackStudent.feedback } : {}),
            })(
              <div>
                <FroalaEditor
                  fallback={<Progress />}
                  placeholder="Type observation here"
                  value={form.getFieldValue('feedback') || ''}
                  allowQuickInsert={false}
                  buttons={[
                    'bold',
                    'italic',
                    'underline',
                    'align',
                    '|',
                    'formatOL',
                    'formatUL',
                    '|',
                    'subscript',
                    'superscript',
                  ]}
                  heightMin="300px"
                  heightMax="300px"
                  toolbarId="toolbarId"
                  onChange={(value) =>
                    form.setFieldsValue({
                      feedback: value,
                    })
                  }
                  border="border"
                  toolbarInline
                  toolbarVisibleWithoutSelection
                />
              </div>
            )}
          </StyledFormItem>
        </div>
        <FlexContainer justifyContent="space-between" alignItems="center">
          <FlexContainer
            justifyContent="flex-start"
            alignItems="center"
            marginLeft="-18px"
          >
            <StyledFormItem labelAlign="left">
              {form.getFieldDecorator('sharedType', {
                rules: [
                  {
                    required: true,
                  },
                ],
                ...(isEditFlow
                  ? { initialValue: feedbackStudent.sharedWith.type }
                  : { initialValue: SHARE_TYPES_VALUES.ME }),
              })(
                <StyledSelect
                  size="large"
                  getPopupContainer={(e) => e.parentNode}
                >
                  {Object.keys(SHARE_TYPES_VALUES).map((shareType) => (
                    <Option
                      key={SHARE_TYPES_VALUES[shareType]}
                      value={SHARE_TYPES_VALUES[shareType]}
                    >
                      <FlexContainer
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <IconEye
                          style={{ marginRight: '5px', marginLeft: '10px' }}
                        />
                        {SHARE_TYPES_DISPLAY_TEXT[shareType]}
                      </FlexContainer>
                    </Option>
                  ))}
                </StyledSelect>
              )}
            </StyledFormItem>
            <div style={{ marginTop: '-10px', marginLeft: '-14px' }}>
              {
                SHARE_TYPES_INFO_TEXT[
                  SHARE_TYPES_VALUE_TO_KEY_MAP[selectedSharedWith]
                ]
              }
            </div>
          </FlexContainer>
          <EduIf
            condition={selectedSharedWith !== SHARE_TYPES_VALUES.INDIVIDUAL}
          >
            <EduButton disabled={isSubmitting} onClick={handleSubmit} mr="10px">
              Save
            </EduButton>
          </EduIf>
        </FlexContainer>
        {selectedSharedWith === SHARE_TYPES_VALUES.INDIVIDUAL ? (
          <FlexContainer
            justifyContent="space-between"
            alignItems="center"
            mt="-20px"
          >
            <StyledFormItem style={{ flex: 5 }}>
              {form.getFieldDecorator('sharedWithUsers', {
                rules: [
                  {
                    required: true,
                    message: 'Atleast one user is required',
                  },
                ],
                ...(isEditFlow
                  ? { initialValue: sharedUserList.map((o) => o._id) }
                  : {}),
              })(
                <SelectInputStyled
                  data-cy="addUsersInputField"
                  placeholder="Enter email ids here"
                  mode="multiple"
                  size="large"
                  height="60px"
                  notFoundContent={notFoundText}
                  filterOption={false}
                  onSearch={handleUsersSearch}
                  value={sharedUserList.map((o) => o._id)}
                  onChange={handleOnChange}
                  getPopupContainer={(e) => e.parentNode}
                  defaultActiveFirstOption={false}
                >
                  {isFetchingUsers ? (
                    <SelectInputStyled.Option
                      key="loader"
                      style={{ height: '30px' }}
                    >
                      <Spin />
                    </SelectInputStyled.Option>
                  ) : (
                    userList.map((item) => (
                      <SelectInputStyled.Option value={item._id} key={item._id}>
                        <span>
                          {formatName([item.firstName, item.lastName], {
                            lastNameFirst: false,
                          })}
                          ({item.email}){' '}
                          <b>[{roleuser.ROLE_LABEL[item.role]}]</b>
                        </span>
                      </SelectInputStyled.Option>
                    ))
                  )}
                </SelectInputStyled>
              )}
            </StyledFormItem>
            <EduButton
              disabled={isSubmitting}
              onClick={handleSubmit}
              style={{ flex: 1, marginTop: '-7px' }}
              mr="10px"
            >
              Save
            </EduButton>
          </FlexContainer>
        ) : null}
      </Form>
    </StyledModal>
  )
}

const enhance = compose(
  withNamespaces('manageDistrict'),
  Form.create(),
  connect((state) => ({
    currentUser: getUserDetails(state),
  }))
)

export default enhance(FeedbackModal)
