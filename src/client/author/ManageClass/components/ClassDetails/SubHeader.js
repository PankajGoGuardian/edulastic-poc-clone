import React, { useState } from "react";
import withRouter from "react-router-dom/withRouter";
import { compose } from "redux";
import connect from "react-redux/lib/connect/connect";
import PropTypes from "prop-types";
import { SimpleConfirmModal } from "@edulastic/common";
import { LightGreenSpan } from "@edulastic/common/src/components/TypeToConfirmModal/styled";
import { setAssignmentFiltersAction } from "../../../src/actions/assignments";
import { ContainerHeader, RightContent, ClassCode, ClassLink,Studentscount, CodeWrapper } from "./styled";


const SubHeader = ({
  name,
  code,
  _id,
  type,
  active,
  location,
  unarchiveClass,
  studentCount
}) => {

  const [showUnarchiveModal, setShowUnarchiveModal] = useState(false);
  const { exitPath } = location?.state || {};
  const typeText = type !== "class" ? "Group" : "Class";

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
          <ClassCode lg={6} span={12}>
            Class Code <span>{code}</span>
          </ClassCode>
          <Studentscount lg={6} span={12}>
            TOTAL STUDENTS <span>{studentCount || 0 }</span>
          </Studentscount>
        </CodeWrapper>
      )}
      <RightContent>
        {active !== 1 && (
          <ClassLink
            onClick={() => setShowUnarchiveModal(true)}
          >
            UNARCHIVE
          </ClassLink>
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
    state => ({ user: state?.user?.user }),
    {
      setAssignmentFilters: setAssignmentFiltersAction
    }
  )
);

export default enhance(SubHeader);
