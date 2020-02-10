import React from "react";
import { Button, Col, Form, Icon, Input, Row, Select, Spin, Switch, Upload } from "antd";
import { ButtonsContainer, CancelButton, ModalFormItem, OkButton, StyledModal } from "../../../common/styled";
import TextArea from "antd/es/input/TextArea";
import { schoolApi } from "@edulastic/api";
import CheckboxGroup from "antd/es/checkbox/Group";

const Option = Select.Option;
class CustomReportModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schoolsState: {
        list: [],
        value: [],
        fetching: false
      },
      isSchoolSelected: false,
      isRoleSelected: false,
      isUsersSelected: false,
      roleList: [],
      selectedStatus: true,
      reportData: {}
    };
  }

  onStatusChange = value => {
    this.setState({
      selectedStatus: value
    });
  };

  onRolesChange = value => {
    this.setState({
      roles: {
        roleList: value
      }
    });
  };

  handleSelectChange = val => {
    if (val === "school") {
      this.setState({
        isSchoolSelected: true,
        isRoleSelected: false,
        isUsersSelected: false
      });
    } else if (val === "role") {
      this.setState({
        isSchoolSelected: false,
        isRoleSelected: true,
        isUsersSelected: false
      });
    } else if (val === "user") {
      this.setState({
        isUsersSelected: true,
        isSchoolSelected: false,
        isRoleSelected: false
      });
    } else {
      this.setState({
        isSchoolSelected: false,
        isRoleSelected: false,
        isUsersSelected: false
      });
    }
  };

  handleSchoolChange = value => {
    this.setState({
      schoolsState: {
        list: [],
        fetching: false,
        value: value
      }
    });
  };

  fetchSchool = async value => {
    const schoolsData = { ...this.state.schoolsState };
    const { districtId } = this.props;
    this.setState({
      schoolsState: {
        list: [],
        fetching: true,
        value: schoolsData.value
      }
    });

    const schoolListData = await schoolApi.getSchools({
      districtId,
      limit: 25,
      page: 1,
      sortField: "name",
      order: "asc",
      search: { name: [{ type: "cont", value }] }
    });

    this.setState({
      schoolsState: {
        list: schoolListData.data,
        fetching: false,
        value: schoolsData.value
      }
    });
  };

  onSubmitForm = async () => {
    const {
      onSubmit,
      districtId,
      reportData: { _id, permissions = [] },
      modalType
    } = this.props;
    this.props.form.validateFields((err, row) => {
      if (!err) {
        const { active = true, desc, institutionIds = [], level, name, url, logo, roles = [], users = "" } = row;
        const submitData = {
          districtId,
          name,
          desc,
          logo,
          url,
          level,
          schoolIds: institutionIds.map(o => o.key),
          roles,
          users: users
            ? users
                .split(",")
                .filter(o => o.trim().length > 0)
                .map(o => o.trim())
            : [],
          active
        };
        if (modalType === "edit") {
          Object.assign(submitData, {
            reportId: _id,
            permissionIds: permissions.map(o => o._id)
          });
        }
        onSubmit(submitData);
        this.onModalClose();
      }
    });
  };

  componentDidMount() {
    const { reportData: { permissions = [] } = {} } = this.props;
    const orgType = permissions.length > 0 ? permissions?.[0].orgType : "";
    const schools =
      orgType === "school"
        ? permissions.map(o => {
            return { _id: o.orgId, _source: { name: o.orgName } };
          })
        : [];
    const roles = orgType === "role" ? permissions.map(o => o.permissionLevel) : [];
    const users = orgType === "user" ? permissions.map(o => o.user.email).join(", ") : "";
    this.setState({
      isUsersSelected: orgType === "user" ? true : false,
      isSchoolSelected: orgType === "school" ? true : false,
      isRoleSelected: orgType === "role" ? true : false,
      orgType,
      schoolsState: {
        list: [...schools],
        fetching: false,
        value: schools.map(o => ({ key: o._id, lable: o._source.name }))
      },
      roles,
      users
    });
  }

  onModalClose = () => {
    const { onCancel } = this.props;
    this.setState({
      isSchoolSelected: false,
      isRoleSelected: false,
      isUsersSelected: false,
      roles: [],
      selectedStatus: true,
      reportData: {},
      orgType: "",
      users: "",
      schools: []
    });
    onCancel();
  };

  render() {
    const {
      customReportData = {},
      onCancel,
      form: { getFieldDecorator },
      modalType,
      reportData = {},
      t
    } = this.props;
    const {
      schoolsState,
      isSchoolSelected,
      isRoleSelected,
      roleList,
      isUsersSelected,
      roles,
      users,
      orgType
    } = this.state;
    const { title = "", description = "", thumbnail = "", url = "", archived = false } = reportData;
    return (
      <StyledModal
        visible={!!modalType}
        title={t(`customreport.${modalType}.title`)}
        onOk={this.onSubmitForm}
        onCancel={this.onModalClose}
        onClose={this.onModalClose}
        maskClosable={false}
        centered
        footer={[
          <ButtonsContainer>
            <CancelButton id={"cancel"} onClick={onCancel}>
              {t(`customreport.cancel`)}
            </CancelButton>
            <OkButton id={"ok"} onClick={this.onSubmitForm}>
              {t(`customreport.${modalType}.ok`)}
            </OkButton>
          </ButtonsContainer>
        ]}
      >
        <Row>
          <Col span={24}>
            <ModalFormItem label={t(`customreport.reportname`)}>
              {getFieldDecorator("name", {
                validateTrigger: ["onBlur"],
                initialValue: title,
                rules: [
                  {
                    required: true,
                    message: t("customreport.namerequireerror")
                  },
                  {
                    max: 128,
                    message: t("customreport.namemaxerror")
                  },
                  {
                    pattern: "[a-zA-Z0-9s]+",
                    message: t("customreport.namecharerror")
                  }
                ]
              })(<Input placeholder={t(`customreport.nameplaceholder`)} />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t(`customreport.description`)}>
              {getFieldDecorator("desc", {
                validateTrigger: ["onBlur"],
                initialValue: description,
                rules: [
                  {
                    required: false,
                    max: 256,
                    message: t("customreport.descriptionlengtherror")
                  }
                ]
              })(<TextArea placeholder={t(`customreport.descriptionplaceholder`)} />)}
            </ModalFormItem>
          </Col>
        </Row>
        {/*<Row>
          <Col span={24}>
            <ModalFormItem label={t(`customreport.logo`)}>
              {getFieldDecorator("logo", {
                validateTrigger: ["onBlur"],
                initialValue: thumbnail,
                rules: [
                  {
                    required: false
                  }
                ]
              })(
                <Row>
                  <Col span={18}>
                    <Input placeholder={t(`customreport.logoplaceholder`)} />
                  </Col>
                  <Col span={6}>
                    <Upload>
                      <Button>
                        <Icon type="upload" /> Browse
                      </Button>
                    </Upload>
                  </Col>
                </Row>
              )}
            </ModalFormItem>
          </Col>
        </Row>*/}
        <Row>
          <Col span={24}>
            <ModalFormItem label={t(`customreport.tableauurl`)}>
              {getFieldDecorator("url", {
                validateTrigger: ["onBlur"],
                initialValue: url,
                rules: [
                  {
                    required: true,
                    message: t(`customreport.tableauurlerror`)
                  }
                ]
              })(<Input placeholder={t(`customreport.tableauplaceholder`)} />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t(`customreport.accesslevel`)}>
              {getFieldDecorator("level", {
                initialValue: orgType || undefined,
                placeholder: t(`customreport.accesslevelplaceholder`),
                rules: [
                  {
                    required: true,
                    message: t(`customreport.accesslevelerror`)
                  }
                ]
              })(
                <Select
                  placeholder={t(`customreport.accesslevelplaceholder`)}
                  onChange={this.handleSelectChange}
                  dropdownStyle={{ zIndex: 1005 }}
                >
                  <Option value="district">District</Option>
                  <Option value="school">School</Option>
                  <Option value="role">Roles</Option>
                  <Option value="user">Users</Option>
                </Select>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        {isSchoolSelected && (
          <Row>
            <Col span={24}>
              <ModalFormItem label={t("customreport.school")}>
                {getFieldDecorator("institutionIds", {
                  initialValue: schoolsState.value,
                  rules: [
                    {
                      required: true,
                      message: t("customreport.schoolselecterror")
                    }
                  ]
                })(
                  <Select
                    mode="multiple"
                    labelInValue
                    placeholder={t("customreport.selectschool")}
                    notFoundContent={schoolsState.fetching ? <Spin size="small" /> : null}
                    filterOption={false}
                    onSearch={this.fetchSchool}
                    onChange={this.handleSchoolChange}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                    {schoolsState.list.map(school => (
                      <Option key={school._id} value={school._id}>
                        {school._source.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </ModalFormItem>
            </Col>
          </Row>
        )}
        {isRoleSelected && (
          <Row>
            <Col span={24}>
              <ModalFormItem label={t("customreport.selectroles")}>
                {getFieldDecorator("roles", {
                  initialValue: roles || [],
                  rules: [
                    {
                      required: true,
                      message: t("customreport.selectrolesrequired")
                    }
                  ]
                })(
                  <CheckboxGroup
                    options={[
                      { label: "District Admin", value: "district-admin" },
                      { label: "School Admin", value: "school-admin" },
                      { label: "Instructor", value: "teacher" }
                    ]}
                    value={roleList}
                    onChange={this.onRolesChange}
                  />
                )}
              </ModalFormItem>
            </Col>
          </Row>
        )}
        {isUsersSelected && (
          <Row>
            <Col span={24}>
              <ModalFormItem label={t("customreport.selectusers")}>
                {getFieldDecorator("users", {
                  initialValue: users || "",
                  rules: [
                    {
                      required: true,
                      message: t("customreport.selectusersrequired")
                    }
                  ]
                })(<TextArea placeholder={t(`customreport.selectusersplaceholder`)} />)}
              </ModalFormItem>
            </Col>
          </Row>
        )}
        <Row>
          <Col span={24}>
            <ModalFormItem label={t(`customreport.activatereport`)}>
              {getFieldDecorator("active")(<Switch defaultChecked={!archived} onChange={this.onStatusChange} />)}
            </ModalFormItem>
          </Col>
        </Row>
      </StyledModal>
    );
  }
}

const CustomReportModalForm = Form.create()(CustomReportModal);
export default CustomReportModalForm;
