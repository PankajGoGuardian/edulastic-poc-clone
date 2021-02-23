import React, { useMemo } from 'react'
import { Col, Row, Table } from 'antd'
import { alertColor, dangerColor, themeColor } from '@edulastic/colors'
import { CustomModalStyled, EduButton } from '@edulastic/common'
import { StatusDiv, StyledStatusIcon } from './styled'

const BULK_UPGRADE_USER_STATUS = {
  ALREADY_PREMIUM: 'ALREADY_PREMIUM',
  UPGRADED_TO_PREMIUM: 'UPGRADED_TO_PREMIUM',
  ALREADY_HAS_ITEMBANK_ACCESS: 'ALREADY_HAS_ITEMBANK_ACCESS',
  ITEMBANK_ACCESS_GRANTED: 'ITEMBANK_ACCESS_GRANTED',
}

const ADD_USER_STATUS = {
  SUCCESS: 'SUCCESS',
  FAILED_USER_EXISTS: 'FAILED_USER_EXISTS',
}

const ICON_COLORS = {
  SUCCESS: themeColor,
  ALERT: alertColor,
  DANGER: dangerColor,
}

const StatusComponent = ({ type, color, text }) => (
  <StatusDiv>
    <StyledStatusIcon type={type} iconColor={color} />
    {text}
  </StatusDiv>
)

const AddUsersConfirmationModal = ({
  isVisible,
  onCancel,
  userDataSource,
  userRole,
  t,
  teacherPremiumProductId,
  sparkMathProductId,
}) => {
  const { dataSource, columns, dynamicModalWidth } = useMemo(() => {
    const _columns = [
      {
        title: t('manageSubscriptions.name'),
        dataIndex: 'fullName',
        render: (fullName) => (
          <p>{fullName || 'Name will be updated after first sign-up'}</p>
        ),
      },
      {
        title: t('manageSubscriptions.username'),
        dataIndex: 'username',
        render: (username) => <p>{username}</p>,
      },
      {
        title: t('manageSubscriptions.status'),
        dataIndex: 'status',
        render: (status) => {
          if (status === ADD_USER_STATUS.SUCCESS) {
            return (
              <StatusComponent
                type="check"
                color={ICON_COLORS.SUCCESS}
                text={t('manageSubscriptions.usercreated')}
              />
            )
          }
          if (status === ADD_USER_STATUS.FAILED_USER_EXISTS) {
            return (
              <StatusComponent
                type="exclamation-circle"
                color={ICON_COLORS.ALERT}
                text={t('manageSubscriptions.userexists')}
              />
            )
          }
          return (
            <StatusComponent
              type="close-circle"
              color={ICON_COLORS.DANGER}
              text={t('manageSubscriptions.emailnotallowed')}
            />
          )
        },
      },
    ]

    let hasPremiumEntry = false
    let hasSparkMathEntry = false
    let _dynamicModalWidth = 60

    const _dataSource = userDataSource.map((item = {}) => {
      const { firstName, lastName } = item
      const data = {
        ...item,
        userRole,
        fullName: `${firstName || ''} ${lastName || ''}`.trim(),
      }
      if (!hasPremiumEntry && data[teacherPremiumProductId]) {
        hasPremiumEntry = true
      }
      if (!hasSparkMathEntry && data[sparkMathProductId]) {
        hasSparkMathEntry = true
      }
      return data
    })

    if (hasPremiumEntry) {
      _dynamicModalWidth += 10
      _columns.push({
        title: t('manageSubscriptions.teacherPremium'),
        dataIndex: `${teacherPremiumProductId}`,
        render: (status) => {
          if (status === BULK_UPGRADE_USER_STATUS.UPGRADED_TO_PREMIUM) {
            return (
              <StatusComponent
                type="check"
                color={ICON_COLORS.SUCCESS}
                text={t(`manageSubscriptions.${status}`)}
              />
            )
          }
          if (status === BULK_UPGRADE_USER_STATUS.ALREADY_PREMIUM) {
            return (
              <StatusComponent
                type="exclamation-circle"
                color={ICON_COLORS.ALERT}
                text={t(`manageSubscriptions.${status}`)}
              />
            )
          }
        },
      })
    }

    if (hasSparkMathEntry) {
      _dynamicModalWidth += 10
      _columns.push({
        title: t('manageSubscriptions.sparkMath'),
        dataIndex: `${sparkMathProductId}`,
        render: (status) => {
          if (status === BULK_UPGRADE_USER_STATUS.ITEMBANK_ACCESS_GRANTED) {
            return (
              <StatusComponent
                type="check"
                color={ICON_COLORS.SUCCESS}
                text={t(`manageSubscriptions.${status}`)}
              />
            )
          }
          if (status === BULK_UPGRADE_USER_STATUS.ALREADY_HAS_ITEMBANK_ACCESS) {
            return (
              <StatusComponent
                type="exclamation-circle"
                color={ICON_COLORS.ALERT}
                text={t(`manageSubscriptions.${status}`)}
              />
            )
          }
        },
      })
    }

    return {
      dataSource: _dataSource,
      columns: _columns,
      dynamicModalWidth: `${Math.min(_dynamicModalWidth, 85)}%`,
    }
  }, [userDataSource, teacherPremiumProductId, sparkMathProductId])
  return (
    <CustomModalStyled
      visible={isVisible}
      title="User(s) Details"
      onCancel={onCancel}
      centered
      width={dynamicModalWidth}
      footer={[
        <EduButton
          height="40px"
          width="200px"
          data-cy="closeAddUsersConfirmationModal"
          onClick={onCancel}
        >
          Done
        </EduButton>,
      ]}
    >
      <Row>
        <Col span={24}>
          <Table
            rowKey={(record) => record._id}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
          />
        </Col>
      </Row>
    </CustomModalStyled>
  )
}

export default AddUsersConfirmationModal
