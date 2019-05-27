import React, { useState } from "react";
import { Form, Button } from "antd";
import DatesNotesFormItem from "../Common/Form/DatesNotesFormItem";
import SearchDistrictByIdName from "../Common/Form/SearchDistrictByIdName";
import { Table } from "../Common/StyledComponents";
import SubTypeTag from "../Common/SubTypeTag";

const { Column } = Table;
const SearchSchoolByIdRadioOptions = {
  SCHOOL_ID: "schoolId",
  DISTRICT_ID: "districtId",
  SCHOOL_NAME_ID: "name",
  get list() {
    return [
      {
        id: this.SCHOOL_ID,
        label: "Search by School ID"
      },
      {
        id: this.DISTRICT_ID,
        label: "Search by District ID"
      },
      {
        id: this.SCHOOL_NAME_ID,
        label: "Search by School name"
      }
    ];
  }
};

const SubscriptionButtonConfig = {
  free: {
    label: "Upgrade",
    subTypeToBeSent: "enterprise"
  },
  premium: {
    label: "Revoke",
    subTypeToBeSent: "enterprise"
  },
  partial_premium: {
    label: "Edit",
    subTypeToBeSent: "enterprise"
  },
  enterprise: {
    label: "Revoke",
    subTypeToBeSent: "free"
  }
};

const SearchSchoolsByIdForm = Form.create({ name: "searchSchoolsByIdForm" })(
  ({ form: { getFieldDecorator, validateFields }, searchSchoolsByIdAction }) => {
    const searchSchoolsById = evt => {
      evt.preventDefault();
      validateFields((err, { districtSearchOption, districtSearchValue }) => {
        const commonProps = { getSubscription: true };
        if (!err) {
          // here if search by school name is chosen, the data parameters to be sent are different
          if (districtSearchOption === SearchSchoolByIdRadioOptions.SCHOOL_NAME_ID) {
            searchSchoolsByIdAction({
              searchText: districtSearchValue,
              fields: [districtSearchOption],
              ...commonProps
            });
          } else {
            searchSchoolsByIdAction({
              [districtSearchOption]: districtSearchValue,
              ...commonProps
            });
          }
        }
      });
    };

    return (
      <SearchDistrictByIdName
        getFieldDecorator={getFieldDecorator}
        handleSubmit={searchSchoolsById}
        listOfRadioOptions={SearchSchoolByIdRadioOptions.list}
        placeholder="Search Schools..."
      />
    );
  }
);

const SchoolsTable = Form.create({ name: "bulkSubscribeForm" })(
  ({
    form: { getFieldDecorator, validateFields, validateFieldsAndScroll },
    searchedSchoolsData,
    bulkSchoolsSubscribeAction,
    changeTab,
    manageByUserSegmentTabKey,
    setPartialPremiumDataAction
  }) => {
    const [selectedSchools, setSelectedSchools] = useState([]);
    const [firstSchoolSubType, setSelectedSchoolSubType] = useState("");

    const handleSubmit = evt => {
      validateFields((err, { subStartDate, subEndDate, notes }) => {
        if (!err) {
          bulkSchoolsSubscribeAction({
            subStartDate: subStartDate.valueOf(),
            subEndDate: subEndDate.valueOf(),
            notes,
            schoolIds: selectedSchools,
            subType: SubscriptionButtonConfig[firstSchoolSubType].subTypeToBeSent
          });
        }
      });
      evt.preventDefault();
    };

    const rowSelection = {
      selectedRowKeys: selectedSchools,
      onChange: (selectedSchoolsArray, record) => {
        if (!selectedSchoolsArray.length) {
          // if length is zero, i.e. all rows are unselected, state set back to default - ""
          setSelectedSchoolSubType("");
        } else if (selectedSchoolsArray.length === 1) {
          // if a row is selected for the first time, state set to rowType, so that only identical subType rows
          // can be selected
          const {
            subscription: { subType = "free" }
          } = record[0];
          setSelectedSchoolSubType(subType);
        }
        setSelectedSchools(selectedSchoolsArray);
      },
      getCheckboxProps: ({ schoolId, subscription: { subType = "free" } }) => ({
        // if a certain subType is selected, all other subType rows are disabled
        disabled: !!(firstSchoolSubType && subType !== firstSchoolSubType),
        name: schoolId
      }),
      hideDefaultSelections: true
    };

    const renderActions = (subType = "free", record) => {
      const handleClick = () => {
        if (subType === "partial_premium") {
          // if partial premium, we move user to a new tab with the data preserved
          setPartialPremiumDataAction(record);
          changeTab(manageByUserSegmentTabKey);
        } else {
          validateFieldsAndScroll(
            ["notes", "subStartDate", "subEndDate"],
            (err, { notes, subStartDate, subEndDate }) => {
              if (!err) {
                const { schoolId } = record;
                bulkSchoolsSubscribeAction({
                  subStartDate: subStartDate.valueOf(),
                  subEndDate: subEndDate.valueOf(),
                  notes,
                  schoolIds: [schoolId],
                  subType: SubscriptionButtonConfig[subType].subTypeToBeSent
                });
              }
            }
          );
        }
      };
      return <Button onClick={handleClick}>{SubscriptionButtonConfig[subType].label}</Button>;
    };

    const noOfSelectedSchools = selectedSchools.length;

    return (
      <>
        <Table
          rowKey={record => record.schoolId}
          dataSource={searchedSchoolsData}
          pagination={false}
          rowSelection={rowSelection}
          bordered
          scroll={{ x: "100%", y: 300 }}
        >
          <Column title="School Name" dataIndex="schoolName" key="schoolName" />
          <Column title="District Name" dataIndex="districtName" key="districtName" />
          <Column title="City" dataIndex="address.city" key="city" />
          <Column title="State" dataIndex="address.state" key="state" />
          <Column
            title="Plan"
            dataIndex="subscription.subType"
            key="plan"
            render={(text = "free") => <SubTypeTag>{text}</SubTypeTag>}
          />
          <Column title="Action" dataIndex="subscription.subType" key="action" render={renderActions} />
        </Table>
        {noOfSelectedSchools ? `${noOfSelectedSchools} Selected` : null}
        <BulkSubscribeForm
          handleSubmit={handleSubmit}
          getFieldDecorator={getFieldDecorator}
          ctaText={`Bulk ${SubscriptionButtonConfig[firstSchoolSubType || "free"].label}`}
        />
      </>
    );
  }
);

const BulkSubscribeForm = ({ handleSubmit, getFieldDecorator, ctaText }) => (
  <Form onSubmit={handleSubmit}>
    <DatesNotesFormItem getFieldDecorator={getFieldDecorator} />
    <Form.Item>
      <Button type="primary" htmlType="submit">
        {ctaText}
      </Button>
    </Form.Item>
  </Form>
);

export default function ManageSubscriptionBySchool({
  searchedSchoolsData,
  searchSchoolsByIdAction,
  bulkSchoolsSubscribeAction,
  changeTab,
  manageByUserSegmentTabKey,
  setPartialPremiumDataAction
}) {
  return (
    <>
      <SearchSchoolsByIdForm searchSchoolsByIdAction={searchSchoolsByIdAction} />
      <SchoolsTable
        searchedSchoolsData={searchedSchoolsData}
        bulkSchoolsSubscribeAction={bulkSchoolsSubscribeAction}
        changeTab={changeTab}
        manageByUserSegmentTabKey={manageByUserSegmentTabKey}
        setPartialPremiumDataAction={setPartialPremiumDataAction}
      />
    </>
  );
}
