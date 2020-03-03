import { smallDesktopWidth, themeColor, white } from "@edulastic/colors";
import { MainHeader } from "@edulastic/common";
import { IconPlus, IconManage } from "@edulastic/icons";
import { withNamespaces } from "@edulastic/localization";
import { Button, Col, Input, Modal, Row, Spin } from "antd";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import styled from "styled-components";
import NoDataIcon from "../../assets/nodata.svg";
import ShowActiveClass from "../../sharedComponents/ShowActiveClasses";
import { StudentSlectCommon } from "../../sharedComponents/ClassSelector";
import { NoDataBox } from "../../styled";
import ClassCard from "./CardContainer";
import ManageClassSubHeader from "./SubHeader";

const ClassCards = ({ classList, t }) => {
  const cards = classList.map(classItem => <ClassCard key={classItem._id} classItem={classItem} t={t} />);
  return cards;
};

const ManageClassContainer = ({
  t,
  classList,
  loading,
  showClass,
  joinClass,
  studentData,
  showActiveClass,
  allClassList,
  setClassList,
  setShowClass,
  userRole,
  currentChild
}) => {
  const [isJoinClassModalVisible, setJoinClassModal] = useState(false);
  const [classCode, setClassCode] = useState(null);
  const joinClassHandler = () => {
    const { email, firstName, role } = studentData;
    if (classCode && classCode.trim().length) {
      joinClass({ classCode, email, firstName, role });
    } else {
      setClassCode("");
    }
  };
  const closeModalHandler = () => {
    setJoinClassModal(false);
    setClassCode(null);
  };
  if (loading) return <Spin />;
  return (
    <>
      <MainHeader Icon={IconManage} headingText="common.manageClassTitle">
        {userRole === "parent" ? (
          <StudentSlectCommon />
        ) : (
          <JoinClassBtn data-cy="joinclass" onClick={() => setJoinClassModal(true)}>
            <IconPlus width={12} height={12} color="white" stroke="white" />
            <span>{t("common.joinClass")}</span>
          </JoinClassBtn>
        )}
        {isJoinClassModalVisible && (
          <JoinClassModal
            visible={isJoinClassModalVisible}
            onCancel={closeModalHandler}
            title={t("common.enterClassCode")}
            footer={
              <ButtonWrapper>
                <StyledButton data-cy="cancelbutton" onClick={closeModalHandler}>
                  {t("common.cancel")}
                </StyledButton>
                <StyledButton data-cy="joinbutton" onClick={joinClassHandler} type="primary">
                  {t("common.join")}
                </StyledButton>
              </ButtonWrapper>
            }
          >
            <StyledInput
              data-cy="classcodeinput"
              placeholder={t("common.enterClassCode").toLowerCase()}
              value={classCode}
              onChange={e => setClassCode(e.target.value)}
              classCode
            />
            {classCode !== null && !classCode.length ? (
              <ErrorMessage data-cy="errormessage">enter class code</ErrorMessage>
            ) : null}
          </JoinClassModal>
        )}
      </MainHeader>
      <SubHeaderWrapper>
        <Col span={12}>
          <ManageClassSubHeader />
        </Col>
        <Col span={12}>
          {showActiveClass && (
            <ShowActiveClass
              t={t}
              classList={allClassList}
              setClassList={setClassList}
              setShowClass={setShowClass}
              showClass={showClass}
            />
          )}
        </Col>
      </SubHeaderWrapper>

      {classList.length ? (
        <ClassCardWrapper>
          <ClassCards classList={classList} t={t} />
        </ClassCardWrapper>
      ) : (
        <NoDataBoxWrapper>
          <NoDataBox>
            <img src={NoDataIcon} alt="noData" />
            <h4>{showClass ? t("common.noActiveClassesTitle") : t("common.noClassesTitle")}</h4>
            <p>{showClass ? t("common.noActiveClassesSubTitle") : t("common.noClassesSubTitle")}</p>
          </NoDataBox>
        </NoDataBoxWrapper>
      )}
    </>
  );
};

const enhance = compose(
  withNamespaces("manageClass"),
  React.memo
);

export default enhance(ManageClassContainer);

ManageClassContainer.propTypes = {
  t: PropTypes.func.isRequired,
  classList: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  showClass: PropTypes.string.isRequired
};

const NoDataBoxWrapper = styled.div`
  height: calc(100vh - 150px);
`;

const ClassCardWrapper = styled.div`
  display: flex;
  flex-flow: wrap;
  justify-content: space-between;
  &:after {
    content: "";
    flex: auto;
  }
`;

const SubHeaderWrapper = styled(Row)`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  margin: 15px 0px;

  @media (max-width: ${smallDesktopWidth}) {
    margin: 10px 0px;
  }
`;
const JoinClassBtn = styled(Button)`
  background: ${white};
  color: ${themeColor};
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 25px 0px 10px;
  text-transform: uppercase;
  &:focus,
  :hover {
    background: ${white};
    color: ${themeColor};
  }
  svg {
    margin-right: 20px;
    height: 17px;
    width: 17px;
    background: ${themeColor};
    border-radius: 50%;
    padding: 4px;
  }

  @media (max-width: ${smallDesktopWidth}) {
    font-size: 10px;
    height: 32px;
  }
`;

export const JoinClassModal = styled(Modal)`
  top: 35%;
  border-radius: 7px;
  .ant-modal-header {
    border: none;
    padding: 20px 24px;
    .ant-modal-title {
      font-size: 16px;
      font-weight: 700;
    }
  }
  .ant-modal-body {
    padding: 10px 24px;
  }

  .ant-modal-footer {
    border: none;
    padding: 20px 24px;
  }
`;
export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const StyledButton = styled(Button)`
  border-radius: 4px;
  width: 114px;
  height: 36px;
  font-size: 11px;
  font-family: Open Sans, Semibold;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => (props.type === "primary" ? themeColor : white)};
  color: ${props => (props.type === "primary" ? white : themeColor)};
  border-color: ${themeColor};
  &:hover,
  :focus {
    background: ${props => (props.type === "primary" ? themeColor : white)};
    color: ${props => (props.type === "primary" ? white : themeColor)};
  }
`;

export const StyledInput = styled(Input)`
  border: ${props => (props.classCode && !props.classCode.length ? `1px solid ${themeColor}` : "1px solid red")};
`;
export const ErrorMessage = styled.div`
  color: red;
  text-align: start;
  padding-top: 5px;
`;
