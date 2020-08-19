import { SimpleConfirmModal } from "@edulastic/common";
import { LightGreenSpan } from "@edulastic/common/src/components/TypeToConfirmModal/styled";
import { Col, Tooltip } from "antd";
import { get } from "lodash";
import PropTypes from "prop-types";
import React, { useState } from "react";
import connect from "react-redux/lib/connect/connect";
import withRouter from "react-router-dom/withRouter";
import { compose } from "redux";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";
import { setAssignmentFiltersAction } from "../../../src/actions/assignments";
import { getUserId } from "../../../src/selectors/user";
import {
  ClassCode,
  ClassLink,
  CodeWrapper,
  ContainerHeader,
  CoTeacher,
  RightContent,
  Studentscount,
  PopCoTeachers
} from "./styled";

const SubHeader = ({
  name,
  code,
  _id,
  type,
  active,
  location,
  unarchiveClass,
  owners = [],
  gradeSubject,
  studentsList,
  userId,
  lastTeacher
}) => {
  const [showUnarchiveModal, setShowUnarchiveModal] = useState(false);
  const { exitPath } = location?.state || {};
  const typeText = type !== "class" ? "Group" : "Class";
  const studentCount = studentsList?.filter(stu => stu.enrollmentStatus != 0)?.length;
  const totalStudent = studentCount < 10 ? <span> 0{studentCount} </span> : studentCount;
  const coTeachers =
    owners ?
    owners
      .filter(owner => owner.id !== userId)
      .map(owner => owner.name) : [];
  
  const teacher = coTeachers.slice(0, 1);
  const otherTeachers = coTeachers.slice(1, lastTeacher);
  const otherTeacherNames = otherTeachers.join(", ");

  const handleUnarchiveClass = () => {
    unarchiveClass({ groupId: _id, exitPath, isGroup: type !== "class" });
    setShowUnarchiveModal(false);
  };
  const handleUnarchiveClassCancel = () => {
    setShowUnarchiveModal(false);
  };

  return (
    <ContainerHeader>
      {type === "class" && (
        <CodeWrapper>
          <ClassCode lg={6} span={24}>
            Class Code <span>{code}</span>
          </ClassCode>
          <Studentscount lg={6} span={24}>
            TOTAL STUDENTS <span>{totalStudent || 0}</span>
          </Studentscount>
          <Col lg={8} span={24}>
            {coTeachers && coTeachers.length ? (
              <FeaturesSwitch
                inputFeatures="addCoTeacher"
                actionOnInaccessible="hidden"
                key="addCoTeacher"
                gradeSubject={gradeSubject}
                lg={6}
                span={12}
              >
                <CoTeacher>
                  CO-TEACHER{' '}<span>{teacher}</span>
                  {otherTeachers.length >= 1 ? (
                    <Tooltip title={otherTeacherNames} placement="right">
                      <PopCoTeachers>+ {otherTeachers.length}</PopCoTeachers>
                    </Tooltip>
                  ) : null}
                </CoTeacher>
              </FeaturesSwitch>
            ) : (
              ""
            )}
          </Col>
        </CodeWrapper>
      )}
      <RightContent>
        {active !== 1 && (
          <ClassLink onClick={() => setShowUnarchiveModal(true)}>UNARCHIVE</ClassLink>
        )}
        {showUnarchiveModal && (
          <SimpleConfirmModal
            visible={showUnarchiveModal}
            title={`Unarchive ${typeText}`}
            description={
              <p style={{ margin: "5px 0" }}>
                Are you sure you want to Unarchive <LightGreenSpan>{name}</LightGreenSpan>?
              </p>
            }
            buttonText="Unarchive"
            onProceed={handleUnarchiveClass}
            onCancel={handleUnarchiveClassCancel}
          />
        )}
      </RightContent>
    </ContainerHeader>
  );
};

SubHeader.propTypes = {
  name: PropTypes.string,
  code: PropTypes.string
};

SubHeader.defaultProps = {
  name: "",
  code: ""
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      userId: getUserId(state),
      studentsList: get(state, "manageClass.studentsList", [])
    }),
    {
      setAssignmentFilters: setAssignmentFiltersAction
    }
  )
);

export default enhance(SubHeader);
