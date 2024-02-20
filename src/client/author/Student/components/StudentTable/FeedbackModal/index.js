import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  EduButton,
  FlexContainer,
  RadioGrp,
  RadioBtn,
  SelectInputStyled,
  notification,
} from '@edulastic/common'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import { Form, Select, Spin } from 'antd'
import { debounce, difference, differenceBy, isEmpty, uniqBy } from 'lodash'
import { feedbackApi, userApi } from '@edulastic/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons'
import { roleuser } from '@edulastic/constants'
import { formatName } from '@edulastic/constants/reportUtils/common'
import {
  ModalTitle,
  StudentNameContainer,
  StyledFormItem,
  StyledModal,
  RadioBtnWrapper,
  StyledInfoText,
  StyledTextArea,
  StyledAnchor,
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
import { getCurrentTerm } from '../../../../src/selectors/user'

const { Option } = Select

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
    defaultTermId,
    isWLRReport = false,
  } = props

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedSharedWith, setSelectedSharedWith] = useState(
    isEditFlow ? feedbackStudent.sharedWith.type : SHARE_TYPES_VALUES.EVERYONE
  )
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
        if (feedbackStudent.classId) {
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
            },
            givenTo: {
              email: feedbackStudent.email,
              role: feedbackStudent.role,
              firstName: feedbackStudent.firstName,
              lastName: feedbackStudent.lastName,
              _id: feedbackStudentId,
            },
            termId,
          })
        } else {
          setData(
            oldData?.map((doc) =>
              doc._id === feedbackStudentId ? { ...doc, ...data } : doc
            )
          )
        }
        const response = isEditFlow
          ? await feedbackApi.editFeedback(feedbackStudentId, data)
          : await feedbackApi.addFeedback(feedbackStudentId, data)
        if (response.error) {
          throw new Error(response.error)
        }
        if (
          !isEditFlow &&
          response.result &&
          response.result._id &&
          !isEmpty(oldData)
        ) {
          setData([...oldData, response.result])
        }
        onClose()
        notification({
          type: 'success',
          msg: `Feedback ${isEditFlow ? 'Edited' : 'Added'} Successfully`,
        })
      } catch (responseErr) {
        notification({
          type: 'error',
          msg: `Unable to save feedback`,
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

  const showFeedbackHistoryLink = !isEditFlow && !isWLRReport

  return (
    <StyledModal
      visible={!!feedbackStudentId}
      onCancel={handleClose}
      closable={!isSubmitting}
      centered
      footer={
        <FlexContainer justifyContent="center">
          <EduButton disabled={isSubmitting} onClick={handleSubmit}>
            Save Changes
          </EduButton>
        </FlexContainer>
      }
      title={
        <ModalTitle>
          <div>{isEditFlow ? 'Edit' : 'Add'} Feedback</div>
          {showFeedbackHistoryLink && (
            <StyledAnchor
              href={`/author/reports/whole-learner-report/student/${feedbackStudentId}?subActiveKey=feedback&termId=${
                termId || defaultTermId
              }`}
            >
              <FontAwesomeIcon icon={faEnvelopeOpenText} /> Feedback History{' '}
            </StyledAnchor>
          )}
        </ModalTitle>
      }
    >
      <Form
        form={form}
        hideRequiredMark
        layout="vertical"
        onSubmit={handleSubmit}
      >
        <StudentNameContainer>
          Student Name : <span>{student?.name}</span>
        </StudentNameContainer>
        <StyledFormItem labelAlign="left" label="Feedback Type">
          {form.getFieldDecorator('type', {
            rules: [
              {
                required: true,
                message: 'Type is required',
              },
            ],
            ...(isEditFlow ? { initialValue: feedbackStudent.type } : {}),
          })(
            <Select
              size="large"
              placeholder="Select feedback type"
              getPopupContainer={(e) => e.parentNode}
              style={{ width: '50%' }}
            >
              {FEEDBACK_TYPES.map((ft) => (
                <Option key={ft} value={ft}>
                  {ft}
                </Option>
              ))}
            </Select>
          )}
        </StyledFormItem>
        <StyledFormItem label="Feedback">
          {form.getFieldDecorator('feedback', {
            rules: [
              {
                required: true,
                message: 'Feedback required',
              },
              {
                max: 500,
                message: 'Feedback should be max 500 characters',
              },
              {
                min: 10,
                message: 'Feedback should be min 10 characters',
              },
            ],
            ...(isEditFlow ? { initialValue: feedbackStudent.feedback } : {}),
          })(
            <StyledTextArea
              placeholder="Enter feedback here"
              autoFocus
              maxLength={500}
              autoSize={{
                minRows: 3,
                maxRows: 10,
              }}
            />
          )}
        </StyledFormItem>
        <StyledFormItem labelAlign="left" label="Feedback visibility">
          {form.getFieldDecorator('sharedType', {
            rules: [
              {
                required: true,
              },
            ],
            initialValue: selectedSharedWith,
          })(
            <RadioBtnWrapper>
              <RadioGrp value={selectedSharedWith}>
                {Object.keys(SHARE_TYPES_VALUES).map((key) => (
                  <RadioBtn
                    value={SHARE_TYPES_VALUES[key]}
                    key={SHARE_TYPES_VALUES[key]}
                    onClick={() =>
                      setSelectedSharedWith(SHARE_TYPES_VALUES[key])
                    }
                  >
                    {SHARE_TYPES_DISPLAY_TEXT[key]}
                  </RadioBtn>
                ))}
              </RadioGrp>
              <StyledInfoText>
                {
                  SHARE_TYPES_INFO_TEXT[
                    SHARE_TYPES_VALUE_TO_KEY_MAP[selectedSharedWith]
                  ]
                }
              </StyledInfoText>
            </RadioBtnWrapper>
          )}
        </StyledFormItem>
        {selectedSharedWith === SHARE_TYPES_VALUES.INDIVIDUAL ? (
          <>
            <StyledFormItem>
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
                  placeholder="Select Users"
                  mode="multiple"
                  size="large"
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
          </>
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
    defaultTermId: getCurrentTerm(state),
  }))
)

export default enhance(FeedbackModal)
