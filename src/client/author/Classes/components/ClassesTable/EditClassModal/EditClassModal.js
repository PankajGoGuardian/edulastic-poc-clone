import React, { Component } from "react";
import { Form, Input, Row, Col, Select, Button, Modal, DatePicker, message } from "antd";
import moment from "moment";
import { debounce, uniqBy } from "lodash";
const Option = Select.Option;
import selectsData from "../../../../TestPage/components/common/selectsData";
const { allGrades, allSubjects } = selectsData;
import { tagsApi } from "@edulastic/api";
import { ButtonsContainer, OkButton, CancelButton, ModalFormItem, StyledModal } from "../../../../../common/styled";
class EditClassModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: ""
    };
  }

  onSaveClass = () => {
    this.props.form.validateFields((err, row) => {
      const {
        selClassData: { _source: { parent, districtId, standardSets, startDate } = {} } = {},
        allTagsData
      } = this.props;
      if (!err) {
        const saveClassData = {
          name: row.name,
          type: "class",
          owners: [row.teacher],
          parent,
          districtId,
          institutionId: row.institutionId,
          subject: row.subject,
          grades: row.grades,
          tags: row.tags.map(t => allTagsData.find(e => e._id === t)),
          // not implemented in add model so sending empty if not present i.e. created in da settings
          standardSets: standardSets || [],
          courseId: row.courseId
        };

        const endDate = row?.endDate?.valueOf();

        if (startDate && endDate) {
          // end date should not be less than the start date
          let isInvalidEndDate = false;
          isInvalidEndDate = startDate > endDate;

          if (isInvalidEndDate) {
            return message.error("start date is greater than end date");
          }

          Object.assign(saveClassData, { endDate });
        }

        this.props.saveClass(saveClassData);
      }
    });
  };

  fetchCoursesForDistrict = debounce(value => {
    const { userOrgId: districtId, searchCourseList } = this.props;
    const searchTerms = {
      districtId,
      active: 1,
      page: 0,
      limit: 50
    };
    value &&
      Object.assign(searchTerms, {
        search: {
          name: { type: "cont", value },
          number: { type: "cont", value },
          operator: "or"
        }
      });
    searchCourseList(searchTerms);
  }, 1000);

  onCloseModal = () => {
    this.props.closeModal();
  };

  selectTags = async id => {
    const { setFieldsValue, getFieldValue } = this.props.form;
    const { searchValue } = this.state;
    const { allTagsData, addNewTag } = this.props;
    let newTag = {};
    if (id === searchValue) {
      const tempSearchValue = searchValue;
      this.setState({ searchValue: "" });
      try {
        const { _id, tagName } = await tagsApi.create({ tagName: tempSearchValue, tagType: "group" });
        newTag = { _id, tagName };
        addNewTag({ tag: newTag, tagType: "group" });
      } catch (e) {
        message.error("Saving tag failed");
      }
    } else {
      newTag = allTagsData.find(tag => tag._id === id);
    }
    const tagsSelected = getFieldValue("tags");
    const newTags = [...tagsSelected, newTag._id];
    setFieldsValue({ tags: newTags.filter(t => t !== searchValue) });
    this.setState({ searchValue: "" });
  };

  deselectTags = id => {
    const { setFieldsValue, getFieldValue } = this.props.form;
    const tagsSelected = getFieldValue("tags");
    const newTags = tagsSelected.filter(tag => tag !== id);
    setFieldsValue({ tags: newTags });
  };

  searchTags = async value => {
    const { allTagsData } = this.props;
    if (allTagsData.some(tag => tag.tagName === value || tag.tagName === value.trim())) {
      this.setState({ searchValue: "" });
    } else {
      this.setState({ searchValue: value });
    }
  };

  render() {
    const {
      modalVisible,
      selClassData,
      schoolsData = [],
      teacherList = [],
      coursesForDistrictList = [],
      allTagsData,
      t,
      institutionDetails = []
    } = this.props;
    const { searchValue } = this.state;
    const {
      _source: {
        owners = [],
        name,
        subject,
        institutionId = "",
        institutionName = "",
        grades,
        tags,
        endDate,
        course = {}
      } = {}
    } = selClassData;

    let courseFinalList = [...coursesForDistrictList];
    if (course?.id) {
      courseFinalList.push({ _id: course.id, name: course.name });
      courseFinalList = uniqBy(courseFinalList, "_id");
    }

    let teacherFinalList = [...teacherList];
    if (owners.length) {
      teacherFinalList.push({ _id: owners[0]?.id, firstName: owners[0]?.name });
      teacherFinalList = uniqBy(teacherFinalList, "_id");
    }

    let schoolsFinalList = [...schoolsData];
    if (institutionId && institutionName) {
      schoolsFinalList.push({ _id: institutionId, name: institutionName });
      schoolsFinalList = uniqBy(schoolsFinalList, "_id");
    }

    const ownersData = owners?.[0]?.id;
    const schoolsOptions = [];
    if (schoolsFinalList.length) {
      schoolsFinalList.map((row, index) => {
        schoolsOptions.push(
          <Option key={row._id} value={row._id} title={row.name}>
            {row.name}
          </Option>
        );
      });
    }

    const teacherOptions = [];
    if (teacherFinalList.length) {
      teacherFinalList.map(row => {
        const teacherName = row.lastName ? `${row.firstName} ${row.lastName}` : `${row.firstName}`;
        teacherOptions.push(<Option value={row._id}>{teacherName}</Option>);
      });
    }

    const alreadySelectedTags = tags.map(e => e._id);

    const subjects = allSubjects.filter(el => el.value !== "");

    const { getFieldDecorator } = this.props.form;

    const disabledDate = current => current && current < moment().startOf("day");

    return (
      <StyledModal
        visible={modalVisible}
        title={t("class.components.editclass.title")}
        onOk={this.onSaveClass}
        onCancel={this.onCloseModal}
        maskClosable={false}
        footer={[
          <ButtonsContainer gutter={5}>
            <Col span={10}>
              <CancelButton onClick={this.onCloseModal}>{t("common.cancel")}</CancelButton>
            </Col>
            <Col span={11}>
              <OkButton onClick={this.onSaveClass}>{t("class.components.addclass.saveclass")}</OkButton>
            </Col>
          </ButtonsContainer>
        ]}
      >
        <Row>
          <Col span={24}>
            <ModalFormItem label={t("class.components.addclass.classname")}>
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: t("class.components.addclass.validation.class")
                  }
                ],
                initialValue: name
              })(<Input placeholder={t("class.components.addclass.classname")} />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t("class.components.addclass.subject")}>
              {getFieldDecorator("subject", {
                initialValue: subject
              })(
                <Select
                  placeholder={t("class.components.addclass.selectsubject")}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  {subjects.map(el => (
                    <Select.Option key={el.value} value={el.value}>
                      {el.text}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t("class.components.addclass.grade")}>
              {getFieldDecorator("grades", {
                initialValue: grades
              })(
                <Select
                  placeholder={t("class.components.addclass.selectgrade")}
                  mode="multiple"
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  {allGrades.map(el => (
                    <Select.Option key={el.value} value={el.value}>
                      {el.text}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t("class.components.addclass.course")}>
              {getFieldDecorator("courseId", {
                initialValue: course && course.id
              })(
                <Select
                  showSearch
                  placeholder={t("class.components.addclass.placeholder.course")}
                  onSearch={this.fetchCoursesForDistrict}
                  onFocus={this.fetchCoursesForDistrict}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  {courseFinalList.map(course => (
                    <Option key={course._id} value={course._id}>{`${course.name}${
                      course.number ? " - " + course.number : ""
                    }`}</Option>
                  ))}
                </Select>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t("class.components.addclass.tags")}>
              {getFieldDecorator("tags", {
                initialValue: alreadySelectedTags
              })(
                <Select
                  placeholder={t("class.components.addclass.placeholder.tags")}
                  data-cy="tagsSelect"
                  mode="multiple"
                  style={{ marginBottom: 0 }}
                  optionLabelProp="title"
                  onSearch={this.searchTags}
                  onSelect={this.selectTags}
                  onDeselect={this.deselectTags}
                  filterOption={(input, option) =>
                    option.props.title.toLowerCase().includes(input.trim().toLowerCase())
                  }
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
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t("class.components.addclass.teachername")}>
              {getFieldDecorator("teacher", {
                rules: [
                  {
                    required: true,
                    message: t("class.components.addclass.validation.teacher")
                  }
                ],
                initialValue: ownersData
              })(
                <Select placeholder="Search by Username" getPopupContainer={triggerNode => triggerNode.parentNode}>
                  {teacherOptions}
                </Select>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t("class.components.addclass.schoolname")}>
              {getFieldDecorator("institutionId", {
                rules: [
                  {
                    required: true,
                    message: t("class.components.addclass.validation.school")
                  }
                ],
                initialValue: institutionId
              })(
                <Select
                  placeholder={t("class.components.addclass.selectschool")}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  {schoolsOptions}
                </Select>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t("class.components.editclass.enddate")}>
              {getFieldDecorator("endDate", {
                initialValue: moment(endDate)
              })(<DatePicker disabledDate={disabledDate} style={{ width: "100%" }} format="ll" />)}
            </ModalFormItem>
          </Col>
        </Row>
      </StyledModal>
    );
  }
}

const EditClassModalForm = Form.create()(EditClassModal);
export default EditClassModalForm;
