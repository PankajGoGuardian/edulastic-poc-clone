//@ts-check
import React, { useState, useCallback, useEffect } from "react";
import { Button, Row, Col, Radio, Select, DatePicker, message } from "antd";
import moment from "moment";
import { assignmentApi } from "@edulastic/api";
import { ConfirmationModal } from "../../src/components/common/ConfirmationModal";
import { BodyContainer } from "./styled";

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
 * @property {string[]} absentList
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
  absentList = [],
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
      absentList.forEach(st => {
        setRedirectStudents[st] = true;
      });
      setStudentsToRedirect(setRedirectStudents);
    } else if (type === "entire") {
      const isNotRedirectable = disabledList.length > 0;
      !isNotRedirectable &&
        allStudents.forEach(st => {
          setRedirectStudents[st._id] = true;
        });
      setStudentsToRedirect(isNotRedirectable ? {} : setRedirectStudents);
    } else {
      setStudentsToRedirect(selectedStudents);
    }
  }, [type, selectedStudents]);

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
    } else {
      await assignmentApi.redirect(assignmentId, {
        _id: groupId,
        specificStudents: type === "entire" ? false : true,
        students: type === "entire" ? [] : selected,
        endDate: +dueDate
      });
      closePopup();
    }
    setLoading(false);
  }, [studentsToRedirect, assignmentId, dueDate, groupId]);

  const disabledEndDate = endDate => {
    if (!endDate) {
      return false;
    }
    return endDate < moment().startOf("day");
  };

  return (
    <ConfirmationModal
      textAlign="left"
      title="Redirect Assignment"
      visible={open}
      onCancel={() => closePopup()}
      footer={[
        <Button ghost key="cancel" onClick={() => closePopup()}>
          CANCEL
        </Button>,
        <Button loading={loading} key="submit" onClick={submitAction}>
          SUBMIT
        </Button>
      ]}
    >
      <BodyContainer>
        <h3>Class/Group Section</h3>
        <h4>{additionalData.className}</h4>
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

        <h4> Students </h4>
        <Row>
          <Select
            showSearch
            optionFilterProp="data"
            filterOption={(input, option) => option.props.data.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            mode="multiple"
            disabled={type !== "specificStudents"}
            style={{ width: "100%" }}
            placeholder="Select the students"
            value={Object.keys(selectedStudents)}
            onChange={v => {
              setSelected(v);
            }}
          >
            {allStudents.map(x => (
              <Option
                key={x._id}
                value={x._id}
                disabled={disabledList.includes(x._id)}
                data={`${x.firstName},${x.email}`}
              >
                {x.firstName}
              </Option>
            ))}
          </Select>
        </Row>

        <h4>Close Date</h4>
        <Row>
          <DatePicker
            allowClear={false}
            disabledDate={disabledEndDate}
            style={{ width: "100%", cursor: "pointer" }}
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
      </BodyContainer>
    </ConfirmationModal>
  );
};

export default RedirectPopUp;
