import { Col, Input, Radio, Tooltip } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

import { userApi } from '@edulastic/api'
import { CheckboxLabel, EduButton, notification } from '@edulastic/common'
import { roleuser, userPermissions } from '@edulastic/constants'

import { IconInfo } from '@edulastic/icons'
import {
  HeadingSpan,
  ValueSpan,
} from '../../Common/StyledComponents/upgradePlan'
import {
  LeftButtonsContainer,
  Row,
  SecondDiv,
  ThirdDiv,
} from '../CreateAdmin/styled'
import { StyledRadioGroup } from './styled'

const tooltip = {
  dataOps:
    'This district admin can only upload data to data studio feature. No access is given to district menu and insights.',
}
const fields = {
  _id: 'User ID',
  firstName: 'First Name',
  middleName: 'Middle Name',
  lastName: 'Last Name',
  email: 'Email',
  username: 'Username',
  role: 'Role',
  cleverId: 'Clever ID',
  googleId: 'Google ID',
  canvasId: 'Canvas ID',
  atlasId: 'Atlas ID',
  mso365: 'msoId',
  cli: 'cliId',
  openIdProvider: 'Open ID Provider',
  isSuperAdmin: 'super admin',
  dataOpsOnly: 'Data Operations Only',
}

const UpdateUser = (props) => {
  const [selected, setSelected] = useState(0)
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [isDataOpsOnly, setIsDataOpsOnly] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const { userData, clearUserData } = props

  const user = userData[selected]

  useEffect(() => {
    if ((user?.permissions || []).includes(userPermissions.SUPER_ADMIN)) {
      setIsSuperAdmin(true)
    }
    if ((user?.permissions || []).includes(userPermissions.DATA_OPS_ONLY)) {
      setIsDataOpsOnly(true)
    }
  }, [user])

  const changeIsSuperAdmin = (e) => setIsSuperAdmin(e.target.checked)

  const updateUser = async () => {
    setLoading(true)
    try {
      const updateData = {
        username: user.username,
        userId: user._id,
        newUsername,
        permissions: user.permissions || [],
      }
      if (
        user.role === roleuser.DISTRICT_ADMIN ||
        user.role === roleuser.SCHOOL_ADMIN
      ) {
        updateData.permissions = isSuperAdmin
          ? [...new Set([...updateData.permissions, 'super_admin'])]
          : updateData.permissions.filter((item) => item !== 'super_admin')
      }

      if (isDataOpsOnly) {
        if (!updateData.permissions.includes(userPermissions.DATA_OPS_ONLY)) {
          updateData.permissions.push(userPermissions.DATA_OPS_ONLY)
        }
      } else {
        updateData.permissions = updateData.permissions.filter(
          (item) => item !== userPermissions.DATA_OPS_ONLY
        )
      }

      await userApi.updateUserAdminTool(updateData)
      notification({
        type: 'success',
        msg: `User has been Updated successfully`,
      })
      clearUserData()
    } catch (error) {
      notification({ msg: error.message, messageKey: 'apiFormErr' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setSelected(e.target.value)
    setIsEdit(false)
  }

  return (
    <SecondDiv>
      <StyledRadioGroup
        onChange={handleChange}
        value={selected}
        style={{ width: '100%' }}
      >
        {userData.map((data, index) => (
          <Row>
            <Col span={8}>
              <Radio key={index} value={index}>
                {Object.keys(fields).map((field) => {
                  if (
                    data?.role !== roleuser.SCHOOL_ADMIN &&
                    (data?.role !== roleuser.DISTRICT_ADMIN ||
                      data?.permissions?.includes('curator')) &&
                    field === 'isSuperAdmin'
                  ) {
                    return null
                  }
                  if (
                    (data?.role === roleuser.SCHOOL_ADMIN ||
                      data?.role === roleuser.DISTRICT_ADMIN) &&
                    field === 'isSuperAdmin'
                  ) {
                    return (
                      <Row>
                        <Col>
                          <CheckboxLabel
                            disabled={!isEdit}
                            checked={isSuperAdmin}
                            onChange={changeIsSuperAdmin}
                          >
                            Super Admin
                          </CheckboxLabel>
                        </Col>
                      </Row>
                    )
                  }

                  if (field === 'dataOpsOnly') {
                    return (
                      <Row>
                        <Col>
                          <CheckboxLabel
                            disabled={!isEdit}
                            checked={isDataOpsOnly}
                            onChange={(e) => setIsDataOpsOnly(e.target.checked)}
                          >
                            Data Operations Only
                          </CheckboxLabel>{' '}
                          <Tooltip title={tooltip.dataOps}>
                            <IconInfo height={10} />
                          </Tooltip>
                        </Col>
                      </Row>
                    )
                  }
                  return (
                    <Row>
                      {isEdit &&
                      field === 'username' &&
                      data?._id === user?._id ? (
                        <>
                          <HeadingSpan>{fields[field]}:</HeadingSpan>
                          &nbsp;&nbsp;
                          <Input
                            type="text"
                            value={newUsername}
                            onChange={(e) => {
                              setNewUsername(e.target.value)
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <HeadingSpan>{fields[field]}:</HeadingSpan>
                          <ValueSpan>{data[field] || '-'}</ValueSpan>
                        </>
                      )}
                    </Row>
                  )
                })}
                {data.subscription && (
                  <>
                    <Row>
                      <HeadingSpan>isPremium:</HeadingSpan>
                      <ValueSpan>
                        {(
                          data.subscription.subType === 'premium' ||
                          data.subscription.subType === 'enterprise'
                        ).toString()}
                      </ValueSpan>
                    </Row>
                    <Row>
                      <HeadingSpan>
                        Subscription Start Date (YYYY-MM-DD):
                      </HeadingSpan>
                      <ValueSpan>
                        {data.subscription?.subStartDate
                          ? moment(data.subscription.subStartDate).format(
                              'YYYY-MM-DD'
                            )
                          : '-'}
                      </ValueSpan>
                    </Row>
                    <Row>
                      <HeadingSpan>
                        Subscription End Date (YYYY-MM-DD):
                      </HeadingSpan>
                      <ValueSpan>
                        {data.subscription?.subEndDate
                          ? moment(data.subscription.subEndDate).format(
                              'YYYY-MM-DD'
                            )
                          : '-'}
                      </ValueSpan>
                    </Row>
                    <Row>
                      <HeadingSpan>Access Notes:</HeadingSpan>
                      <ValueSpan>{data.subscription.notes || '-'}</ValueSpan>
                    </Row>
                  </>
                )}
              </Radio>
            </Col>
            <Col span={16}>
              <ThirdDiv style={{ margin: '0px' }}>
                {isEdit && data?._id === user?._id ? (
                  <LeftButtonsContainer style={{ margin: '0px' }}>
                    <EduButton
                      isGhost
                      onClick={() => {
                        setIsEdit(false)
                        clearUserData()
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </EduButton>
                    <EduButton onClick={updateUser} disabled={loading}>
                      Update
                    </EduButton>
                  </LeftButtonsContainer>
                ) : (
                  <LeftButtonsContainer style={{ margin: '0px' }}>
                    <EduButton
                      isGhost
                      onClick={() => {
                        setIsEdit(true)
                        setNewUsername(user.username)
                      }}
                      disabled={data?._id !== user?._id}
                    >
                      Edit
                    </EduButton>
                  </LeftButtonsContainer>
                )}
              </ThirdDiv>
            </Col>
          </Row>
        ))}
      </StyledRadioGroup>
    </SecondDiv>
  )
}

export default UpdateUser
