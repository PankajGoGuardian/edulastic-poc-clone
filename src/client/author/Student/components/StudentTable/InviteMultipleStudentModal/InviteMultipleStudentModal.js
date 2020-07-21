import { userApi } from "@edulastic/api";
import { CustomModalStyled, EduButton, SelectInputStyled } from "@edulastic/common";
import { roleuser } from "@edulastic/constants";
import { IconCorrect } from "@edulastic/icons";
import { Col, Form, Row, Select } from "antd";
import { get } from "lodash";
import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import PerfectScrollbar from "react-perfect-scrollbar";
import { connect } from "react-redux";
import { compose } from "redux";
import { ModalFormItem } from "../AddStudentModal/styled";
import {
  AddBulkStudentsViewContainer,
  AddBulkUserPrimaryTextContainer,
  AddMultipleStudentsTabButton,
  ButtonsContainer,
  ColWrapper,
  IconSwap,
  ItemDiv,
  ItemText,
  PlaceHolderText,
  SearchTabButton,
  SearchViewContainer,
  SelUserKindDiv,
  StyledSearch,
  StyledTextArea,
  Text
} from "./styled";

const Item = ({ item, moveItem, isEnrolled }) => {
  const handleClick = () => {
    moveItem(item);
  };

  const { _source: source } = item;
  const { username, firstName, lastName } = source;
  const fullName = (`${firstName ? `${firstName} ` : ""}${lastName || ''}`) || 'Anonymous';

  return (
    <ItemDiv style={{ cursor: !isEnrolled && "pointer" }} onClick={!isEnrolled ? handleClick : null}>
      <ItemText>
        {fullName}
      </ItemText>
      <Row type="flex" align="middle">
        <Col span={18}>
          <Text>{username}</Text>
        </Col>
        <Col span={6}> {isEnrolled && <IconCorrect />}</Col>
      </Row>
    </ItemDiv>
  );
};

const FormItem = Form.Item;
const { Option } = Select;

class InviteMultipleStudentModal extends Component {
  constructor(props) {
    super(props);
    const { searchAndAddStudents = false } = props;
    this.state = {
      placeHolderVisible: true,
      curSel: "google",
      allStudents: [],
      studentsToEnroll: [],
      searchViewVisible: searchAndAddStudents
    };
  }

  onInviteStudents = () => {
    const { form, inviteStudents } = this.props;
    form.validateFields((err, row) => {
      if (!err) {
        const { curSel } = this.state;
        const studentsList = row.students ? row.students.split(/;|\n/).filter(_o => _o.trim().length) : [];
        if (studentsList.length) {
          inviteStudents({
            userDetails: studentsList,
            institutionId: row.institutionId,
            provider: curSel
          });
        }
      }
    });
  };

  validateStudentsList = (rule, value, callback) => {
    const { curSel } = this.state;
    const lines = value ? value.split(/;|\n/).filter(_o => _o.trim().length) : [];
    let isValidate = true;
    if (lines.length) {
      if (curSel === "google" || curSel === "mso") {
        for (let i = 0; i < lines.length; i++) {
          if (!this.checkValidEmail(lines[i])) {
            isValidate = false;
            break;
          }
        }
      }
    } else {
      callback("No user information added.");
    }

    if (isValidate) {
      callback();
    } else if (curSel === "google" || curSel === "mso") {
      callback("Username should be in email format");
    }
  };

