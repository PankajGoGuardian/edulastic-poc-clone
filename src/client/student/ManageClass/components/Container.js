import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import { Row, Spin } from "antd";
import ClassCard from "./CardContainer";

import { Wrapper, NoDataBox, Title } from "../../styled";
import NoDataIcon from "../../assets/nodata.svg";
import styled from "styled-components";

const ClassCards = ({ classList, t }) => {
  const cards = classList.map(classItem => <ClassCard key={classItem._id} classItem={classItem} t={t} />);
  return cards;
};

const ManageClassContainer = ({ t, classList, loading, showClass }) => {
  if (loading) return <Spin />;
  return (
    <CustomWrapper>
      <Title>{t("common.myClasses")}</Title>
      {classList.length ? (
        <Row gutter={25}>{<ClassCards classList={classList} t={t} />}</Row>
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
  @media (max-width: 768px) {
    padding: 0px 15px;
  }
`;
