import React, { useState } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import { Row, Spin, Button, Modal, Input } from "antd";
import ClassCard from "./CardContainer";

import { Wrapper, NoDataBox, Title } from "../../styled";
import NoDataIcon from "../../assets/nodata.svg";
import styled from "styled-components";
import { themeColor, white } from "@edulastic/colors";
import { IconPlus } from "@edulastic/icons";

const ClassCards = ({ classList, t }) => {
  const cards = classList.map(classItem => <ClassCard key={classItem._id} classItem={classItem} t={t} />);
  return cards;
};

const ManageClassContainer = ({ t, classList, loading, showClass, joinClass, studentData }) => {
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
        <Title>{t("common.myClasses")}</Title>
        <JoinClassBtn onClick={() => setJoinClassModal(true)}>
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
                <StyledButton onClick={closeModalHandler}>{t("common.cancel")}</StyledButton>
                <StyledButton onClick={joinClassHandler} type={"primary"}>
                  {t("common.join")}
                </StyledButton>
              </ButtonWrapper>
            }
          >
            <StyledInput
              placeholder={t("common.enterClassCode").toLowerCase()}
              value={classCode}
              onChange={e => setClassCode(e.target.value)}
              classCode
            />
            {classCode !== null && !classCode.length ? <ErrorMessage>enter class code</ErrorMessage> : null}
          </JoinClassModal>
        )}
      </HeaderWrapper>

      {classList.length ? (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <ClassCards classList={classList} t={t} />
        </div>
      ) : (
        <NoDataBox>
          <img src={NoDataIcon} alt="noData" />
          <h4>{showClass === "ACTIVE" ? t("common.noActiveClassesTitle") : t("common.noClassesTitle")}</h4>
          <p>{showClass === "ACTIVE" ? t("common.noActiveClassesSubTitle") : t("common.noClassesSubTitle")}</p>
        </NoDataBox>
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

const CustomWrapper = styled(Wrapper)`
  padding: 30px 48px;
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 15px;
`;
const JoinClassBtn = styled(Button)`
  background: ${themeColor};
  border: none;
  border-radius: 25px;
  color: white;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 110px;
  padding: 0 15px;
  &:focus,
  :hover {
    background: ${themeColor};
    color: white;
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
