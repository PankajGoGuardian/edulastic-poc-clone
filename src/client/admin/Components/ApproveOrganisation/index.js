import React, { useState } from "react";
import moment from "moment";
import { schoolApi } from "@edulastic/api";
import { EduButton, notification } from "@edulastic/common";
import { HeadingSpan, ValueSpan } from "../../Common/StyledComponents/upgradePlan";
import { Row, SecondDiv, ThirdDiv, LeftButtonsContainer } from "../CreateAdmin/styled";
import { WarningText } from "./styled";

const ApproveOrganisation = props => {
  const [loading, setLoading] = useState(false);

  const { orgData, clearOrgData } = props;
  const { _id: id, district, name, isApproved, subscription = [], createdAt, schoolLists = [] } = orgData;
  const subDetails = subscription[0];
  const isSchool = !!district;

  const updateSchoolData = async () => {
    setLoading(true);
    try {
      await schoolApi.updateSchoolApprovalStatus({
        schoolIds: [id],
        isApprove: !isApproved
      });
      notification({
        type: "success",
        msg: `School has been ${isApproved ? "unapproved" : "approved"} successfully`
      });
      clearOrgData();
    } catch (error) {
      notification({ msg: error.message, messageKey: "apiFormErr" });
    } finally {
      setLoading(false);
    }
  };

  const updateDistrictData = async isApprove => {
    setLoading(true);
    try {
      await schoolApi.updateSchoolApprovalStatus({
        schoolIds: schoolLists.map(o => o._id),
        isApprove
      });
      notification({
        type: "success",
        msg: `All schools under this district has been ${isApprove ? "approved" : "unapproved"} successfully`
      });
      clearOrgData();
    } catch (error) {
      notification({ msg: error.message, messageKey: "apiFormErr" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SecondDiv>
        {!isSchool && (
          <Row>
            <WarningText>All the schools in the district will get Approved/Disapproved</WarningText>
          </Row>
        )}
        {isSchool && (
          <Row>
            <HeadingSpan>School Name:</HeadingSpan>
            <ValueSpan>{isSchool ? name : "-"}</ValueSpan>
          </Row>
        )}
        <Row>
          <HeadingSpan>District Name:</HeadingSpan>
          <ValueSpan>{isSchool ? district.name : name}</ValueSpan>
        </Row>
        <Row>
          <HeadingSpan>Type:</HeadingSpan>
          <ValueSpan>{isSchool ? "School" : "District"}</ValueSpan>
        </Row>
        {isSchool && (
          <Row>
            <HeadingSpan>Status:</HeadingSpan>
            <ValueSpan>{isApproved ? "Approved" : "Unapproved"}</ValueSpan>
          </Row>
        )}
        <Row>
          <HeadingSpan>Created on:</HeadingSpan>
          <ValueSpan>{createdAt ? moment(createdAt).format("YYYY-MM-DD") : "-"}</ValueSpan>
        </Row>
        <Row>
          <HeadingSpan>Subscription:</HeadingSpan>
          <ValueSpan>
            {subDetails?.subType === "premium" || subDetails?.subType === "enterprise" ? "Premium" : "Free"}
          </ValueSpan>
        </Row>
      </SecondDiv>
      <ThirdDiv>
        {isSchool ? (
          <LeftButtonsContainer>
            <EduButton onClick={updateSchoolData} disabled={loading}>
              {isApproved ? "Unapprove" : "Approve"}
            </EduButton>
          </LeftButtonsContainer>
        ) : (
          <LeftButtonsContainer>
            <EduButton onClick={() => updateDistrictData(false)} disabled={loading} isGhost>
              Unapprove
            </EduButton>
            <EduButton onClick={() => updateDistrictData(true)} disabled={loading}>
              Approve
            </EduButton>
          </LeftButtonsContainer>
        )}
      </ThirdDiv>
    </>
  );
};

export default ApproveOrganisation;
