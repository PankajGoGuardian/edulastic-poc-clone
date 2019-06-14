import React, { useState } from "react";
import { Button as AntdButton, Icon, Modal, Radio, Table, Select, DatePicker } from "antd";
import { StyledComponents } from "@edulastic/common";

const { Button } = StyledComponents;
const { Option } = Select;

const CONFIG = {
  course: "Course",
  tags: "Tags",
  endDate: "End Date"
};

export default function BulkEditModal({
  bulkEditData: { showModal, updateMode, updateView },
  districtId,
  onCloseModal,
  setBulkEditMode,
  setBulkEditUpdateView,
  selectedIds,
  selectedClasses,
  bulkUpdateClasses,
  searchCourseList,
  coursesForDistrictList
}) {
  const [value, setValue] = useState("");
  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px"
  };

  const handleSubmit = () => {
    bulkUpdateClasses({
      groupIds: selectedIds,
      districtId,
      [updateMode]: value
    });
  };

  const fetchCoursesForDistrict = searchValue => {
    const searchParams = searchValue
      ? {
          search: {
            name: { type: "cont", value: searchValue },
            number: { type: "cont", value: searchValue },
            operator: "or"
          }
        }
      : {};
    const data = {
      districtId,
      active: 1,
      page: 0,
      limit: 50,
      ...searchParams
    };
    searchCourseList(data);
  };

  const renderEditableView = () => {
    switch (updateMode) {
      case "course":
        return (
          <div>
            <span>Choose course to update all selected classes</span>
            <Select
              style={{ width: "100%" }}
              showSearch
              onSearch={fetchCoursesForDistrict}
              notFoundContent={null}
              placeholder="Please enter 1 or more characters"
              onChange={val => setValue(val)}
            >
              {coursesForDistrictList.map(course => (
                <Option key={course._id} value={course._id}>{`${course.name} - ${course.number}`}</Option>
              ))}
            </Select>
          </div>
        );
      case "tags":
        return (
          <div>
            <span>Add tag(s) to all selected classes</span>
            <Select
              style={{ width: "100%" }}
              placeholder="Please enter 2 or more characters"
              mode="tags"
              onChange={val => setValue(val)}
            />
          </div>
        );
      case "endDate":
        return (
          <div>
            <span>Choose an end date to update all selected classes</span>
            <DatePicker onChange={date => setValue(date.valueOf())} />
          </div>
        );
      default:
        return <span>Default</span>;
    }
  };

  return (
    <Modal
      visible={showModal}
      title="Bulk Update Class(es)"
      onCancel={onCloseModal}
      maskClosable={false}
      footer={[
        updateView ? (
          <AntdButton key="update" onClick={handleSubmit}>
            Update Classes
          </AntdButton>
        ) : (
          <AntdButton type="primary" key="proceed" onClick={() => setBulkEditUpdateView(true)}>
            Proceed
          </AntdButton>
        )
      ]}
    >
      {updateView ? (
        <>
          <Button onClick={() => setBulkEditUpdateView(false)} noStyle>
            <Icon type="left" />
            Back
          </Button>
          <Table
            rowKey={record => record._id}
            dataSource={selectedClasses}
            pagination={false}
            columns={[
              {
                title: "Name",
                dataIndex: "_source.name"
              },
              {
                title: CONFIG[updateMode],
                dataIndex: `_source.${updateMode}`
              }
            ]}
          />
          {renderEditableView()}
        </>
      ) : (
        <>
          <h4>{`You have selected ${
            selectedClasses.length
          } Class(es) to update, please select the bulk action required`}</h4>
          <Radio.Group onChange={evt => setBulkEditMode(evt.target.value)} value={updateMode}>
            <Radio style={radioStyle} value="course">
              Change course association for selected classes
            </Radio>
            <Radio style={radioStyle} value="tags">
              Update tags for selected classes
            </Radio>
            <Radio style={radioStyle} value="endDate">
              Update end date of selected classes
            </Radio>
          </Radio.Group>
        </>
      )}
    </Modal>
  );
}
