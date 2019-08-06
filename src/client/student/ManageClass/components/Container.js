import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import { Row, Spin } from "antd";
import ClassCard from "./CardContainer";

import { Wrapper, NoDataBox, Title } from "../../styled";
import NoDataIcon from "../../assets/nodata.svg";

const ClassCards = ({ classList, t }) => {
  const cards = classList.map(classItem => <ClassCard key={classItem._id} classItem={classItem} t={t} />);
  return cards;
};

const ManageClassContainer = ({ t, classList, loading, showClass }) => {
  if (loading) return <Spin />;
  return (
    <Wrapper>
      <Title>{t("common.myClasses")}</Title>
      {classList.length ? (
        <Row gutter={34} style={{ padding: "0px 12px" }}>
          {<ClassCards classList={classList} t={t} />}
        </Row>
      ) : (
        <NoDataBox>
          <img src={NoDataIcon} alt="noData" />
          <h4>{showClass === "ACTIVE" ? t("common.noActiveClassesTitle") : t("common.noClassesTitle")}</h4>
          <p>{showClass === "ACTIVE" ? t("common.noActiveClassesSubTitle") : t("common.noClassesSubTitle")}</p>
        </NoDataBox>
      )}
    </Wrapper>
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
