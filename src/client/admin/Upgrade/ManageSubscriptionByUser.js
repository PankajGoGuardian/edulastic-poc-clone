import React from "react";
import { Row, Col, Form, Radio, Input, Button } from "antd";
import DatesNotesFormItem from "../Common/Form/DatesNotesFormItem";
import { radioButtonUserData } from "../Data";
import { Table } from "../Common/StyledComponents";
import { renderSubscriptionType } from "../Common/Utils";

const { TextArea } = Input;
const { Group: RadioGroup } = Radio;

const SearchUsersByEmailIdsForm = Form.create({ name: "searchUsersByEmailIdsForm" })(
  ({ form: { getFieldDecorator, validateFields }, searchUsersByEmailIdAction }) => {
    const handleSubmit = evt => {
      validateFields((err, { emailIds }) => {
        if (!err) {
          searchUsersByEmailIdAction({
            // here empty spaces and ↵ spaces are removed
            emails: emailIds.replace(/\s/g, "").split(",")
          });
        }
      });
      evt.preventDefault();
    };
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Item>
          {getFieldDecorator("emailIds", {
            rules: [{ required: true }],
            initialValue: ""
          })(<TextArea rows={4} placeholder="Enter Comma separated User Email IDs..." />)}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Validate
          </Button>
        </Form.Item>
      </Form>
    );
  }
);

const ValidEmailIdsTable = ({ validEmailIdsList }) => {
  const columns = [
    {
      title: "User ID",
      dataIndex: "_id"
    },
    {
      title: "Subscription Type",
      dataIndex: "subscription",
      render: renderSubscriptionType
    },
    {
      title: "Email ID",
      dataIndex: "_source.email"
    },
    {
      title: "Notes",
      dataIndex: "subscription.notes"
    }
  ];

  return validEmailIdsList ? (
    <>
      <h2>The list of validated Email ID's are :</h2>
      <Table
        columns={columns}
        rowKey={record => record._id}
        dataSource={validEmailIdsList}
        pagination={false}
        bordered
      />
    </>
  ) : null;
};

const SubmitUserForm = Form.create({ name: "submitUserForm" })(
  ({ form: { getFieldDecorator, validateFields }, upgradeUserSubscriptionAction, validEmailIdsList }) => {
    const handleSubmit = evt => {
      validateFields((err, { subStartDate, subEndDate, notes, subscriptionAction }) => {
        if (!err) {
          // here only the user'ids need to be passed for the API call, hence extracting only the user id's
          const userIds = validEmailIdsList.map(item => item._id);

          upgradeUserSubscriptionAction({
            subStartDate: subStartDate.valueOf(),
            subEndDate: subEndDate.valueOf(),
            notes,
            userIds,
            subType: subscriptionAction === radioButtonUserData.UPGRADE ? "premium" : "free"
          });
        }
      });
      evt.preventDefault();
    };

    return (
      <Form onSubmit={handleSubmit}>
        <DatesNotesFormItem getFieldDecorator={getFieldDecorator} />

        <Row>
          <Col span={8}>
            <Form.Item>
              {getFieldDecorator("subscriptionAction", {
                initialValue: radioButtonUserData.list[0]
              })(
                <RadioGroup name="upgradeRevokeOptions">
                  {radioButtonUserData.list.map(item => (
                    <Radio key={item} id={item} value={item}>
                      {item}
                    </Radio>
                  ))}
                </RadioGroup>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
);

export default function ManageSubscriptionByUser({
  manageUsersData: { validEmailIdsList },
  upgradeUserSubscriptionAction,
  searchUsersByEmailIdAction
}) {
  return (
    <>
      <SearchUsersByEmailIdsForm searchUsersByEmailIdAction={searchUsersByEmailIdAction} />
      <ValidEmailIdsTable validEmailIdsList={validEmailIdsList} />
      <SubmitUserForm
        upgradeUserSubscriptionAction={upgradeUserSubscriptionAction}
        validEmailIdsList={validEmailIdsList}
      />
    </>
  );
}
