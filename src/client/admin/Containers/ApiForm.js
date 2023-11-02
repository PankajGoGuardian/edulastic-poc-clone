import React, { useState } from 'react'
import { Alert, Select } from 'antd'
import { EduIf, notification } from '@edulastic/common'
import { adminApi, groupApi, enrollmentApi } from '@edulastic/api'

import { flatten } from 'mathjs/src/utils/array'
import { regexJs } from '@edulastic/constants'
import { apiForms } from '../Data/apiForm'
import ApiFormsMain from '../Components/ApiForm'

import { submit } from '../Components/ApiForm/apis'
import CreateAdmin from '../Components/CreateAdmin'
import CreateInsightAdmins from '../Components/CreateInsightsAdmins'
import ActivateDeactivateUser from '../Components/ActivateDeactivateUser'
import UpdateUser from '../Components/UpdateUser'
import ApproveOrganisation from '../Components/ApproveOrganisation'
import UpdateCoTeacher from '../../author/ManageClass/components/ClassDetails/UpdateCoTeacher/UpdateCoTeacher'
import UploadStandard from '../Components/StandardUpload'
import { emailRegex } from '../../common/utils/helpers'
import EnableDataTypes from '../Components/EnableDataTypes'

const CREATE_ADMIN = 'create-admin'
const CREATE_INSIGHTS_ADMINS = 'create-insights-admins'
const ARCHIVE_UNARCHIVE_CLASSES = 'archive-unarchive-classes'
const ACTIVATE_DEACTIVATE_USER = 'activate-deactivate-user'
const UPDATE_USER = 'update-user'
const APPROVE_SCHOOL_DISTRICT = 'approve-school-district'
const INVITE_TEACHER = 'invite-teacher'
const CONNECT_DISCONNECT_USER = 'connect-disconnect-user'
const ENABLE_DATA_TYPES = 'enable-feed-types'
const API_OPTIONS = {
  manageClass: 'manageClass',
}
const UPLOAD_STANDARD = 'upload-standard'

