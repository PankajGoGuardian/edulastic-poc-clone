import React, { Component } from "react";
import { Form, Input, Row, Col, Select, Button, Modal, DatePicker } from "antd";
import moment from "moment";
const Option = Select.Option;
import selectsData from "../../../../TestPage/components/common/selectsData";
import { ModalFormItem } from "./styled";
const { allGrades, allSubjects } = selectsData;
class EditClassModal extends Component {
  onSaveClass = () => {
    this.props.form.validateFields((err, row) => {
      const { selClassData: { _source: { parent, districtId } = {} } = {} } = this.props;
      if (!err) {
        const saveClassData = {
          name: row.name,
          type: "class",
          owners: row.teacher,
          parent,
          districtId,
          institutionId: row.institutionId,
          subject: row.subject,
          grades: row.grades,
          tags: row.tags
        };
        this.props.saveClass(saveClassData);
        if (row.endDate) {
          Object.assign(saveClassData, { endDate: row.endDate.valueOf() });
        }
      }
    });
  };

  onCloseModal = () => {
    this.props.closeModal();
  };

  render() {
    const { modalVisible, selClassData, schoolsData, teacherList } = this.props;
    const { _source: { owners = [], name, subject, institutionId, grades, tags, endDate } = {} } = selClassData;
    const ownersData = owners.map(row => row.id);

    const schoolsOptions = [];
    if (schoolsData.length !== undefined) {
      schoolsData.map((row, index) => {
        schoolsOptions.push(
          <Option key={index} value={row._id}>
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

    const subjects = allSubjects.filter(el => el.value !== "");

    const { getFieldDecorator } = this.props.form;
    const {} = this.props;
    return (
      <Modal
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
                rules: [
                  {
                    required: true,
                    message: "Please select subject"
                  }
                ],
                initialValue: subject
              })(
                <Select placeholder="Select Subject">
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
                rules: [
                  {
                    required: true,
                    message: "Please select grades"
                  }
                ],
                initialValue: grades
              })(
                <Select placeholder="Select Grades" mode="multiple">
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
              {getFieldDecorator("courseId")(<Select showSearch placeholder="Please enter 1 or more characters" />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="Tags">
              {getFieldDecorator("tags", {
                initialValue: tags
              })(<Select placeholder="Please enter 2 or more characters" mode="tags" />)}
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
                <Select mode="multiple" placeholder="Search by Username">
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
              })(<Select placeholder="Select School">{schoolsOptions}</Select>)}
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
      </Modal>
    );
  }
}

const EditClassModalForm = Form.create()(EditClassModal);
export default EditClassModalForm;
