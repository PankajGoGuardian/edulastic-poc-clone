import React, { Component } from "react";
import { get, debounce } from "lodash";
import { Form, Input, Row, Col, Select, Modal, Spin, message } from "antd";
import { schoolApi, userApi, tagsApi } from "@edulastic/api";
import { ModalFormItem, StyledModal } from "./styled";
import selectsData from "../../../../TestPage/components/common/selectsData";
import { ThemeButton } from "../../../../src/components/common/ThemeButton";

const { Option } = Select;
const { allGrades } = selectsData;

class AddClassModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schoolList: [],
      fetchingSchool: false,
      teacherList: [],
      fetchingTeacher: [],
      searchValue: ""
    };
    this.fetchSchool = debounce(this.fetchSchool, 1000);
    this.fetchTeacher = debounce(this._fetchTeacher, 1000);
    this.fetchCoursesForDistrict = debounce(this.fetchCoursesForDistrict, 1000);
  }
  selectTeacherRef = React.createRef();

  onAddClass = () => {
    this.props.form.validateFieldsAndScroll((err, user) => {
      if (!err) {
        const { teacher, name, institutionId, subject, tags, courseId, grades } = user;
        const { allTagsData } = this.props;

        const createClassData = {
          name,
          type: "class",
          owners: [teacher.key],
          institutionId: institutionId.key,
          subject: subject ? subject : "Other Subjects",
          tags: tags && tags.map(t => allTagsData.find(o => o._id === t)),
          courseId,
          // here multiple grades has to be sent as a comma separated string
          grades: grades,
          // not implemented in add model so sending empty
          standardSets: []
        };
        this.props.addClass(createClassData);
      }
    });
  };

  onCloseModal = () => {
    this.props.closeModal();
  };

  fetchSchool = async value => {
    // here searchParams is added only when value exists
    const searchParam = value ? { search: { name: [{ type: "cont", value }] } } : {};
    this.setState({ schoolList: [], fetchingSchool: true });
    const schoolListData = await schoolApi.getSchools({
      districtId: this.props.userOrgId,
      limit: 25,
      page: 1,
      sortField: "name",
      order: "asc",
      ...searchParam
    });
    this.setState({ schoolList: schoolListData.data, fetchingSchool: false });
  };

  handleSchoolChange = () => {
    // this code was commented out since the form handles setting of fields automatically, and
    // there is no need to manually set fields
    // this.props.form.setFieldsValue({ institutionId: value });
    this.setState({
      schoolList: [],
      fetchingSchool: false
    });
  };

  fetchCoursesForDistrict = value => {
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
  };

  _fetchTeacher = async value => {
    this.setState({ teacherList: [], fetchingTeacher: true });
    const searchData = {
      districtId: this.props.userOrgId,
      limit: 25,
      page: 1,
      role: "teacher"
    };

    value &&
      Object.assign(searchData, {
        search: {
          username: [{ type: "cont", value }]
        }
      });

    const { result: teacherListData } = await userApi.fetchUsers(searchData);
    this.setState({ teacherList: teacherListData, fetchingTeacher: false });
  };

  handleTeacherChange = value => {
    // this code was commented out since the form handles setting of fields automatically, and
    // there is no need to manually set fields
    //this.props.form.setFieldsValue({ teacher: value });
    this.setState({
      teacherList: [],
      fetchingTeacher: false
    });
    this.selectTeacherRef.current.blur();
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
    const { modalVisible, coursesForDistrictList, allTagsData } = this.props;
    const { fetchingSchool, schoolList, fetchingTeacher, teacherList, searchValue } = this.state;

    const { getFieldDecorator } = this.props.form;
    return (
      <StyledModal
        visible={modalVisible}
        title="Add Class"
        onOk={this.onAddClass}
        onCancel={this.onCloseModal}
        maskClosable={false}
        footer={[
          <ThemeButton type="primary" key="submit" onClick={this.onAddClass}>
            Add Class &gt;
          </ThemeButton>
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
                ]
              })(<Input placeholder="Class name" />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="Subject">
              {getFieldDecorator("subject")(
                <Select placeholder="Select Subject">
                  <Option value="Mathematics">Mathematics</Option>
                  <Option value="ELA">ELA</Option>
                  <Option value="Science">Science</Option>
                  <Option value="Social Studies">Social Studies</Option>
                  <Option value="Other Subjects">Other Subjects</Option>
                </Select>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="Grades">
              {getFieldDecorator("grades")(
                <Select mode="multiple" placeholder="Select Grades">
                  {allGrades.map(({ value, text }) => (
                    <Option key={value} value={value}>
                      {text}
                    </Option>
                  ))}
                </Select>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="Course">
              {getFieldDecorator("courseId")(
                <Select
                  showSearch
                  onSearch={this.fetchCoursesForDistrict}
                  onFocus={this.fetchCoursesForDistrict}
                  notFoundContent={null}
                  placeholder="Please enter 1 or more characters"
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
              {getFieldDecorator("tags")(
                <Select
                  data-cy="tagsSelect"
                  mode="multiple"
                  style={{ marginBottom: 0 }}
                  optionLabelProp="title"
                  placeholder="Select Tags"
                  onSearch={this.searchTags}
                  onSelect={this.selectTags}
                  onDeselect={this.deselectTags}
                  filterOption={(input, option) =>
                    option.props.title.toLowerCase().includes(input.trim().toLowerCase())
                  }
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
                ]
              })(
                <Select
                  labelInValue
                  placeholder="Search by Username - Please enter 3 or more characters"
                  notFoundContent={fetchingTeacher ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={this.fetchTeacher}
                  onFocus={this.fetchTeacher}
                  onChange={this.handleTeacherChange}
                  ref={this.selectTeacherRef}
                >
                  {teacherList.map(teacher => (
                    <Option key={teacher._id} value={teacher._id}>
                      {`${get(teacher, ["_source", "username"], "")}`}
                    </Option>
                  ))}
                </Select>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="Select School">
              {getFieldDecorator("institutionId", {
                rules: [
                  {
                    required: true,
                    message: "Please select school"
                  }
                ]
              })(
                <Select
                  showSearch
                  labelInValue
                  placeholder="Please Select schools"
                  notFoundContent={fetchingSchool ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={this.fetchSchool}
                  onChange={this.handleSchoolChange}
                  onFocus={this.fetchSchool}
                >
                  {schoolList.map(school => (
                    <Option key={school._id} value={school._id}>
                      {school._source.name}
                    </Option>
                  ))}
                </Select>
              )}
            </ModalFormItem>
          </Col>
        </Row>
      </StyledModal>
    );
  }
}

const AddClassModalForm = Form.create()(AddClassModal);
export default AddClassModalForm;
