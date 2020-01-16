import React, { useState } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import { Spin, Button, Modal, Input, Row, Col } from "antd";
import { IconPlus } from "@edulastic/icons";
import styled from "styled-components";
import { themeColor, white, mediumDesktopExactWidth, extraDesktopWidthMax, smallDesktopWidth } from "@edulastic/colors";
import ClassCard from "./CardContainer";

import { NoDataBox } from "../../styled";
import NoDataIcon from "../../assets/nodata.svg";
import ShowActiveClass from "../../sharedComponents/ShowActiveClasses";
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
  classSelect,
  showActiveClass,
  allClassList,
  setClassList,
  setShowClass
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
    <CustomWrapper>
      <HeaderWrapper>
        <AssignmentTitle>{t("common.manageClassTitle")}</AssignmentTitle>
        <JoinClassBtn data-cy="joinclass" onClick={() => setJoinClassModal(true)}>
          <IconPlus width={12} height={12} color="white" stroke="white" />
          <span>{t("common.joinClass")}</span>
        </JoinClassBtn>
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
                <StyledButton data-cy="joinbutton" onClick={joinClassHandler} type={"primary"}>
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
      </HeaderWrapper>
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
    </CustomWrapper>
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

const CustomWrapper = styled.div`
  padding-top: ${props => props.theme.HeaderHeight.xs}px;
  margin: 0px;

  @media (min-width: ${mediumDesktopExactWidth}) {
    padding-top: ${props => props.theme.HeaderHeight.md}px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    padding-top: ${props => props.theme.HeaderHeight.xl}px;
  }
`;

const HeaderWrapper = styled.div`
  position: fixed;
  left: 0px;
  right: 0px;
  top: 0px;
  background: ${themeColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 40px 0px 140px;
  height: ${props => props.theme.HeaderHeight.xs}px;

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${props => props.theme.HeaderHeight.md}px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${props => props.theme.HeaderHeight.xl}px;
  }
`;

const AssignmentTitle = styled.h2`
  color: ${white};
  margin: 0px;
  font-size: 22px;
  font-weight: bold;

  @media (max-width: ${smallDesktopWidth}) {
    font-size: 18px;
  }
`;

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
