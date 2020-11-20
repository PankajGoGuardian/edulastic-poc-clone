import React, { useState } from 'react'
import { Select } from 'antd'
import { notification } from '@edulastic/common'
import { adminApi, groupApi, enrollmentApi } from '@edulastic/api'

import { flatten } from 'mathjs/src/utils/array'
import { regexJs } from '@edulastic/constants'
import { apiForms } from '../Data/apiForm'
import ApiFormsMain from '../Components/ApiForm'

import { submit } from '../Components/ApiForm/apis'
import CreateAdmin from '../Components/CreateAdmin'
import ActivateDeactivateUser from '../Components/ActivateDeactivateUser'
import UpdateUser from '../Components/UpdateUser'
import ApproveOrganisation from '../Components/ApproveOrganisation'
import UpdateCoTeacher from '../../author/ManageClass/components/ClassDetails/UpdateCoTeacher/UpdateCoTeacher'

const CREATE_ADMIN = 'create-admin'
const ARCHIVE_UNARCHIVE_CLASSES = 'archive-unarchive-classes'
const ACTIVATE_DEACTIVATE_USER = 'activate-deactivate-user'
const UPDATE_USER = 'update-user'
const APPROVE_SCHOOL_DISTRICT = 'approve-school-district'
const API_OPTIONS = {
  manageClass: 'manageClass',
}

const ApiForm = () => {
  const [id, setId] = useState()
  const [districtData, setDistrictData] = useState(null)
  const [userData, setUserData] = useState([])
  const [orgData, setOrgData] = useState(null)
  const [showUpdateCoTeacher, setShowUpdateCoTeacher] = useState(false)
  const [selectedClass, setSelectedClass] = useState([])
  const handleOnChange = (_id) => setId(_id)
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
    } else if (option.id === CREATE_ADMIN) {
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
      }
      submit(data, option.endPoint, option.method).then((res) => {
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
            } else if (option.id === APPROVE_SCHOOL_DISTRICT) {
              setOrgData(res.result)
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

  return (
    <div>
      <Select
        placeholder="Select"
        size="large"
        style={{
          width: '500px',
        }}
        onChange={handleOnChange}
        value={id}
      >
        {apiForms.map((each) => (
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
        >
          {districtData && id === CREATE_ADMIN && (
            <CreateAdmin
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
        </ApiFormsMain>
      )}
      {showUpdateCoTeacher && (
        <UpdateCoTeacher
          isOpen={showUpdateCoTeacher}
          selectedClass={selectedClass}
          handleCancel={() => setShowUpdateCoTeacher(false)}
        />
      )}
    </div>
  )
}

export default ApiForm
