import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { upperFirst, isEmpty } from 'lodash'

// components
import { Spin, Select, Input } from 'antd'
import { CheckboxLabel, EduButton, notification } from '@edulastic/common'
import { IconClever, IconClose } from '@edulastic/icons'
import {
  StyledSelect,
  ClassListModal,
  ModalClassListTable,
  InstitutionSelectWrapper,
} from './styled'

// constants
import selectsData from '../../../TestPage/components/common/selectsData'

const { allGrades, allSubjects } = selectsData

const ClassSelectModal = ({
  type,
  visible,
  onSubmit,
  onCancel,
  loading,
  syncedIds = [],
  classListToSync,
  courseList,
  getStandardsListBySubject,
  refreshPage,
  allowedInstitutions,
  defaultGrades = [],
  defaultSubjects = [],
  existingGroups = [],
}) => {
  const [classListData, setClassListData] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [institutionId, setInstitutionId] = useState('')
  const [coTeacherFlag, setCoTeacherFlag] = useState(true)
  // set classListData
  useEffect(() => {
    if (type === 'clever') {
      setClassListData(
        classListToSync.map((c, index) => {
          const data = {
            name: c.name,
            key: index,
            cleverId: c.id,
            standards: [],
            standardSets: [],
            disabled: syncedIds.includes(c.id),
          }
          if (syncedIds.includes(c.id)) {
            const group = existingGroups.find((o) => o.cleverId === c.id)
            c.grades = group ? group.grades : defaultGrades
            c.subject = group ? group.subject : defaultSubjects[0]
            return {
              ...data,
              subject: c.subject,
              grades: c.grades,
              disabled: syncedIds.includes(c.id),
            }
          }
          return {
            ...data,
            subject: defaultSubjects[0],
            grades: defaultGrades,
            disabled: false,
          }
        })
      )
      setSelectedRows(classListToSync.map((c, i) => i))
    }
    if (type === 'googleClassroom') {
      const syncedClassCoTeacherFlag = []
      setClassListData(
        (classListToSync || []).map((c, index) => {
          if (!c.grades) {
            c.grades = defaultGrades
          }
          if (!c.subject) {
            c.subject = defaultSubjects[0]
          }
          if (c.googleCode && c.active === 1) {
            syncedClassCoTeacherFlag.push(!!c.syncGoogleCoTeacher)
          }
          return {
            ...c,
            key: index,
            disabled: syncedIds.includes(c.enrollmentCode),
          }
        })
      )
      setSelectedRows(classListToSync.map((c, i) => i))
      if (
        !isEmpty(syncedClassCoTeacherFlag) &&
        !(
          syncedClassCoTeacherFlag.includes(true) &&
          syncedClassCoTeacherFlag.includes(false)
        )
      ) {
        setCoTeacherFlag(syncedClassCoTeacherFlag[0])
      }
    }
  }, [classListToSync])

  useEffect(() => {
    if (allowedInstitutions?.length === 1) {
      setInstitutionId(allowedInstitutions[0].institutionId)
    }
  }, [allowedInstitutions])

  const handleClassListSync = () => {
    const classList = classListData.filter((each, index) =>
      selectedRows.includes(index)
    )
    if (!classList?.length) {
      notification({ messageKey: 'pleaseSelectAClass' })
    } else if (type === 'googleClassroom' && !institutionId) {
      notification({ messageKey: 'pleaseSelectAnInstitution' })
    } else {
      const classDataList = classList.map((o) => {
        if (!o.googleCode) {
          o.syncGoogleCoTeacher = coTeacherFlag
        }
        return o
      })
      onSubmit({ classList: classDataList, institutionId, refreshPage })
      onCancel()
    }
  }

  const onCoTeacherChange = ({ target }) => {
    setCoTeacherFlag(target.checked)
  }

  const getColumns = () => {
    const width = type === 'googleClassroom' ? '15%' : '20%'
    const googleCode =
      type === 'googleClassroom'
        ? [
            {
              title: <b>GOOGLE CLASS CODE</b>,
              key: 'enrollmentCode',
              width,
              dataIndex: 'enrollmentCode',
              align: 'left',
            },
          ]
        : []

    return [
      ...googleCode,
      {
        title: <b>CLASS NAME</b>,
        key: 'name',
        width,
        dataIndex: 'name',
        align: 'center',
        render: (data, row, index) => (
          <Input
            title={data}
            value={data}
            disabled={row.disabled}
            onChange={(e) => {
              const classList = [...classListData]
              classList[index].name = e.target.value
              setClassListData(classList)
            }}
          />
        ),
      },
      {
        title: <b>GRADE</b>,
        key: 'grades',
        width,
        dataIndex: 'grades',
        align: 'center',
        render: (data, row, index) => (
          <StyledSelect
            value={data || defaultGrades}
            mode="multiple"
            placeholder="Select Grades"
            disabled={row.disabled}
            onChange={(grades) => {
              const classList = [...classListData]
              classList[index].grades = grades
              setClassListData(classList)
            }}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          >
            {allGrades.map((grade) => (
              <Select.Option value={grade.value} key={grade.value}>
                {grade.text}
              </Select.Option>
            ))}
          </StyledSelect>
        ),
      },
      {
        title: <b>SUBJECT</b>,
        key: 'subject',
        width,
        dataIndex: 'subject',
        align: 'center',
        render: (data, row, index) => (
          <StyledSelect
            style={{ minWidth: '80px' }}
            value={data || defaultSubjects[0]}
            placeholder="Select Subject"
            disabled={row.disabled}
            onChange={(subject) => {
              const classList = [...classListData]
              classList[index].subject = upperFirst(subject)
              classList[index].standards = []
              classList[index].standardSets = []
              setClassListData(classList)
            }}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          >
            {allSubjects.map(
              (subject) =>
                subject.value && (
                  <Select.Option value={subject.value} key={subject.value}>
                    {subject.text}
                  </Select.Option>
                )
            )}
          </StyledSelect>
        ),
      },
      {
        title: <b>STANDARDS</b>,
        key: 'standards',
        width,
        dataIndex: 'standards',
        align: 'center',
        render: (data, row, index) => {
          const standardsList = getStandardsListBySubject(
            row.subject || defaultSubjects[0]
          )
          return (
            <StyledSelect
              showSearch
              filterOption={(input, option) => {
                if (
                  option.props.children &&
                  typeof option.props.children === 'string'
                )
                  return (
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  )

                return false
              }}
              mode="multiple"
              value={data}
              placeholder="Select Standards"
              disabled={row.disabled}
              onChange={(standards) => {
                const classList = [...classListData]
                classList[index].standards = standards
                classList[index].standardSets = standardsList
                  .filter((s) => standards.includes(s.value))
                  .map(({ value, text }) => ({ _id: value, name: text }))
                setClassListData(classList)
              }}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {standardsList.map(({ value, text, disabled }) => (
                <Select.Option value={value} key={value} disabled={disabled}>
                  {!value.toString().includes('-') ? (
                    text
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '2px',
                        borderRadius: '20px',
                        backgroundColor: 'rgba(0, 0, 0, 0.65)',
                      }}
                    />
                  )}
                </Select.Option>
              ))}
            </StyledSelect>
          )
        },
      },
      {
        title: <b>COURSE</b>,
        key: 'course',
        width,
        dataIndex: 'courseId',
        align: 'center',
        render: (data, row, index) => (
          <StyledSelect
            showSearch
            style={{
              width: '100%',
              maxWidth: '170px',
              minWidth: '75px',
            }}
            labelInValue
            filterOption={(input, option) => {
              if (
                option.props.children &&
                typeof option.props.children === 'string'
              )
                return (
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                )

              return false
            }}
            value={(data && { key: data }) || {}}
            placeholder="Select Course"
            disabled={row.disabled}
            onChange={(course) => {
              const classList = [...classListData]
              classList[index].courseId = course.key
              if (type === 'clever') {
                classList[index].course = course.key
              } else if (type === 'googleClassroom') {
                classList[index].course = {
                  id: course.key,
                  name: course.label,
                }
              }
              setClassListData(classList)
            }}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          >
            {(courseList || []).map((course) => (
              <Select.Option value={course._id} key={course._id}>
                {course.name}
              </Select.Option>
            ))}
          </StyledSelect>
        ),
      },
    ]
  }

  const InstitutionSelection = () => (
    <InstitutionSelectWrapper>
      <label>
        We found the account is linked to multiple Institutions. Please select
        the one for synced classes.
      </label>
      <StyledSelect
        width="170px"
        showSearch
        filterOption={(input, option) => {
          if (
            option.props.children &&
            typeof option.props.children === 'string'
          )
            return (
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            )

          return false
        }}
        placeholder="Select Institution"
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        value={institutionId}
        onChange={(value) => setInstitutionId(value)}
      >
        {allowedInstitutions.map((i) => (
          <Select.Option key={i.institutionId}>
            {i.institutionName}
          </Select.Option>
        ))}
      </StyledSelect>
    </InstitutionSelectWrapper>
  )

  const disableImport = isEmpty(selectedRows)

  return (
    <ClassListModal
      visible={visible}
      onCancel={onCancel}
      centered
      title={
        <>
          <div>
            {type === 'clever' && (
              <IconClever
                height={20}
                width={20}
                style={{ position: 'absolute', left: '20px' }}
              />
            )}
            <span>
              Import Classes and Students from{' '}
              {type === 'clever' ? 'Clever' : 'Google'}
            </span>
            <IconClose
              height={20}
              width={20}
              onClick={onCancel}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <p>
            The following classes will be imported from your{' '}
            {type === 'clever' ? 'Clever' : 'Google Classroom'} account.
          </p>
          <p>
            Please enter/update class name, grade and subject to import and
            create classes in Edulastic. Once import is successful, Students
            accounts will be automatically created in Edulastic.
          </p>
          {type === 'googleClassroom' && allowedInstitutions.length > 1 && (
            <InstitutionSelection />
          )}
          {type === 'googleClassroom' && (
            <CheckboxLabel
              style={{ margin: '10px 0px 20px 0px' }}
              checked={coTeacherFlag}
              onChange={onCoTeacherChange}
            >
              Enroll Co-Teacher (All teachers present in Google classroom will
              share the same class)
            </CheckboxLabel>
          )}
        </>
      }
      footer={[
        <EduButton isGhost onClick={onCancel}>
          CANCEL
        </EduButton>,
        <EduButton
          onClick={handleClassListSync}
          loading={loading}
          disabled={disableImport}
        >
          Sync
        </EduButton>,
      ]}
    >
      {loading ? (
        <Spin />
      ) : (
        <ModalClassListTable
          columns={getColumns()}
          dataSource={classListData}
          bordered
          rowSelection={{
            selectedRowKeys: selectedRows,
            onChange: setSelectedRows,
            getCheckboxProps: (row) => ({
              disabled: row.disabled,
              name: row.name,
            }),
          }}
          pagination={{
            defaultPageSize: classListData?.length || 10,
            hideOnSinglePage: true,
          }}
        />
      )}
    </ClassListModal>
  )
}

ClassSelectModal.propTypes = {
  type: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  syncedIds: PropTypes.array.isRequired,
  classListToSync: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}
ClassSelectModal.defaultProps = {
  loading: false,
}

export default ClassSelectModal
