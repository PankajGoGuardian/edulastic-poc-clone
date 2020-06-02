import React, { useState } from "react";
import { Button as AntdButton, Icon, Modal, Radio, Table, Select, DatePicker, Form, message, Col } from "antd";
import { StyledComponents, RadioBtn, RadioGrp,notification } from "@edulastic/common";
import { tagsApi } from "@edulastic/api";
import { connect } from "react-redux";
import { compose } from "redux";
import { getUser } from "../../../../src/selectors/user";
import moment from "moment";
import { debounce, uniq } from "lodash";
import { addNewTagAction, getAllTagsAction } from "../../../../TestPage/ducks";
import { ButtonsContainer, OkButton, CancelButton, StyledModal } from "../../../../../common/styled";

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
  selectedClasses = [],
  bulkUpdateClasses,
  searchCourseList,
  coursesForDistrictList,
  userDetails,
  form,
  allTagsData,
  addNewTag,
  t
}) {
  const [value, setValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
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

    // end date should not be less than the start date
    let isInvalidEndDate = false;
    if (updateMode === "endDate") {
      isInvalidEndDate = selectedClasses.some(({ _source = {} }) => updatedData < _source.startDate);
    }

    if (isInvalidEndDate) {
      return notification({ messageKey:"startDateGreaterThanEndDate"});
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
    const tempSearchValue = searchValue;
    if (id === searchValue) {
      setSearchValue("");
      try {
        const { _id, tagName } = await tagsApi.create({ tagName: tempSearchValue, tagType: "group" });
        newTag = { _id, tagName };
        addNewTag({ tag: newTag, tagType: "group" });
      } catch (e) {
        notification({ messageKey:"savingTagFailed"});
      }
    } else {
      newTag = allTagsData.find(tag => tag._id === id);
    }
    const tagsSelected = getFieldValue("tags") || [];
    const newTags = uniq([...tagsSelected, newTag._id]);
    setFieldsValue({ tags: newTags.filter(tag => tag !== tempSearchValue) });
    setSearchValue("");
  };

  const deselectTags = id => {
    const tagsSelected = getFieldValue("tags");
    const newTags = tagsSelected.filter(tag => tag !== id);
    setFieldsValue({ tags: newTags });
  };

  const searchTags = async value => {
    if (allTagsData.some(tag => tag.tagName === value || tag.tagName === value.trim())) {
      setSearchValue("");
    } else {
      setSearchValue(value);
    }
  };

  const disabledDate = current => current && current < moment().startOf("day");

  const renderEditableView = () => {
    switch (updateMode) {
      case "course":
        return (
          <div>
            <span>{t("class.components.bulkedit.chosecourse")}</span>
            <Select
              style={{ width: "100%" }}
              showSearch
              onSearch={fetchCoursesForDistrict}
              notFoundContent={null}
              placeholder="Please enter 1 or more characters"
              onChange={val => setValue(val)}
              filterOption={false}
              getPopupContainer={triggerNode => triggerNode.parentNode}
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
            <div>{t("class.components.bulkedit.addtags")}</div>
            {getFieldDecorator("tags")(
              <Select
                data-cy="tagsSelect"
                mode="multiple"
                style={{ marginBottom: 0, width: "100%" }}
                optionLabelProp="title"
                placeholder={t("class.components.bulkedit.selecttags")}
                onSearch={searchTags}
                onSelect={selectTags}
                onDeselect={deselectTags}
                filterOption={(input, option) => option.props.title.toLowerCase().includes(input.trim().toLowerCase())}
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {!!searchValue.trim() ? (
                  <Select.Option key={0} value={searchValue} title={searchValue}>
                    {`${searchValue} (Create new Tag)`}
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
            <span>{t("class.components.bulkedit.choseenddate")}</span>
            <DatePicker disabledDate={disabledDate} onChange={date => setValue(date.valueOf())} format="ll" />
          </div>
        );
      default:
        return <span>{t("class.components.bulkedit.default")}</span>;
    }
  };

  const selectedClassesWithDateFormat = selectedClasses.map(data => {
    const { _source = {} } = data;
    if (_source.endDate) _source.endDate = moment(_source.endDate).format("ll");
    return data;
  });

  return (
    <StyledModal
      visible={showModal}
      title={t("class.components.bulkedit.title")}
      onCancel={onCloseModal}
      maskClosable={false}
      footer={[
        updateView ? (
          <AntdButton key="update" onClick={handleSubmit}>
            {t("class.components.bulkedit.updateclasses")}
          </AntdButton>
        ) : (
          <ButtonsContainer gutter={5}>
            <Col span={10}>
              <CancelButton onClick={onCloseModal}>{t("class.components.bulkedit.cancel")}</CancelButton>
            </Col>
            <Col span={11}>
              <OkButton onClick={() => setBulkEditUpdateView(true)}>{t("class.components.bulkedit.proceed")}</OkButton>
            </Col>
          </ButtonsContainer>
        )
      ]}
    >
      {updateView ? (
        <>
          <Button onClick={() => setBulkEditUpdateView(false)} noStyle>
            <Icon type="left" />
            {t("class.components.bulkedit.back")}
          </Button>
          <Table
            rowKey={record => record._id}
            dataSource={selectedClassesWithDateFormat}
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
          <RadioGrp onChange={evt => setBulkEditMode(evt.target.value)} value={updateMode}>
            <RadioBtn value="course">{t("class.components.bulkedit.changecourseassociation")}</RadioBtn>
            <RadioBtn value="tags">{t("class.components.bulkedit.updatetags")}</RadioBtn>
            <RadioBtn value="endDate">{t("class.components.bulkedit.updateenddate")}</RadioBtn>
          </RadioGrp>
        </>
      )}
    </StyledModal>
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
