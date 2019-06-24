import React, { Component } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Form, Row, Col, Button, Modal, Select, Tabs, Input, Icon } from "antd";
const { TabPane } = Tabs;
const Search = Input.Search;
import { userApi } from "@edulastic/api";
import { StyledTextArea, PlaceHolderText, SelUserKindDiv, ItemDiv, Text, IconWrapper, ColWrapper } from "./styled";

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
        <Col span={6}> {isEnrolled && <IconWrapper type="check" />}</Col>
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
      studentsToEnroll: []
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
    this.setState({ curSel: value });
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
          email: { type: "cont", value: searchKey }
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

  onAddMultipleStudents = async (
    setinfoModelVisible,
    setInfoModalData,
    students,
    selClass,
    setIsAddMultipleStudentsModal,
    loadStudents
  ) => {
    const data = {
      userDetails: students.map(std => std._id)
    };
    const { _id: classId } = selClass;
    const result = await userApi.SearchAddEnrolMultiStudents(selClass.code, data);
    setIsAddMultipleStudentsModal(false);
    setInfoModalData(result.data.result);
    setinfoModelVisible(true);
    loadStudents({ classId });
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
      loadStudents
    } = this.props;
    const { placeHolderVisible, curSel, allStudents, studentsToEnroll } = this.state;

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

    return (

      <>
        <Modal
          visible={modalVisible}
          onOk={this.onInviteStudents}
          onCancel={this.onCloseModal}
          maskClosable={false}
          footer={null}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="Add students" key="1">
              <Row>
                <Col span={24}>
                  Add Students by typing or paste one or more student(s) names. User separate lines or semi-colon to add
                  multiple students.
                </Col>
              </Row>
              <SelUserKindDiv>
                <Col span={8}>Add students by their:</Col>
                <Col span={12} offset={1}>
                  <Select onChange={this.handleChange} defaultValue="google">
                    <Option value="google">Google Usernames</Option>
                    <Option value="mso">Office 365 Usernames</Option>
                    <Option value="fl">Frist Name and Last Name</Option>
                    <Option value="lf">Last Name and First Name</Option>
                  </Select>
                </Col>
              </SelUserKindDiv>
              <Row>
                <Col span={24}>
                  <FormItem>
                    {placeHolderComponent}
                    {getFieldDecorator("students", {
                      rules: [
                        {
                          required: true,
                          message: "Please input Students Username"
                        },
                        {
                          validator: this.validateStudentsList
                        }
                      ]
                    })(<StyledTextArea row={10} onChange={this.handleChangeTextArea} />)}
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span={8} offset={16}>
                  <Button type="primary" shape="round" size="large" key="submit" onClick={this.onInviteStudents}>
                    Add Student
                  </Button>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Seach existing students and add" key="2">
              <Row>Search and select existing students from your district and add</Row>
              <Row>
                <Search
                  placeholder="type student name or email"
                  style={{ width: 300, marginTop: "1rem", marginBottom: "1.5rem" }}
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
                    <Icon type="swap" style={{ padding: "1rem" }} />
                  </Col>
                  <ColWrapper span={11}>
                    <PerfectScrollbar>{toEnrollLists ? toEnrollLists : <div />}</PerfectScrollbar>
                  </ColWrapper>
                </Row>
              )}

              <Row type="flex" justify="space-between" style={{ marginTop: "1rem" }}>
                <Col>
                  <Button shape="round" type="primary" size="large" key="submit" ghost onClick={this.onCloseModal}>
                    No,Cancel
                  </Button>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    shape="round"
                    size="large"
                    key="submit"
                    disabled={!studentsToEnroll.length}
                    onClick={this.onAddMultipleStudents.bind(
                      this,
                      setinfoModelVisible,
                      setInfoModalData,
                      studentsToEnroll,
                      selectedClass,
                      setIsAddMultipleStudentsModal,
                      loadStudents
                    )}
                  >
                    Yes, Add to Class
                    <Icon type="right" />
                  </Button>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
          ,
        </Modal>
      </>

    );
  }
}

const InviteMultipleStudentModalForm = Form.create()(InviteMultipleStudentModal);
export default InviteMultipleStudentModalForm;
