import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Radio, Input, Button } from 'antd'
import moment from 'moment'
import { compose } from 'redux'
import { withNamespaces } from '@edulastic/localization'
import DatesNotesFormItem from '../Common/Form/DatesNotesFormItem'
import { radioButtonUserData } from '../Data'
import { Table } from '../Common/StyledComponents'
import { renderSubscriptionType } from '../Common/SubTypeTag'
import InvalidEmailIdList from './InvalidEmailIdList'

const { TextArea } = Input
const { Group: RadioGroup } = Radio

const getValidatedIdsStr = (ids, validIdsList) => {
  // curate validIds from validIdsList
  const validUserIds = validIdsList.map((el) => el._id)
  const validEmailIds = validIdsList.map((el) => el._source.email)
  // calculate valid count str
  const validCount = ids.filter(
    (id) => validUserIds.includes(id) || validEmailIds.includes(id)
  ).length
  return ids.length ? `${validCount} out of ${ids.length} validated` : ''
}

const getIdsStrToList = (ids) =>
  (ids || '')
    .replace(/\s/g, '')
    .split(',')
    .filter((id) => id)

const SearchUsersByEmailIdsForm = Form.create({
  name: 'searchUsersByEmailIdsForm',
})(
  ({
    form: { getFieldDecorator, getFieldValue, validateFields },
    searchUsersByEmailIdAction,
    validEmailIdsList,
    setEmailIds,
  }) => {
    const handleSubmit = (evt) => {
      validateFields((err, { emailIds }) => {
        if (!err) {
          searchUsersByEmailIdAction({
            // here empty spaces and ↵ spaces are removed
            identifiers: getIdsStrToList(emailIds),
          })
          setEmailIds(emailIds)
        }
      })
      evt.preventDefault()
    }
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Item>
          {getFieldDecorator('emailIds', {
            rules: [{ required: true }],
            initialValue: '',
          })(
            <TextArea
              data-cy="emailInput"
              rows={4}
              placeholder="Enter Comma separated User Email IDs or User IDs..."
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button data-cy="validate" type="primary" htmlType="submit">
            Validate
          </Button>
          <span
            data-cy="validator"
            style={{ margin: '0 10px', fontWeight: '600' }}
          >
            {getValidatedIdsStr(
              getIdsStrToList(getFieldValue('emailIds')),
              validEmailIdsList || []
            )}
          </span>
        </Form.Item>
      </Form>
    )
  }
)

const ValidEmailIdsTable = ({ validEmailIdsList }) => {
  const columns = [
    {
      title: 'S. No.',
      dataIndex: 'index',
      render: (data) => data + 1,
      width: 80,
      align: 'center',
    },
    {
      title: 'User ID',
      dataIndex: '_id',
    },
    {
      title: 'District ID',
      dataIndex: '_source.districtIds',
      render: (districtIds) => districtIds.join('\n'),
    },
    {
      title: 'Institution ID',
      dataIndex: '_source.institutionIds',
      render: (institutionIds) => institutionIds.join('\n'),
    },
    {
      title: 'Subscription Type',
      dataIndex: 'subscription',
      render: renderSubscriptionType,
    },
    {
      title: 'Role',
      dataIndex: '_source.role',
    },
    {
      title: 'Start Date',
      dataIndex: 'subscription',
      render: (subscription) => (
        <span data-cy="userSubscriptionStartDate">
          {subscription?.subStartDate
            ? moment(subscription.subStartDate).format('DD MMM, YYYY')
            : subscription?.subRenewalDate
            ? moment(subscription.subRenewalDate).format('DD MMM, YYYY')
            : '-'}
        </span>
      ),
    },
    {
      title: 'End Date',
      dataIndex: 'subscription',
      render: (subscription) => (
        <span data-cy="userSubscriptionEndDate">
          {subscription?.subEndDate
            ? moment(subscription?.subEndDate).format('DD MMM, YYYY')
            : '-'}
        </span>
      ),
    },
    {
      title: 'Email ID',
      dataIndex: '_source.email',
    },
    {
      title: 'Notes',
      dataIndex: 'subscription.notes',
    },
  ]

  return validEmailIdsList ? (
    <>
      <h2>The list of validated Users are :</h2>
      <Table
        data-cy="userDetailsTable"
        columns={columns}
        rowKey={(record) => record._id}
        dataSource={validEmailIdsList.map((el, index) => ({ ...el, index }))}
        pagination={false}
        bordered
      />
    </>
  ) : null
}

const SubmitUserForm = Form.create({ name: 'submitUserForm' })(
  ({
    form: { getFieldDecorator, validateFields },
    upgradeUserSubscriptionAction,
    validEmailIdsList,
  }) => {
    const handleSubmit = (evt) => {
      validateFields(
        (err, { subStartDate, subEndDate, notes, subscriptionAction }) => {
          if (!err) {
            const userIds = []
            const subscriptionIds = []
            const identifiers = validEmailIdsList.map(({ _id }) => _id)
            validEmailIdsList.forEach(({ subscription, _id }) => {
              if (subscription && subscription._id) {
                subscriptionIds.push(subscription._id)
              } else {
                userIds.push(_id)
              }
            })
            const isRevokeAccess =
              subscriptionAction === radioButtonUserData.REVOKE
            upgradeUserSubscriptionAction({
              ...(isRevokeAccess && { status: 0 }),
              ...(!isRevokeAccess && { subType: 'premium' }),
              subStartDate: subStartDate.valueOf(),
              subEndDate: subEndDate.valueOf(),
              notes,
              userIds,
              subscriptionIds,
              identifiers,
            })
          }
        }
      )
      evt.preventDefault()
    }

    return (
      <Form onSubmit={handleSubmit}>
        <DatesNotesFormItem getFieldDecorator={getFieldDecorator} />

        <Row>
          <Col span={8}>
            <Form.Item>
              {getFieldDecorator('subscriptionAction', {
                initialValue: radioButtonUserData.list[0],
              })(
                <RadioGroup name="upgradeRevokeOptions">
                  {radioButtonUserData.list.map((item) => (
                    <Radio data-cy={item} key={item} id={item} value={item}>
                      {item}
                    </Radio>
                  ))}
                </RadioGroup>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button data-cy="submitButton" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    )
  }
)

function ManageSubscriptionByUser({
  manageUsersData: { validEmailIdsList },
  upgradeUserSubscriptionAction,
  searchUsersByEmailIdAction,
  t,
}) {
  const [emailIds, setEmailIds] = useState()
  return (
    <>
      <SearchUsersByEmailIdsForm
        searchUsersByEmailIdAction={searchUsersByEmailIdAction}
        validEmailIdsList={validEmailIdsList}
        setEmailIds={setEmailIds}
      />
      <InvalidEmailIdList
        validEmailIdsList={validEmailIdsList}
        allEmailIds={emailIds}
        t={t}
      />
      <ValidEmailIdsTable validEmailIdsList={validEmailIdsList} />
      <SubmitUserForm
        upgradeUserSubscriptionAction={upgradeUserSubscriptionAction}
        validEmailIdsList={validEmailIdsList}
      />
    </>
  )
}
ManageSubscriptionByUser.propTypes = {
  t: PropTypes.func.isRequired,
}

export default compose(withNamespaces('upgradePlan'))(ManageSubscriptionByUser)
