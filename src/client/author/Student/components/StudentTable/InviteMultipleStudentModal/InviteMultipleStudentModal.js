import React, { Component } from "react";
import { connect } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Form, Row, Col, Button, Modal, Select, Tabs, Input, Icon } from "antd";
import { get } from "lodash";
import { userApi } from "@edulastic/api";
import { roleuser } from "@edulastic/constants";
import {
  StyledTextArea,
  PlaceHolderText,
  SelUserKindDiv,
  ItemDiv,
  Text,
  IconWrapper,
  ColWrapper,
  ActionButton,
  StyledModal,
  StyledSearch,
  ModalCloseIconWrapper,
  SearchViewContainer,
  AddBulkStudentsViewContainer,
  SearchTabButton,
  AddMultipleStudentsTabButton,
  CancelButton,
  OkButton,
  ButtonsContainer,
  AddBulkUserPrimaryTextContainer,
  IconSwap
} from "./styled";
import FeaturesSwitch from "../../../../../features/components/FeaturesSwitch";
import { isFeatureAccessible } from "../../../../../features/components/FeaturesSwitch";
import { ModalFormItem } from "../AddStudentModal/styled";
import {
  themeColor,
  white,
  darkGrey1,
  fadedBlack,
  lightGreySecondary,
  greyScoreCardTitleColor,
  lightGrey4
} from "@edulastic/colors";
import { IconClose, IconCorrect } from "@edulastic/icons";

const { TabPane } = Tabs;
const Search = Input.Search;
const Item = ({ item, moveItem, isEnrolled }) => {
  const handleClick = () => {
    moveItem(item);
  };

  return (
    <ItemDiv style={{ cursor: !isEnrolled && "pointer" }} onClick={!isEnrolled ? handleClick : null}>
      <Text>
        {item.firstName} {item.lastName}
      </Text>
      <Row type="flex" align="middle">
        <Col span={18}>
          <Text>{item._source.email}</Text>
        </Col>
        <Col span={6}> {isEnrolled && <IconCorrect />}</Col>
      </Row>
    </ItemDiv>
  );
};

const FormItem = Form.Item;
const Option = Select.Option;

class InviteMultipleStudentModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placeHolderVisible: true,
      curSel: "google",
      allStudents: [],
      studentsToEnroll: [],
      searchViewVisible: true
    };
  }

  onInviteStudents = () => {
    this.props.form.validateFields((err, row) => {
      if (!err) {
        const { curSel } = this.state;
        let studentsList = [];
        let provider = "fl";
        const lines = row.students.split(/;|\n/);
        for (let i = 0; i < lines.length; i++) {
          if (lines[i] !== "") {
            studentsList.push(lines[i]);
          }
        }
        this.props.inviteStudents({
          userDetails: studentsList,
          institutionId: row.institutionId,
          provider: curSel
        });
      }
    });
  };

  validateStudentsList = (rule, value, callback) => {
    const { curSel } = this.state;
    const lines = value.split("\n");
    let isValidate = true;
    if (curSel === "fl" || curSel === "lf") {
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].split(" ").length > 2) {
          isValidate = false;
          break;
        }
      }
    } else if (curSel === "google" || curSel === "mso") {
      for (let i = 0; i < lines.length; i++) {
        if (!this.checkValidEmail(lines[i])) {
          isValidate = false;
          break;
        }
      }
    }

    if (isValidate) {
      callback();
      return;
    } else {
      if (curSel === "fl") callback('Username should be in "FirstName LastName"');
      else if (curSel === "lf") {
        callback('Username should be in "LastName FirstName"');
      } else if (curSel === "google" || curSel === "mso") {
        callback("Username should be in email format");
      }
    }
  };

  checkValidEmail(strEmail) {
    var re1 = /^(([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)(\s*;\s*|\s*$))*$/;
    return re1.test(String(strEmail).toLowerCase());
  }

  onCloseModal = () => {
    this.props.closeModal();
  };

  handleChangeTextArea = e => {
    if (e.target.value.length > 0) this.setState({ placeHolderVisible: false });
    else this.setState({ placeHolderVisible: true });
  };

  handleChange = value => {
    const { setProvider } = this.props;
    this.setState({ curSel: value });
    setProvider(value);
  };

  handleSearch = async e => {
    const districtId = this.props.userOrgId;
    const searchKey = e.target.value.trim();
    const searchData = {
      districtId,
      limit: 1000,
      page: 1,
      role: "student"
    };
    searchKey &&
      Object.assign(searchData, {
        search: {
          email: [{ type: "cont", value: searchKey }]
        }
      });
    if (searchKey.length > 0) {
      const result = await userApi.fetchUsers(searchData);
      this.setState({ allStudents: result.result });
    } else {
      this.setState({
        allStudents: [],
        studentsToEnroll: []
      });
    }
  };

  moveItem = item => {
    const email = item._source.email;
    const { allStudents, studentsToEnroll } = this.state;
    const inAllStudentsBox = allStudents.filter(std => std._source.email === email).length > 0;
    if (inAllStudentsBox) {
      const newAllStudents = allStudents.filter(std => std._source.email !== email);
      this.setState({
        ...this.state,
        allStudents: newAllStudents,
        studentsToEnroll: [item, ...studentsToEnroll]
      });
    } else {
      const newStudentsToEnroll = studentsToEnroll.filter(std => std._source.email !== email);
      this.setState({
        ...this.state,
        allStudents: [item, ...allStudents],
        studentsToEnroll: newStudentsToEnroll
      });
    }
  };

  onAddMultipleStudents = async () => {
    const {
      setinfoModelVisible,
      setInfoModalData,
      selectedClass,
      setIsAddMultipleStudentsModal,
      loadStudents
    } = this.props;
    const { studentsToEnroll } = this.state;
    const data = {
      userDetails: studentsToEnroll.map(std => std._id)
    };
    const { _id: classId } = selectedClass;
    const result = await userApi.SearchAddEnrolMultiStudents(selectedClass.code, data);
    setIsAddMultipleStudentsModal(false);
    setInfoModalData(result.data.result);
    setinfoModelVisible(true);
    loadStudents({ classId });
  };

  addStudents = () => {
    const { searchViewVisible } = this.state;
    if (searchViewVisible) {
      this.onAddMultipleStudents();
    } else {
      this.onInviteStudents();
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      modalVisible,
      setIsAddMultipleStudentsModal,
      setinfoModelVisible,
      setInfoModalData,
      orgData,
      studentsList,
      selectedClass,
      loadStudents,
      features,
      role
    } = this.props;

    const { placeHolderVisible, curSel, allStudents, studentsToEnroll, searchViewVisible } = this.state;
    const { classList = [], searchAndAddStudents = false, schools = [] } = orgData || {};
    const isPremium = isFeatureAccessible({
      features,
      inputFeatures: "searchAndAddStudent",
      groupId: selectedClass ? selectedClass._id : "",
      groupList: classList
    });
    const allLists =
      allStudents.length > 0
        ? allStudents.map(item => {
            const isEnrolled =
              studentsList.filter(student => student.email === item._source.email && student.enrollmentStatus == 1)
                .length > 0;
            return <Item key={item._id} item={item} moveItem={this.moveItem} isEnrolled={isEnrolled} />;
          })
        : null;

    const toEnrollLists =
      studentsToEnroll.length > 0
        ? studentsToEnroll.map(item => <Item key={item._id} item={item} moveItem={this.moveItem} orgData={orgData} />)
        : null;

    let placeHolderComponent;
    if (curSel === "google") {
      placeHolderComponent = (
        <PlaceHolderText visible={placeHolderVisible}>
          Enter email like...
          <br />
          john.doe@yourschool.com
          <br />
          john.doe@yourschool.com
          <br />
          ...
        </PlaceHolderText>
      );
    } else if (curSel === "mso") {
      placeHolderComponent = (
        <PlaceHolderText visible={placeHolderVisible}>
          Enter email like...
          <br />
          john.doe@yourschool.com
          <br />
          john.doe@yourschool.com
          <br />
          ...
        </PlaceHolderText>
      );
    } else if (curSel === "fl") {
      placeHolderComponent = (
        <PlaceHolderText visible={placeHolderVisible}>
          Enter first and last names like...
          <br />
          John Doe
          <br />
          Jane Doe
          <br />
          ...
        </PlaceHolderText>
      );
    } else if (curSel === "lf") {
      placeHolderComponent = (
        <PlaceHolderText visible={placeHolderVisible}>
          Enter last and first names like...
          <br />
          Doe John
          <br />
          Doe Jane
          <br />
          ...
        </PlaceHolderText>
      );
    }
    const defaultSchoolId = schools.length ? schools[0]._id : "";
    return (
      <StyledModal
        visible={modalVisible}
        onOk={this.onInviteStudents}
        onCancel={this.onCloseModal}
        maskClosable={false}
        footer={null}
        closable={false}
        centered
      >
        <Row>
          <Col span={13}>
            <SearchTabButton
              data-cy="searchStudent"
              searchViewVisible={searchViewVisible}
              onClick={() => this.setState({ ...this.setState, searchViewVisible: true })}
            >
              Search exisitng student and add
            </SearchTabButton>
          </Col>
          <Col span={9}>
            <AddMultipleStudentsTabButton
              data-cy="addMultipleStudent"
              searchViewVisible={searchViewVisible}
              onClick={() => this.setState({ ...this.setState, searchViewVisible: false })}
            >
              Add multiple students
            </AddMultipleStudentsTabButton>
          </Col>
          <ModalCloseIconWrapper span={2}>
            <IconClose color="black" width="15px" height="15px" onClick={this.onCloseModal} />
          </ModalCloseIconWrapper>
        </Row>
        {searchViewVisible ? (
          <SearchViewContainer>
            <Row>
              <Col> Search and select existing students from your district and add</Col>
            </Row>
            <Row>
              <StyledSearch
                placeholder="Type student name or email"
                onSearch={this.handleSearch}
                onChange={this.handleSearch}
                enterButton
              />
            </Row>
            {(allStudents.length > 0 || studentsToEnroll.length > 0) && (
              <Row type="flex" justify="space-between" align="middle">
                <ColWrapper span={11}>
                  <PerfectScrollbar>{allLists ? allLists : <div />}</PerfectScrollbar>
                </ColWrapper>
                <Col span={2}>
                  <IconSwap type="swap" />
                </Col>
                <ColWrapper span={11}>
                  <PerfectScrollbar>{toEnrollLists ? toEnrollLists : <div />}</PerfectScrollbar>
                </ColWrapper>
              </Row>
            )}
          </SearchViewContainer>
        ) : (
          <AddBulkStudentsViewContainer>
            <Row>
              <AddBulkUserPrimaryTextContainer span={15}>
                Add Students by typing or paste one or more student(s) names. User separate lines or semi-colon to add
                multiple students.
              </AddBulkUserPrimaryTextContainer>
            </Row>
            <SelUserKindDiv>
              <Col span={11}>Add students by their name</Col>
              <Col span={13}>
                <Select data-cy="studentType" onChange={this.handleChange} defaultValue="google">
                  <Option value="google">Google Usernames</Option>
                  <Option value="mso">Office 365 Usernames</Option>
                  <Option value="fl">Frist Name and Last Name</Option>
                  <Option value="lf">Last Name and First Name</Option>
                </Select>
              </Col>
            </SelUserKindDiv>
            <Row>
              <Col span={24}>
                <FormItem style={{ marginBottom: "0px" }}>
                  {placeHolderComponent}
                  {getFieldDecorator("students", {
                    rules: [
                      {
                        required: true,
                        message: "No user Informtaion added."
                      },
                      {
                        validator: !placeHolderVisible && this.validateStudentsList
                      }
                    ]
                  })(<StyledTextArea row={10} onChange={this.handleChangeTextArea} />)}
                </FormItem>
              </Col>
            </Row>
            {curSel === "fl" || curSel === "lf" ? (
              <p>
                {role === roleuser.TEACHER
                  ? `Class code (${
                      selectedClass.code
                    }) will be used as default password for these students, please ask the students to change their password once they login to their account.
                  `
                  : `'edulastic' will be used as default password for these students, please ask the students to change
                  their password once they login to their account.`}
              </p>
            ) : null}
            {role === roleuser.SCHOOL_ADMIN ? (
              <Row>
                <Col span={24}>
                  <ModalFormItem label="Select School">
                    {getFieldDecorator("institutionId", {
                      rules: [
                        {
                          required: true,
                          message: "Please select school"
                        }
                      ],
                      initialValue: defaultSchoolId
                    })(
                      <Select placeholder="Select school">
                        {schools.map(school => (
                          <Option key={school._id} value={school._id}>
                            {school.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </ModalFormItem>
                </Col>
              </Row>
            ) : null}
          </AddBulkStudentsViewContainer>
        )}

        <ButtonsContainer gutter={5}>
          <Col span={7}>
            <CancelButton onClick={this.onCloseModal}>No, cancel</CancelButton>
          </Col>
          <Col span={7}>
            <OkButton
              data-cy="addStudents"
              onClick={() => {
                this.addStudents();
              }}
            >
              Yes, Add to class
            </OkButton>
          </Col>
        </ButtonsContainer>
      </StyledModal>
    );
  }
}

const ConnectedInviteMultipleStudentModal = connect(
  state => ({
    orgData: get(state, "user.user.orgData", {}),
    role: get(state, "user.user.role", null)
  }),
  {}
)(InviteMultipleStudentModal);

const InviteMultipleStudentModalForm = Form.create()(ConnectedInviteMultipleStudentModal);
export default InviteMultipleStudentModalForm;
