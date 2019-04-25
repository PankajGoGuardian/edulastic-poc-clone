import React, { memo } from "react";
import PropTypes from "prop-types";
import { Row, Col, Button } from "antd";
import { connect } from "react-redux";
import { compose } from "redux";
import { uniq as _uniq } from "lodash";
import { IconSource } from "@edulastic/icons";
import { blue } from "@edulastic/colors";
import { Paper, withWindowSizes } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { getItemsSubjectAndGradeSelector } from "../../../AddItems/ducks";
import { Container, ButtonLink } from "../../../../../src/components/common";
import Sidebar from "../Sidebar/Sidebar";
import SummaryHeader from "../SummaryHeader/SummaryHeader";
import Description from "../Description/Description";
import Breadcrumb from "../../../../../src/components/Breadcrumb";
import { SecondHeader } from "./styled";
import { getSummarySelector } from "../../ducks";

const Summary = ({
  setData,
  test,
  current,
  t,
  onShowSource,
  windowWidth,
  itemsSubjectAndGrade,
  onChangeGrade,
  onChangeSubjects
}) => {
  const handleChangeField = (field, value) => {
    setData({ ...test, [field]: value });
  };

  const breadcrumbData = [
    {
      title: "TESTS LIBRARY",
      to: "/author/tests"
    },
    {
      title: current,
      to: ""
    }
  ];
  const grades = _uniq([...test.grades, ...itemsSubjectAndGrade.grades]);
  const subjects = _uniq([...test.subjects, ...itemsSubjectAndGrade.subjects]);
  return (
    <Container>
      <SecondHeader>
        <Breadcrumb data={breadcrumbData} style={{ position: "unset" }} />
        <Button>
          <ButtonLink onClick={onShowSource} color="primary" icon={<IconSource color={blue} width={16} height={16} />}>
            {t("component.questioneditor.buttonbar.source")}
          </ButtonLink>
        </Button>
      </SecondHeader>
      <Paper style={{ margin: "25px auto 0 auto", width: windowWidth > 993 ? "1000px" : "100%" }}>
        <SummaryHeader createdBy={test.createdBy} windowWidth={windowWidth} />
        <Row gutter={32}>
          <Col span={windowWidth > 993 ? 12 : 24}>
            <Sidebar
              title={test.title}
              description={test.description}
              tags={test.tags}
              analytics={test.analytics}
              collection={test.collection}
              onChangeField={handleChangeField}
              windowWidth={windowWidth}
              grades={grades}
              subjects={subjects}
              onChangeGrade={onChangeGrade}
              onChangeSubjects={onChangeSubjects}
            />
          </Col>
          <Col span={windowWidth > 993 ? 12 : 24}>
            <Description windowWidth={windowWidth} description={test.description} onChangeField={handleChangeField} />
          </Col>
        </Row>
      </Paper>
    </Container>
  );
};

Summary.propTypes = {
  setData: PropTypes.func.isRequired,
  test: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  current: PropTypes.string.isRequired,
  onShowSource: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  itemsSubjectAndGrade: PropTypes.object.isRequired,
  onChangeGrade: PropTypes.func.isRequired,
  onChangeSubjects: PropTypes.func.isRequired
};

const enhance = compose(
  memo,
  withWindowSizes,
  withNamespaces("author"),
  connect(
    state => ({
      summary: getSummarySelector(state),
      itemsSubjectAndGrade: getItemsSubjectAndGradeSelector(state)
    }),
    null
  )
);

export default enhance(Summary);