const ApiForm = () => {
  const [id, setId] = useState()
  const [districtData, setDistrictData] = useState(null)
  const [userData, setUserData] = useState([])
  const [orgData, setOrgData] = useState(null)
  const [showUpdateCoTeacher, setShowUpdateCoTeacher] = useState(false)
  const [selectedClass, setSelectedClass] = useState([])
  const [fileUploadData, setFileUploadData] = useState([])
  const [invalidIds, setInvalidIds] = useState([])
  const handleOnChange = (_id) => setId(_id)
  const getFormattedData = (arr) => {
    return arr.length > 1
      ? `${arr.slice(0, arr.length - 1).join(', ')} and ${arr[arr.length - 1]}`
      : arr.join(', ')
  }
  let option = apiForms.find((ar) => ar.id === id)
  const handleClassSearch = async ({ classId }) => {
    if (regexJs.validMongoId.test(classId)) {
      try {
        await enrollmentApi.fetch(classId).then((response) => {
          if (response && response.group) {
            setSelectedClass(response.group)
            return setShowUpdateCoTeacher(true)
          }
          throw new Error('No results found')
        })
      } catch (e) {
        notification({
          type: 'warning',
          msg: 'No results found',
        })
      }
    } else {
      notification({
        type: 'warning',
        msg: 'Sorry, No search results found for this ID',
      })
    }
  }
  const handleOnSave = (data, sectionId) => {
    const isSlowApi = option.slowApi || false
    if (id === API_OPTIONS.manageClass) {
      return handleClassSearch(data, sectionId)
    }
    if (option.id === ARCHIVE_UNARCHIVE_CLASSES) {
      groupApi
        .archiveUnarchiveClasses({
          archive: data.archive,
          groupIds: data.groupIds,
        })
        .then((res) => {
          notification({ type: res?.type || 'success', msg: res?.message })
        })
        .catch((e) => {
          if (e.status === 400) {
            notification({ type: 'warn', msg: 'Enter a valid groupId' })
          } else {
            notification({ type: 'warn', msg: e.message })
          }
        })
    } else if (
      option.id === CREATE_ADMIN ||
      option.id === CREATE_INSIGHTS_ADMINS
    ) {
      adminApi.searchUpdateDistrict({ id: data.districtId }).then((res) => {
        if (res?.data?.length) {
          setDistrictData(res.data[0])
        } else {
          notification({ msg: res?.result?.message || 'District not found' })
        }
      })
    } else {
      if (id === 'delta-sync') {
        option = apiForms.find((ar) => ar.id === id)
        option =
          (option.customSections || []).find((o) => o.id === sectionId) ||
          option
        data = option.fields.reduce((acc, o) => {
          if (data[o.name]) {
            acc[o.name] = data[o.name]
          }
          return acc
        }, {})
      } else if (id === 'tts') {
        const idRegex = new RegExp(/^[0-9a-fA-F]{24}$/)
        if (!idRegex.test(data.testId)) {
          notification({
            type: 'warning',
            msg: 'Invalid test id.',
            messageKey: 'apiFormSucc',
          })
          return
        }
      } else if (id === 'invite-teacher') {
        const districtIdRegex = new RegExp(/^[0-9a-fA-F]{24}$/)
        if (!districtIdRegex.test(data.districtId)) {
          notification({
            type: 'warning',
            msg: 'Invalid district Id.',
            messageKey: 'apiFormSucc',
          })
          return
        }
        const isValidEmails = data.userDetails.every((_email) =>
          emailRegex.test(_email)
        )
        if (!isValidEmails) {
          notification({
            type: 'warning',
            msg: 'Invalid email Id.',
            messageKey: 'apiFormSucc',
          })
          return
        }
        const endPoint = option.endPoint.split('/')
        option.endPoint = `/user/${data.districtId}/${
          endPoint[endPoint.length - 1]
        }`
      } else if (id === 'verify-email' || id === 'reset-password-attempt') {
        const idRegex = new RegExp(/^[0-9a-fA-F]{24}$/)
        const value = id === 'verify-email' ? data.uid : data.userId
        if (!idRegex.test(value)) {
          notification({
            type: 'warning',
            msg: 'Invalid user Id.',
            messageKey: 'apiFormErr',
          })
          return
        }
      }
      submit(data, option.endPoint, option.method, isSlowApi).then((res) => {
        if (res?.result) {
          if (res.result.success || res.status === 200) {
            if (
              option.id === ACTIVATE_DEACTIVATE_USER ||
              option.id === UPDATE_USER
            ) {
              setUserData(res.result)
              if (!res.result.length) {
                notification({
                  type: 'warning',
                  msg: 'Sorry, No user(s) found for this username',
                })
              }
            } else if (option.id === CONNECT_DISCONNECT_USER) {
              const invalidUserIds = res?.data?.invalidUsers
              setInvalidIds(invalidUserIds)
              if (invalidUserIds?.length) {
                notification({
                  type: 'warning',
                  msg: res?.result,
                })
              } else {
                notification({
                  type: 'success',
                  msg: res?.result,
                })
              }
            } else if (option.id === APPROVE_SCHOOL_DISTRICT) {
              setOrgData(res.result)
            } else if (option.id === INVITE_TEACHER) {
              const alreadyExistsInDistrict = []
              const inValidEmails = []
              for (const _user of res.result) {
                if (_user.status === 'FAILED_USER_EXISTS') {
                  alreadyExistsInDistrict.push(_user.username)
                } else if (_user.status === 'FAILED_INVALID_USER_EMAIL') {
                  inValidEmails.push(_user.username)
                }
              }
              if (alreadyExistsInDistrict.length || inValidEmails.length) {
                if (alreadyExistsInDistrict.length) {
                  notification({
                    type: 'warning',
                    msg: `User(s) having email Id ${getFormattedData(
                      alreadyExistsInDistrict
                    )} is already present in the district Id`,
                  })
                }
                if (inValidEmails.length) {
                  notification({
                    type: 'warning',
                    msg: `Following user(s) have invalid email Id ${getFormattedData(
                      inValidEmails
                    )}`,
                  })
                }
              } else {
                notification({
                  type: 'success',
                  msg: res?.result?.message,
                  messageKey: 'apiFormSucc',
                })
              }
            } else {
              notification({
                type: 'success',
                msg: res?.result?.message,
                messageKey: 'apiFormSucc',
              })
            }
          } else {
            notification({
              msg: res?.result?.message,
              messageKey: 'apiFormErr',
            })
          }
        } else if (option.id === APPROVE_SCHOOL_DISTRICT) {
          notification({
            type: 'warning',
            msg: 'Sorry, No search results found for this ID',
          })
        }
      })
    }
  }

  const clearDistrictData = () => setDistrictData(null)
  const clearUserData = () => setUserData([])
  const clearOrgData = () => setOrgData(null)
  const clearStandardData = () => setFileUploadData(null)

  return (
    <div>
      <Select
        showSearch
        placeholder="Select"
        size="large"
        style={{
          width: '500px',
        }}
        onChange={handleOnChange}
        value={id}
      >
        {apiForms
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((each) => (
            <Select.Option key={each.id} value={each.id}>
              {each.name}
            </Select.Option>
          ))}
      </Select>
      {id && (
        <ApiFormsMain
          fields={
            option.fields || flatten(option.customSections.map((o) => o.fields))
          }
          name={option.name}
          handleOnSave={handleOnSave}
          note={option.note}
          customSections={option.customSections}
          id={id}
          setFileUploadData={setFileUploadData}
          endPoint={option.endPoint}
        >
          {districtData && id === CREATE_ADMIN && (
            <CreateAdmin
              districtData={districtData}
              clearDistrictData={clearDistrictData}
            />
          )}
          {districtData && id === CREATE_INSIGHTS_ADMINS && (
            <CreateInsightAdmins
              districtData={districtData}
              clearDistrictData={clearDistrictData}
            />
          )}
          {userData.length > 0 && id === ACTIVATE_DEACTIVATE_USER && (
            <ActivateDeactivateUser
              userData={userData}
              clearUserData={clearUserData}
            />
          )}
          {userData.length > 0 && id === UPDATE_USER && (
            <UpdateUser userData={userData} clearUserData={clearUserData} />
          )}
          {orgData && id === APPROVE_SCHOOL_DISTRICT && (
            <ApproveOrganisation
              orgData={orgData}
              clearOrgData={clearOrgData}
            />
          )}
          {fileUploadData && id === UPLOAD_STANDARD && (
            <UploadStandard
              standardData={fileUploadData.data}
              subject={fileUploadData.subject}
              clearStandardData={clearStandardData}
            />
          )}
          {id === ENABLE_DATA_TYPES && <EnableDataTypes />}
        </ApiFormsMain>
      )}
      {showUpdateCoTeacher && (
        <UpdateCoTeacher
          isOpen={showUpdateCoTeacher}
          selectedClass={selectedClass}
          handleCancel={() => setShowUpdateCoTeacher(false)}
        />
      )}

      <EduIf condition={invalidIds?.length > 0}>
        <Alert
          type="error"
          message={
            <>
              <h2>Invalid User ids:</h2>
              <ul>
                {invalidIds?.map((invalidId, i) => (
                  <li key={i}>{invalidId}</li>
                ))}
              </ul>
            </>
          }
        />
      </EduIf>
    </div>
  )
}

export default ApiForm
