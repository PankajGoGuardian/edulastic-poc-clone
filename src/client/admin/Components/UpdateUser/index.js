import React, { useState } from 'react'
import moment from 'moment'
import Col from "antd/es/Col";
import Input from "antd/es/Input";
import Radio from "antd/es/Radio";

import { EduButton, notification } from '@edulastic/common'
import { userApi } from '@edulastic/api'

import {
  HeadingSpan,
  ValueSpan,
} from '../../Common/StyledComponents/upgradePlan'
import {
  Row,
  SecondDiv,
  ThirdDiv,
  LeftButtonsContainer,
} from '../CreateAdmin/styled'
import { StyledRadioGroup } from './styled'

const fields = {
  _id: 'User ID',
  firstName: 'First Name',
  lastName: 'Last Name',
  email: 'Email',
  username: 'Username',
  role: 'Role',
  cleverId: 'Clever ID',
  openIdProvider: 'Open ID Provider',
}

const openIdMap = {
  google: 'googleId',
  mso365: 'msoId',
  canvas: 'canvasId',
  clever: 'cleverId',
  cli: 'cliId',
}

const UpdateUser = (props) => {
  const [selected, setSelected] = useState(0)
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const { userData, clearUserData } = props

  const user = userData[selected]

  const updateUser = async () => {
    setLoading(true)
    try {
      await userApi.updateUsername({
        username: user.username,
        userId: user._id,
        newUsername,
      })
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
                {Object.keys(fields).map((field) => (
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
                ))}
                <Row>
                  <HeadingSpan>Open ID:</HeadingSpan>
                  <ValueSpan>
                    {data[openIdMap[data?.openIdProvider?.toLowerCase()]] ||
                      '-'}
                  </ValueSpan>
                </Row>
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
