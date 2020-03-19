import React, { useState, useCallback, useEffect } from "react";
import { Row, Select, DatePicker, message, Col } from "antd";
import moment from "moment";
import { some } from "lodash";
import { test as testContants } from "@edulastic/constants";
import { assignmentApi } from "@edulastic/api";
import { EduButton } from "@edulastic/common";
import { getUserName } from "../utils";
import { ConfirmationModal } from "../../src/components/common/ConfirmationModal";
import { BodyContainer } from "./styled";
import { RadioBtn, RadioGrp } from "@edulastic/common";

const { redirectPolicy } = testContants;

const QuestionDelivery = {
  [redirectPolicy.QuestionDelivery.ALL]: "All",
  [redirectPolicy.QuestionDelivery.SKIPPED_AND_WRONG]: "Skipped and Wrong"
};

const ShowPreviousAttempt = {
  SCORE_AND_FEEDBACK: "Score & Feedback",
  STUDENT_RESPONSE_AND_FEEDBACK: "Student Response & Feedback",
  FEEDBACK_ONLY: "Feedback only"
};

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
  enrollmentStatus,
  selectedStudents,
  additionalData,
  open,
  closePopup,
  setSelected,
  assignmentId,
  absentList = [],
  disabledList = [],
  groupId,
  testActivity
}) => {
  const [dueDate, setDueDate] = useState(moment().add(1, "day"));
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("specificStudents");
  const [studentsToRedirect, setStudentsToRedirect] = useState(selectedStudents);
  const [qDeliveryState, setQDeliveryState] = useState("ALL");
  const [showPrevAttempt, setshowPrevAttempt] = useState("FEEDBACK_ONLY");
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
      let _selected = selected;
      if (qDeliveryState === redirectPolicy.QuestionDelivery.SKIPPED_AND_WRONG) {
        const selectedStudentsTestActivity = testActivity.filter(
          item => studentsToRedirect[item.studentId] && some(item.questionActivities, o => o.skipped || !o.correct)
        );
        _selected = selectedStudentsTestActivity.map(item => item.studentId);
      }

      if (_selected.length) {
        await assignmentApi
          .redirect(assignmentId, {
            _id: groupId,
            specificStudents: type === "entire" ? false : true,
            students: type === "entire" ? [] : _selected,
            showPreviousAttempt: showPrevAttempt,
            questionsDelivery: qDeliveryState,
            endDate: +dueDate
          })
          .then(() => {
            message.success("Redirect Successful");
          })
          .catch(err => {
            message.error(err?.data?.message);
          });
        closePopup();
      } else {
        message.error("Please select students with incorrect or skipped questions.");
      }
    }
    setLoading(false);
  }, [studentsToRedirect, assignmentId, dueDate, groupId, showPrevAttempt, qDeliveryState]);

  const disabledEndDate = endDate => {
    if (!endDate) {
      return false;
    }
    return endDate < moment().startOf("day");
  };

  return (
    <ConfirmationModal
      centered
      textAlign="left"
      title="Redirect Assignment"
      visible={open}
      onCancel={closePopup}
      footer={[
        <EduButton isGhost key="cancel" onClick={closePopup}>
          CANCEL
        </EduButton>,
        <EduButton data-cy="confirmRedirect" loading={loading} key="submit" onClick={submitAction}>
          REDIRECT
        </EduButton>
      ]}
    >
      <BodyContainer>
        <h3>Class/Group Section</h3>
        <h4>{additionalData.className}</h4>
        <Row>
          {/* 
            TODO: handle the change
        */}
          <RadioGrp
            value={type}
            onChange={e => {
              setType(e.target.value);
            }}
          >
            <RadioBtn data-cy="entireClass" value="entire">
              Entire Class
            </RadioBtn>
            <RadioBtn data-cy="absentStudents" value="absentStudents">
              Absent Students
            </RadioBtn>
            <RadioBtn data-cy="specificStudents" value="specificStudents">
              Specific Students
            </RadioBtn>
          </RadioGrp>
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
            getPopupContainer={triggerNode => triggerNode.parentNode}
            onChange={v => {
              setSelected(v);
            }}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            {allStudents.map(
              x =>
                enrollmentStatus[x._id] == "1" && (
                  <Option
                    key={x._id}
                    value={x._id}
                    disabled={disabledList.includes(x._id)}
                    data={`${x.firstName}${x.lastName || ""}${x.email || ""}${x.username || ""}`}
                  >
                    {getUserName(x)}
                  </Option>
                )
            )}
          </Select>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <h4>Questions delivery</h4>
            <Row>
              <Select
                data-cy="questionDelivery"
                defaultValue={qDeliveryState}
                onChange={val => setQDeliveryState(val)}
                style={{ width: "100%" }}
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {Object.keys(QuestionDelivery).map(item => (
                  <Option key="1" value={item}>
                    {QuestionDelivery[item]}
                  </Option>
                ))}
              </Select>
            </Row>
          </Col>
          <Col span={12}>
            <h4>Close Date</h4>
            <Row>
              <DatePicker
                data-cy="closeDate"
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
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <h4>Show Previous attempt</h4>
            <Row>
              <Select
                data-cy="previousAttempt"
                value={showPrevAttempt}
                onChange={val => setshowPrevAttempt(val)}
                style={{ width: "100%" }}
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {Object.keys(ShowPreviousAttempt).map((item, index) => (
                  <Option key={index} value={item}>
                    {ShowPreviousAttempt[item]}
                  </Option>
                ))}
              </Select>
            </Row>
          </Col>
        </Row>
      </BodyContainer>
    </ConfirmationModal>
  );
};

export default RedirectPopUp;
