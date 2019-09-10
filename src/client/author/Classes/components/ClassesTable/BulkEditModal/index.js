import React, { useState } from "react";
import { Button as AntdButton, Icon, Modal, Radio, Table, Select, DatePicker, Form } from "antd";
import { StyledComponents } from "@edulastic/common";
import { tagsApi } from "@edulastic/api";
import { connect } from "react-redux";
import { compose } from "redux";
import { getUser } from "../../../../src/selectors/user";
import { debounce } from "lodash";
import { addNewTagAction, getAllTagsAction } from "../../../../TestPage/ducks";

const { Button } = StyledComponents;
const { Option } = Select;

const CONFIG = {
  course: "Course",
  tags: "Tags",
  endDate: "End Date"
};

function BulkEditModal({
  bulkEditData: { showModal, updateMode, updateView },
  districtId,
  onCloseModal,
  setBulkEditMode,
  setBulkEditUpdateView,
  selectedIds,
  selectedClasses,
  bulkUpdateClasses,
  searchCourseList,
  coursesForDistrictList,
  userDetails,
  form,
  allTagsData,
  addNewTag
}) {
  const [value, setValue] = useState("");
  const [searchValue, setSearchValue] = useState(undefined);
  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px"
  };

  const { setFieldsValue, getFieldValue, getFieldDecorator } = form;

  const handleSubmit = () => {
    let updatedData = value;
    if (updateMode === "tags") {
      const tags = getFieldValue("tags");
      updatedData = tags.map(t => allTagsData.find(o => o._id === t));
    }

    bulkUpdateClasses({
      groupIds: selectedIds,
      districtId,
      [updateMode]: updatedData,
      institutionIds: userDetails.institutionIds
    });
  };

  const fetchCoursesForDistrict = debounce(searchValue => {
    const searchParams = searchValue
      ? {
          search: {
            name: [{ type: "cont", value: searchValue }],
            number: [{ type: "cont", value: searchValue }],
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
  }, 1000);

  const selectTags = async id => {
    let newTag = {};
    if (id === searchValue) {
      const { _id, tagName } = await tagsApi.create({ tagName: searchValue, tagType: "group" });
      newTag = { _id, tagName };
      addNewTag({ tag: newTag, tagType: "group" });
    } else {
      newTag = allTagsData.find(tag => tag._id === id);
    }
    const tagsSelected = getFieldValue("tags");
    const newTags = [...tagsSelected, newTag._id];
    setFieldsValue({ tags: newTags.filter(t => t !== searchValue) });
    setSearchValue(undefined);
  };

  const deselectTags = id => {
    const tagsSelected = getFieldValue("tags");
    const newTags = tagsSelected.filter(tag => tag !== id);
    setFieldsValue({ tags: newTags });
  };

  const searchTags = async value => {
    if (allTagsData.some(tag => tag.tagName === value)) {
      setSearchValue(undefined);
    } else {
      setSearchValue(value);
    }
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
              filterOption={false}
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
            <div>Add tag(s) to all selected classes</div>
            {getFieldDecorator("tags")(
              <Select
                data-cy="tagsSelect"
                mode="multiple"
                style={{ marginBottom: 0, width: "100%" }}
                optionLabelProp="title"
                placeholder="Select Tags"
                onSearch={searchTags}
                onSelect={selectTags}
                onDeselect={deselectTags}
                filterOption={(input, option) => option.props.title.toLowerCase().includes(input.toLowerCase())}
              >
                {!!searchValue ? (
                  <Select.Option key={0} value={searchValue} title={searchValue}>
                    {`${searchValue} (Create new Tag )`}
                  </Select.Option>
                ) : (
                  ""
                )}
                {allTagsData.map(({ tagName, _id }) => (
                  <Select.Option key={_id} value={_id} title={tagName}>
                    {tagName}
                  </Select.Option>
                ))}
              </Select>
            )}
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
            columns={
              updateMode === "tags"
                ? [
                    {
                      title: "Name",
                      dataIndex: "_source.name"
                    },
                    {
                      title: CONFIG[updateMode],
                      dataIndex: `_source.${updateMode}`,
                      render: tags =>
                        tags.map((tag, i, tags) => (
                          <span key={tag._id} style={{ margin: "3px" }}>
                            {tag.tagName}
                            {+i + 1 < tags.length ? ", " : ""}
                          </span>
                        ))
                    }
                  ]
                : [
                    {
                      title: "Name",
                      dataIndex: "_source.name"
                    },
                    {
                      title: CONFIG[updateMode],
                      dataIndex: `_source.${updateMode}`
                    }
                  ]
            }
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

const enhance = compose(
  connect(
    state => ({ userDetails: getUser(state) }),
    { getAllTags: getAllTagsAction, addNewTag: addNewTagAction }
  ),
  Form.create()
);

export default enhance(BulkEditModal);
