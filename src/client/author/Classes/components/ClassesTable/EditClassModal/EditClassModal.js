import React, { Component } from "react";
import { Form, Input, Row, Col, Select, Button, Modal, DatePicker, message } from "antd";
import moment from "moment";
import { debounce } from "lodash";
const Option = Select.Option;
import selectsData from "../../../../TestPage/components/common/selectsData";
import { ModalFormItem, StyledModal } from "./styled";
const { allGrades, allSubjects } = selectsData;
import { tagsApi } from "@edulastic/api";
class EditClassModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: ""
    };
  }

  onSaveClass = () => {
    this.props.form.validateFields((err, row) => {
      const { selClassData: { _source: { parent, districtId, standardSets } = {} } = {}, allTagsData } = this.props;
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
          courseId: row.courseId,
          // not implemented in add model so sending empty if not present i.e. created in da settings
          standardSets: standardSets || [],
          courseId: row.courseId
        };
        this.props.saveClass(saveClassData);
        if (row.endDate) {
          Object.assign(saveClassData, { endDate: row.endDate.valueOf() });
        }
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
    const { modalVisible, selClassData, schoolsData, teacherList, coursesForDistrictList, allTagsData } = this.props;
    const { searchValue } = this.state;
    const {
      _source: { owners = [], name, subject, institutionId, institutionName, grades, tags, endDate, course } = {}
    } = selClassData;
    const ownersData = owners.map(row => row.id);
    const schoolsOptions = [];
    if (schoolsData.length !== undefined) {
      schoolsData.map((row, index) => {
        schoolsOptions.push(
          <Option key={row._id} value={row._id} title={row.name}>
            {row.name}
          </Option>
        );
      });
    }

    const teacherOptions = [];
    if (teacherList.length !== undefined) {
      teacherList.map(row => {
        const teacherName = row.lastName ? `${row.firstName} ${row.lastName}` : `${row.firstName}`;
        teacherOptions.push(<Option value={row._id}>{teacherName}</Option>);
      });
    }

    const alreadySelectedTags = tags.map(e => e._id);

    const subjects = allSubjects.filter(el => el.value !== "");

    const { getFieldDecorator } = this.props.form;
    const {} = this.props;
    return (
      <StyledModal
        visible={modalVisible}
        title="Edit Class"
        onOk={this.onSaveClass}
        onCancel={this.onCloseModal}
        maskClosable={false}
        footer={[
          <Button type="primary" key="submit" onClick={this.onSaveClass}>
            Save Class >
          </Button>
        ]}
      >
        <Row>
          <Col span={24}>
            <ModalFormItem label="Class Name">
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: "Please input class name"
                  }
                ],
                initialValue: name
              })(<Input placeholder="Class name" />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="Subject">
              {getFieldDecorator("subject", {
                initialValue: subject
              })(
                <Select placeholder="Select Subject" getPopupContainer={triggerNode => triggerNode.parentNode}>
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
            <ModalFormItem label="Grades">
              {getFieldDecorator("grades", {
                initialValue: grades
              })(
                <Select
                  placeholder="Select Grades"
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
            <ModalFormItem label="Course">
              {getFieldDecorator("courseId", {
                initialValue: course && course.id
              })(
                <Select
                  showSearch
                  placeholder="Please enter 1 or more characters"
                  onSearch={this.fetchCoursesForDistrict}
                  onFocus={this.fetchCoursesForDistrict}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  {coursesForDistrictList.map(course => (
                    <Option key={course._id} value={course._id}>{`${course.name} - ${course.number}`}</Option>
                  ))}
                </Select>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="Tags">
              {getFieldDecorator("tags", {
                initialValue: alreadySelectedTags
              })(
                <Select
                  placeholder="Please enter 2 or more characters"
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
            <ModalFormItem label="Teacher Name">
              {getFieldDecorator("teacher", {
                rules: [
                  {
                    required: true,
                    message: "Please select teacher"
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
            <ModalFormItem label="School">
              {getFieldDecorator("institutionId", {
                rules: [
                  {
                    required: true,
                    message: "Please select school"
                  }
                ],
                initialValue: institutionId
              })(
                <Select placeholder="Select School" getPopupContainer={triggerNode => triggerNode.parentNode}>
                  {schoolsOptions}
                </Select>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="End Date">
              {getFieldDecorator("endDate", {
                initialValue: moment(endDate)
              })(<DatePicker />)}
            </ModalFormItem>
          </Col>
        </Row>
      </StyledModal>
    );
  }
}

const EditClassModalForm = Form.create()(EditClassModal);
export default EditClassModalForm;
