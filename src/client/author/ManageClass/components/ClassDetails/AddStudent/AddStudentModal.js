import { enrollmentApi } from '@edulastic/api'
import { CustomModalStyled, EduButton, notification } from '@edulastic/common'
import { IconAccessibility, IconUser } from '@edulastic/icons'
import { Collapse, Form, Icon, Spin } from 'antd'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { themeColor } from '@edulastic/colors'
import { getUserOrgData } from '../../../../src/selectors/user'
import { getValidatedClassDetails } from '../../../../Student/ducks'
import { fetchStudentsByIdAction } from '../../../ducks'
import AdditionalFields from './AdditionalFields'
import BasicFields from './BasicFields'
import { AddForm, PanelHeader, Title } from './styled'

const { Panel } = Collapse
class AddStudentModal extends React.Component {
  state = {
    keys: ['basic'],
    isUpdate: false,
    foundUserId: '',
    foundUserContactEmails: '',
  }

  setIsUpdate = (payload) => {
    this.setState({
      ...this.state,
      isUpdate: payload,
    })
  }

  setFounduser = (payload) => {
    this.setState({
      ...this.state,
      foundUserId: payload,
    })
  }

  setFoundContactEmails = (value) =>
    this.setState({ foundUserContactEmails: value })

  enrollStudent = async () => {
    const {
      selectedClass: { groupInfo = {} },
      orgData,
      loadStudents,
      handleCancel,
      classDetails,
    } = this.props
    let { _id: classId = '' } = groupInfo
    let { code: classCode = '' } = groupInfo
    const { districtId } = orgData
    const userId = this.state.foundUserId

    // manageClass > manageClass entity
    if (!classId && !classCode) {
      classId = classDetails?._id || ''
      classCode = classDetails?.code || ''
    }

    const data = {
      classCode,
      studentIds: [userId],
      districtId,
    }
    const res = await enrollmentApi.SearchAddEnrolMultiStudents(data)
    if (res.status == 200) {
      notification({
        type: 'success',
        messageKey: 'userAddedToclassSuccessfully',
      })
      handleCancel()
      loadStudents({ classId })
      return null
    }
    notification({ type: 'error', messageKey: 'createUserIsFailing' })
  }

  render() {
    const {
      form,
      handleCancel,
      handleAdd,
      isOpen,
      submitted,
      stds,
      isEdit,
      foundUserId,
      showClassCodeField,
      fetchClassDetailsUsingCode,
      validatedClassDetails,
      resetClassDetails,
    } = this.props

    const { keys, isUpdate } = this.state
    const {
      getFieldDecorator,
      getFieldValue,
      setFields,
      setFieldsValue,
      isFieldTouched,
      getFieldError,
    } = form
    const std = {}

    const title = (
      <Title>
        <IconUser />
        <label>{isEdit ? 'Update User' : 'Add Student'}</label>
      </Title>
    )

    const footer = (
      <>
        <EduButton isGhost onClick={handleCancel}>
          No, Cancel
        </EduButton>
        <EduButton
          data-cy="addButton"
          onClick={isUpdate ? this.enrollStudent : handleAdd}
          disabled={isFieldTouched('email') && getFieldError('email')}
        >
          {isUpdate
            ? 'Yes, Enroll Student'
            : isEdit
            ? 'Yes, Update'
            : 'Yes, Add Student'}
        </EduButton>
      </>
    )

    const expandIcon = (panelProps) =>
      panelProps.isActive ? (
        <Icon type="caret-up" />
      ) : (
        <Icon type="caret-down" />
      )

    const AdditionalDetailsHeader = (
      <PanelHeader>
        <label>Configure Additional Details</label>
      </PanelHeader>
    )
    const AccommodationsHeader = (
      <PanelHeader>
        <div className="flex">
          <IconAccessibility style={{ fill: themeColor }} />
          <label>Configure Accommodations</label>
        </div>
        <small>Set TTS, STT, IR acommodations</small>
      </PanelHeader>
    )

    return (
      <CustomModalStyled
        centered
        title={title}
        visible={isOpen}
        onCancel={handleCancel}
        footer={footer}
        textAlign="left"
      >
        <Spin spinning={submitted}>
          <AddForm>
            <BasicFields
              getFieldDecorator={getFieldDecorator}
              getFieldValue={getFieldValue}
              std={std}
              stds={stds}
              isEdit={isEdit}
              setFields={setFields}
              setFieldsValue={setFieldsValue}
              isUpdate={isUpdate}
              setIsUpdate={this.setIsUpdate}
              updateStudent={this.updateStudent}
              setFounduser={this.setFounduser}
              foundUserId={foundUserId}
              modalClose={handleCancel}
              showClassCodeField={showClassCodeField}
              fetchClassDetailsUsingCode={fetchClassDetailsUsingCode}
              validatedClassDetails={validatedClassDetails}
              resetClassDetails={resetClassDetails}
              setFoundContactEmails={this.setFoundContactEmails}
            />
            <Collapse
              accordion
              defaultActiveKey={keys}
              expandIcon={expandIcon}
              expandIconPosition="right"
            >
              <Panel header={AdditionalDetailsHeader} key="additional">
                <AdditionalFields
                  getFieldDecorator={getFieldDecorator}
                  getFieldValue={getFieldValue}
                  std={std}
                  isEdit={isEdit}
                  stds={stds}
                  foundUserContactEmails={this.state.foundUserContactEmails}
                />
              </Panel>
            </Collapse>
            <br />
            <Collapse
              accordion
              defaultActiveKey={keys}
              expandIcon={expandIcon}
              expandIconPosition="right"
            >
              <Panel header={AccommodationsHeader} key="accommodations">
                <AdditionalFields
                  type="accommodations"
                  getFieldDecorator={getFieldDecorator}
                  getFieldValue={getFieldValue}
                  std={std}
                  isEdit={isEdit}
                  stds={stds}
                  foundUserContactEmails={this.state.foundUserContactEmails}
                />
              </Panel>
            </Collapse>
          </AddForm>
        </Spin>
      </CustomModalStyled>
    )
  }
}

AddStudentModal.propTypes = {
  handleAdd: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  submitted: PropTypes.bool,
  isOpen: PropTypes.bool,
  stds: PropTypes.array,
  isEdit: PropTypes.bool,
}

AddStudentModal.defaultProps = {
  isOpen: false,
  stds: [],
  isEdit: false,
  submitted: false,
}

const AddStudentForm = Form.create({ name: 'add_student_form' })(
  AddStudentModal
)

export default connect(
  (state) => ({
    orgData: getUserOrgData(state),
    selectedClass: getValidatedClassDetails(state) || {},
    classDetails: get(state, 'manageClass.entity'),
  }),
  { loadStudents: fetchStudentsByIdAction }
)(AddStudentForm)