  checkValidEmail = strEmail => {
    const re1 = /^(([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)(\s*;\s*|\s*$))*$/;
    return re1.test(String(strEmail).toLowerCase());
  };

  onCloseModal = () => {
    const { closeModal } = this.props;
    closeModal();
  };

  handleChangeTextArea = e => {
    if (e.target.value.length > 0) this.setState({ placeHolderVisible: false });
    else this.setState({ placeHolderVisible: true });
  };

  handleChange = value => {
    const { setProvider, form } = this.props;
    this.setState({ curSel: value });
    setProvider && setProvider(value);
    /**
     * when the type of provider changes we need to update their validation also
     */
    const textValue = form.getFieldValue("students") || "";
    if (textValue.length) {
      form.setFieldsValue({ students: form.getFieldValue("students") }, () => {
        form.validateFields(["students"], { force: true });
      });
    } else {
      /**
       * to remove the require field validator on provider type change
       */
      form.setFields({
        students: {
          error: null
        }
      });
    }
  };

  handleSearch = async e => {
    const { userOrgId } = this.props;
    const searchKey = e.target.value.trim();
    const searchData = {
      districtId: userOrgId,
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
    const { email } = item._source;
    const { allStudents, studentsToEnroll } = this.state;
    const inAllStudentsBox = allStudents.filter(std => std._source.email === email).length > 0;
    if (inAllStudentsBox) {
      const newAllStudents = allStudents.filter(std => std._source.email !== email);
      this.setState({
        allStudents: newAllStudents,
        studentsToEnroll: [item, ...studentsToEnroll]
      });
    } else {
      const newStudentsToEnroll = studentsToEnroll.filter(std => std._source.email !== email);
      this.setState({
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
    const {
      modalVisible,
      orgData,
      studentsList,
      selectedClass,
      role,
      policy,
      t,
      form,
      searchAndAddStudents = false
    } = this.props;
    const { getFieldDecorator } = form;
    const { googleUsernames = true, office365Usernames = true, firstNameAndLastName = true } = policy;
    const { placeHolderVisible, curSel, allStudents, studentsToEnroll, searchViewVisible } = this.state;
    const { schools = [] } = orgData || {};
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
      <CustomModalStyled
        title={t("users.student.invitestudents.tab2")}
        visible={modalVisible}
        onOk={this.onInviteStudents}
        onCancel={this.onCloseModal}
        maskClosable={false}
        footer={[
          <ButtonsContainer>
            <EduButton isGhost onClick={this.onCloseModal}>
              <span>{t("users.student.invitestudents.nocancel")}</span>
            </EduButton>
            <EduButton data-cy="addStudents" onClick={() => { this.addStudents() }}>
              <span>{t("users.student.invitestudents.addtoclass")}</span>
            </EduButton>
          </ButtonsContainer>
        ]}
        centered
      >
        <Row gutter={4} type="flex" justify="space-between">
          {searchAndAddStudents && (
            <Col span={13}>
              <SearchTabButton
                data-cy="searchStudent"
                searchViewVisible={searchViewVisible}
                onClick={() => this.setState({ ...this.setState, searchViewVisible: true })}
              >
                {t("users.student.invitestudents.tab1")}
              </SearchTabButton>
            </Col>
          )}
          <Col span={11}>
            <AddMultipleStudentsTabButton
              data-cy="addMultipleStudent"
              searchViewVisible={searchViewVisible}
              onClick={() => this.setState({ ...this.setState, searchViewVisible: false })}
            >
              {t("users.student.invitestudents.tab2")}
            </AddMultipleStudentsTabButton>
          </Col>
        </Row>
        {searchViewVisible ? (
          <SearchViewContainer>
            <Row>
              <Col> {t("users.student.invitestudents.tab1title")}</Col>
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
                  <PerfectScrollbar data-cy="all-students">{allLists || <div />}</PerfectScrollbar>
                </ColWrapper>
                <Col span={2}>
                  <IconSwap type="swap" />
                </Col>
                <ColWrapper span={11}>
                  <PerfectScrollbar data-cy="students-to-enroll">{toEnrollLists || <div />}</PerfectScrollbar>
                </ColWrapper>
              </Row>
            )}
          </SearchViewContainer>
        ) : (
          <AddBulkStudentsViewContainer>
            <Row>
              <AddBulkUserPrimaryTextContainer span={24}>
                {t("users.student.invitestudents.tab2title")}
              </AddBulkUserPrimaryTextContainer>
            </Row>
            <SelUserKindDiv>
              <Col span={8}>{t("users.student.invitestudents.byname")}</Col>
              <Col span={16}>
                <SelectInputStyled
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  data-cy="studentType"
                  onChange={this.handleChange}
                  defaultValue="google"
                >
                  {googleUsernames && <Option value="google">{t("users.student.invitestudents.googleuser")}</Option>}
                  {office365Usernames && <Option value="mso">{t("users.student.invitestudents.officeuser")}</Option>}
                  {firstNameAndLastName && [
                    <Option value="fl">{t("users.student.invitestudents.fl")}</Option>,
                    <Option value="lf">{t("users.student.invitestudents.lf")}</Option>
                    ]}
                </SelectInputStyled>
              </Col>
            </SelUserKindDiv>
            <Row>
              <Col span={24}>
                <FormItem style={{ marginBottom: "0px" }}>
                  {placeHolderComponent}
                  {getFieldDecorator("students", {
                      rules: [
                        {
                          validator: this.validateStudentsList
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
                        <Select getPopupContainer={triggerNode => triggerNode.parentNode} placeholder="Select school">
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
      </CustomModalStyled>
    );
  }
}

const enhance = compose(
  withNamespaces("manageDistrict"),
  Form.create(),
  connect(
    state => ({
      orgData: get(state, "user.user.orgData", {}),
      role: get(state, "user.user.role", null)
    }),
    {}
  )
);

export default enhance(InviteMultipleStudentModal);
