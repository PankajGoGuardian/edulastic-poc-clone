import React, { useState } from 'react'
import moment from 'moment'
import { Radio } from 'antd'

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
  username: 'Username',
  firstName: 'First Name',
  lastName: 'Last Name',
  email: 'Email',
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

const ActivateDeactivateUser = (props) => {
  const [selected, setSelected] = useState(0)
  const [loading, setLoading] = useState(false)
  const { userData, clearUserData } = props

  const user = userData[selected]
  const activate = user.status !== 1

  const updateUser = async () => {
    setLoading(true)
    try {
      await userApi.activateUser({
        userId: user._id,
        activate,
      })
      notification({
        type: 'success',
        msg: `User has been ${
          activate ? 'activated' : 'deactivated'
        } successfully`,
      })
      clearUserData()
    } catch (error) {
      notification({ msg: error.message, messageKey: 'apiFormErr' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => setSelected(e.target.value)

  return (
    <>
      <SecondDiv>
        <StyledRadioGroup onChange={handleChange} value={selected}>
          {userData.map((data, index) => (
            <Radio key={index} value={index}>
              {Object.keys(fields).map((field) => (
                <Row>
                  <HeadingSpan>{fields[field]}:</HeadingSpan>
                  <ValueSpan>{data[field] || '-'}</ValueSpan>
                </Row>
              ))}
              <Row>
                <HeadingSpan>Open ID:</HeadingSpan>
                <ValueSpan>
                  {data[openIdMap[data?.openIdProvider?.toLowerCase()]] || '-'}
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
          ))}
        </StyledRadioGroup>
      </SecondDiv>
      <ThirdDiv>
        <LeftButtonsContainer>
          <EduButton isGhost onClick={clearUserData} disabled={loading}>
            Cancel
          </EduButton>
          <EduButton onClick={updateUser} disabled={loading}>
            {activate ? 'Activate' : 'Deactivate'}
          </EduButton>
        </LeftButtonsContainer>
      </ThirdDiv>
    </>
  )
}

export default ActivateDeactivateUser
