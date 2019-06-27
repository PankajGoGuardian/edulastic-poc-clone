//@ts-check
import React, { useState, useCallback, useEffect } from "react";
import { Modal, Button, Row, Col, Input, Radio, Select, DatePicker, message } from "antd";
import moment from "moment";
import { assignmentApi } from "@edulastic/api";

const RadioGroup = Radio.Group;
const Option = Select.Option;

/**
 * @typedef {Object} RedirectPopUpProps
 * @property {{_id: string, firstName: string, status:string}[]} allStudents
 * @property {Object} selectedStudents
 * @property {Object} additionalData
 * @property {boolean} open
 * @property {Function} closePopup
 * @property {Function} setSelected
 * @property {string[]} disabledList
 * @property {string} assignmentId
 * @property {string} groupId
 */

/**
 * @param {RedirectPopUpProps} props
 */
const RedirectPopUp = ({
  allStudents,
  selectedStudents,
  additionalData,
  open,
  closePopup,
  setSelected,
  assignmentId,
  disabledList = [],
  groupId
}) => {
  const [dueDate, setDueDate] = useState(moment().add(1, "day"));
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("specificStudents");
  const [studentsToRedirect, setStudentsToRedirect] = useState(selectedStudents);
  useEffect(() => {
    let setRedirectStudents = {};
    if (type === "absentStudents") {
      allStudents
        .filter(st => st.status === "ABSENT")
        .forEach(st => {
          setRedirectStudents[st._id] = true;
        });
      setStudentsToRedirect(setRedirectStudents);
    } else if (type === "entire") {
      const isNotRedirectable = allStudents.some(
        st => st.status === "IN GRADING" || st.status === "NOT STARTED" || st.status === "REDIRECTED"
      );
      allStudents.forEach(st => {
        setRedirectStudents[st._id] = true;
      });
      setStudentsToRedirect(isNotRedirectable ? {} : setRedirectStudents);
    } else {
      setStudentsToRedirect(selectedStudents);
    }
  }, [type]);

  const submitAction = useCallback(async () => {
    if (dueDate < moment()) {
      return message.error("Select a Future end Date");
    }
    setLoading(true);
    const selected = Object.keys(studentsToRedirect);
    if (selected.length === 0) {
      message.error(
        type === "entire"
          ? "You can redirect an assessment only after the assessment has been submitted by the student(s)."
          : "At least one student should be selected to redirect assessment."
      );
      setLoading(false);
    } else {
      await assignmentApi.redirect(assignmentId, {
        _id: groupId,
        specificStudents: true,
        students: selected,
        endDate: +dueDate
      });
      setLoading(false);
      closePopup();
    }
  }, [studentsToRedirect, assignmentId, dueDate, groupId]);

  const disabledEndDate = endDate => {
    if (!endDate) {
      return false;
    }
    return endDate < moment().startOf("day");
  };

  return (
    <Modal
      title="Redirect"
      visible={open}
      closable={false}
      footer={[
        <Button key="cancel" onClick={() => closePopup()}>
          cancel
        </Button>,
        <Button loading={loading} key="submit" onClick={submitAction}>
          submit
        </Button>
      ]}
    >
      <Row>Class/Group Section</Row>
      <Row>{additionalData.className}</Row>
      <Row>
        {/* 
            TODO: handle the change
        */}
        <RadioGroup
          value={type}
          onChange={e => {
            setType(e.target.value);
          }}
        >
          <Radio value="entire">Entire Class</Radio>
          <Radio value="absentStudents">Absent Students</Radio>
          <Radio value="specificStudents">Specific Students</Radio>
        </RadioGroup>
      </Row>

      <Row> Students </Row>
      <Row>
        <Col span={24}>
          <Row>
            <Select
              mode="multiple"
              disabled={type !== "specificStudents"}
              allowClear={false}
              style={{ width: "100%" }}
              placeholder="Select the students"
              value={Object.keys(selectedStudents)}
              onChange={v => {
                setSelected(v);
              }}
            >
              {allStudents.map(x => (
                <Option key={x._id} value={x._id} disabled={disabledList.includes(x._id)}>
                  {x.firstName}
                </Option>
              ))}
            </Select>
          </Row>
        </Col>
      </Row>
      <Row>
        <Row>Close Date</Row>
        <Col span={12}>
          <Row>
            <DatePicker
              allowClear={false}
              disabledDate={disabledEndDate}
              style={{ width: "100%" }}
              value={dueDate}
              showTime
              showToday={false}
              onChange={v => {
                if (!v) {
                  setDueDate(moment().add(1, "day"));
                } else {
                  setDueDate(v);
                }
              }}
            />
          </Row>
        </Col>
      </Row>
    </Modal>
  );
};

export default RedirectPopUp;
