import { SimpleConfirmModal } from "@edulastic/common";
import { LightGreenSpan } from "@edulastic/common/src/components/TypeToConfirmModal/styled";
import { Col } from "antd";
import { get } from "lodash";
import PropTypes from "prop-types";
import React, { useState } from "react";
import connect from "react-redux/lib/connect/connect";
import withRouter from "react-router-dom/withRouter";
import { compose } from "redux";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";
import { setAssignmentFiltersAction } from "../../../src/actions/assignments";
import { ClassCode, ClassLink, CodeWrapper, ContainerHeader, CoTeacher, RightContent, Studentscount } from "./styled";

const SubHeader = ({
  name,
  code,
  _id,
  type,
  active,
  location,
  unarchiveClass,
  owners = [],
  parent,
  gradeSubject,
  studentsList
}) => {
  const [showUnarchiveModal, setShowUnarchiveModal] = useState(false);
  const { exitPath } = location?.state || {};
  const typeText = type !== "class" ? "Group" : "Class";
  const studentCount = studentsList?.filter(stu => stu.enrollmentStatus != 0)?.length;
  const totalStudent = studentCount < 10 ? <span> 0{studentCount} </span> : studentCount;
  const coTeachers =
    owners &&
    owners
      .filter(owner => owner.id !== parent.id)
      .map(owner => owner.name)
      .join(",");

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
          <Col lg={6} span={24}>
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
                  CO-TEACHER<span>{coTeachers}</span>
                </CoTeacher>
              </FeaturesSwitch>
            ) : (
              ""
            )}
          </Col>
        </CodeWrapper>
      )}
      <RightContent>
        {active !== 1 && <ClassLink onClick={() => setShowUnarchiveModal(true)}>UNARCHIVE</ClassLink>}
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
      user: state?.user?.user,
      studentsList: get(state, "manageClass.studentsList", [])
    }),
    {
      setAssignmentFilters: setAssignmentFiltersAction
    }
  )
);

export default enhance(SubHeader);
