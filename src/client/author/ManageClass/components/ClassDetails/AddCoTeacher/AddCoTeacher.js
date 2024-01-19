import { groupApi } from '@edulastic/api'
import {
  CustomModalStyled,
  EduButton,
  notification,
  SelectInputStyled,
} from '@edulastic/common'
import { Select } from 'antd'
import { debounce, get, isNull, isArray } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { setClassAction } from '../../../ducks'
import { getUserIdSelector, getUserOrgId } from '../../../../src/selectors/user'
import { receiveTeachersListAction } from '../../../../Teacher/ducks'
import { Description, Title } from './styled'
import { fetchUsersListAction } from '../../../../sharedDucks/userDetails'
import { getFormattedName } from '../../../../Gradebook/transformers'
import Tags from '../../../../src/components/common/Tags'

class AddCoTeacher extends React.Component {
  constructor() {
    super()
    this.state = {
      coTeacherId: null,
      searchText: '',
    }
  }

  onChangeHandler = (id) => {
    this.setState((prevState) => ({
      ...prevState,
      coTeacherId: id,
    }))
  }

  onSearchHandler = debounce((value) => {
    const searchText = value.trim()
    this.setState({
      searchText,
    })
    if (searchText.length < 1) return
    const { getUsers } = this.props
    const searchBody = {
      limit: 50,
      page: 1,
      type: 'INDIVIDUAL',
      search: {
        role: ['teacher'],
        searchString: searchText,
        status: 1,
      },
    }
    getUsers(searchBody)
  }, 1000)

  onAddCoTeacher = debounce(() => {
    const { coTeacherId } = this.state
    const { setClass } = this.props
    if (isNull(coTeacherId)) {
      notification({ messageKey: 'pleaseSelectCoTeacher' })
      return
    }
    const { handleCancel, selectedClass, addCoTeacherToGroups } = this.props
    if (isArray(selectedClass)) {
      const groupIds = selectedClass.map(
        (_selectedClass) => `${_selectedClass._id}`
      )
      addCoTeacherToGroups({ groupIds, coTeacherId })
    } else {
      const { _id: classId } = selectedClass

      groupApi
        .addCoTeacher({
          groupId: classId,
          coTeacherId,
        })
        .then((data) => {
          if (data.groupData) {
            setClass(data.groupData)
            notification({
              type: 'success',
              messageKey: 'coTeacherAddedSuccessfully',
            })
            handleCancel()
          }
        })
        .catch((err) => {
          notification({ msg: err.response.data.message })
        })
    }
  }, 1000)

  render() {
    const {
      isOpen,
      handleCancel,
      primaryTeacherId,
      teachers,
      type,
      userInfo,
      selectedClass,
    } = this.props
    const { searchText } = this.state
    const coTeachers = teachers.filter(
      (teacher) =>
        teacher._id !== primaryTeacherId &&
        (teacher.firstName?.includes(searchText) ||
          teacher.email?.includes(searchText))
    )
    const notFoundText = searchText.length
      ? 'No result found'
      : 'Please enter 3 or more characters'
    const title = (
      <Title>
        <label>Add Co-Teacher</label>
      </Title>
    )

    const footer = (
      <>
        <EduButton
          height="32px"
          onClick={this.onAddCoTeacher}
          data-cy="addCoTeacherButton"
        >
          Add
        </EduButton>
        <EduButton height="32px" onClick={handleCancel}>
          Cancel
        </EduButton>
      </>
    )

    return (
      <CustomModalStyled
        title={title}
        visible={isOpen}
        footer={footer}
        onCancel={() => handleCancel()}
        destroyOnClose
        textAlign="left"
      >
        <Description>
          Invite your colleagues to view and manage your{' '}
          {type === 'class' ? 'class' : 'group'}. Co-teachers can manage
          enrollment, assign the Test and view reports of your{' '}
          {type === 'class' ? 'class(es)' : 'group(s)'}.
          {Array.isArray(selectedClass) ? (
            <Tags
              tags={selectedClass.map((_class) => _class._source.name)}
              showTitle
              isGrayTags
              show={5}
              margin="0px"
              labelStyle={{ marginBottom: 3 }}
            />
          ) : null}
        </Description>
        <SelectInputStyled
          data-cy="searchCoTeacher"
          placeholder="Search teacher by name, email or username."
          showSearch
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          onChange={this.onChangeHandler}
          notFoundContent={notFoundText}
          onSearch={this.onSearchHandler}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          style={{ width: '100%', marginTop: '10px' }}
        >
          {coTeachers.map(
            (el, index) =>
              userInfo.email !== el.email && (
                <Select.Option key={index} value={el._id}>
                  <div>
                    <span style={{ fontSize: '14px' }}>
                      {getFormattedName(el.firstName, el.lastName)}
                    </span>
                    <span style={{ fontSize: '12px' }}>
                      {` (${el.email || el.username})`}
                    </span>
                  </div>
                </Select.Option>
              )
          )}
        </SelectInputStyled>
      </CustomModalStyled>
    )
  }
}

export default connect(
  (state) => ({
    userOrgId: getUserOrgId(state),
    userInfo: get(state.user, 'user', {}),
    primaryTeacherId: getUserIdSelector(state),
    teachers: get(state, 'authorUserList.usersList', []).map(
      ({ _source: { email, firstName, lastName }, _id }) => ({
        email,
        firstName,
        lastName,
        _id,
      })
    ),
  }),
  {
    loadTeachers: receiveTeachersListAction,
    setClass: setClassAction,
    getUsers: fetchUsersListAction,
  }
)(AddCoTeacher)

AddCoTeacher.propTypes = {
  handleCancel: PropTypes.func.isRequired,
  teachers: PropTypes.array.isRequired,
  isOpen: PropTypes.bool,
}

AddCoTeacher.defaultProps = {
  isOpen: false,
}
