import React, { useState } from 'react'
import { Row, Button, Checkbox, Divider } from 'antd'
import { EduButton, EduIf } from '@edulastic/common'
import UserRegistrationModal from './UserRegistrationModal'

export default function InvalidEmailIdList({
  validEmailIdsList,
  allEmailIds,
  t,
}) {
  const [fieldData, setFieldData] = useState({
    districtId: '',
    districtName: '',
    isModal: false,
    checkedList: [],
    indeterminate: true,
    checkAll: false,
    emailValue: '',
    isMultipleEmails: false,
    username: '',
  })

  const validEmailIds = validEmailIdsList?.map(
    (element) => element._source.username || element._source.email
  )

  const allEmailIdsList = allEmailIds
    ?.split(',')
    ?.map((email) => email.trim())
    ?.filter(Boolean)

  const invalidEmailIds = allEmailIdsList?.filter(
    (element) => !validEmailIds?.includes(element.toLowerCase())
  )

  const showModal = (item) =>
    setFieldData({ ...fieldData, isModal: true, username: item })

  const onCheckAllChange = (e) => {
    setFieldData({
      ...fieldData,
      checkAll: e.target.checked,
      indeterminate: false,
      checkedList: e.target.checked ? invalidEmailIds : [],
    })
  }

  const onChange = (checkedValues) => {
    setFieldData({
      ...fieldData,
      checkAll: checkedValues.length === invalidEmailIds.length,
      indeterminate:
        !!checkedValues.length && checkedValues.length < invalidEmailIds.length,
      checkedList: checkedValues,
      emailValue: checkedValues[checkedValues.length - 1],
    })
  }

  const onAddButton = () => {
    setFieldData({
      ...fieldData,
      isMultipleEmails: true,
      isModal: true,
    })
  }

  const invalidEmailCheckboxes = invalidEmailIds?.map((item) => (
    <>
      <Row span={18}>
        <Checkbox value={item} onChange={onChange}>
          <Button onClick={() => showModal(item)}>{item}</Button>
        </Checkbox>
      </Row>
      <br />
    </>
  ))

  return (
    <EduIf condition={invalidEmailIds && invalidEmailIds.length}>
      <div>
        <Divider />
        <h2>{t('manageByUser.userRegistration.missingUserHeader')}</h2>
        <Checkbox
          indeterminate={fieldData.indeterminate}
          onChange={onCheckAllChange}
          checked={fieldData.checkAll}
        >
          {t('manageByUser.userRegistration.checkAllText')}
        </Checkbox>
        <br />

        <br />
        <Checkbox.Group
          style={{
            width: '100%',
          }}
          onChange={onChange}
          value={fieldData.checkedList}
        >
          {invalidEmailCheckboxes}
        </Checkbox.Group>
        <br />
        <EduButton onClick={onAddButton}>Add Teacher(s)</EduButton>
      </div>
      <Divider />
      {fieldData.isModal && (
        <UserRegistrationModal
          fieldData={fieldData}
          setFieldData={setFieldData}
          t={t}
        />
      )}
    </EduIf>
  )
}
