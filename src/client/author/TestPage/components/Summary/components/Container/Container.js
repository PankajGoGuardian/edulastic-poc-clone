import React, { memo } from "react";
import PropTypes from "prop-types";
import { Row, Col, Button } from "antd";
import { connect } from "react-redux";
import { compose } from "redux";

import { IconSource } from "@edulastic/icons";
import { blue } from "@edulastic/colors";
import { Paper, withWindowSizes } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { getItemsSubjectAndGradeSelector } from "../../../AddItems/ducks";
import { Container, ButtonLink } from "../../../../../src/components/common";
import Sidebar from "../Sidebar/Sidebar";
import { Calculator } from "../../../common";
import Breadcrumb from "../../../../../src/components/Breadcrumb";
import { SecondHeader } from "./styled";
import { getSummarySelector } from "../../ducks";

const Summary = ({
  setData,
  test,
  itemsSubjectAndGrade,
  summary,
  current,
  t,
  onShowSource,
  windowWidth,
  onChangeGrade,
  onChangeSubjects
}) => {
  const handleChangeField = (field, value) => {
    setData({ ...test, [field]: value });
  };

  const tableData = summary.map(data => ({
    key: data.standard,
    standard: data.standard,
    qs: data.questionsCount,
    points: data.score || 0
  }));

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
  const grades = [...new Set([...test.grades, ...itemsSubjectAndGrade.grades])];
  const subjects = [...new Set([...test.subjects, ...itemsSubjectAndGrade.subjects])];
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
      <Paper style={{ marginTop: 25 }}>
        <Row style={{ display: "flex", justifyContent: "center" }}>
          <Col span={windowWidth > 993 ? 16 : 24}>
            <Row
              gutter={32}
              style={{
                padding: windowWidth < 468 ? "20px 15px 20px 25px" : "0px"
              }}
            >
              <Col span={windowWidth > 993 ? 12 : 24}>
                <Sidebar
                  title={test.title}
                  description={test.description}
                  tags={test.tags}
                  analytics={test.analytics}
                  collection={test.collection}
                  createdBy={test.createdBy}
                  onChangeField={handleChangeField}
                  windowWidth={windowWidth}
                />
              </Col>
              <Col span={windowWidth > 993 ? 12 : 24}>
                <Calculator
                  totalPoints={test.scoring.total}
                  questionsCount={test.scoring.testItems.length}
                  grades={grades}
                  subjects={subjects}
                  onChangeGrade={onChangeGrade}
                  onChangeSubjects={onChangeSubjects}
                  tableData={tableData}
                  windowWidth={windowWidth}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Paper>
    </Container>
  );
};

Summary.propTypes = {
  setData: PropTypes.func.isRequired,
  test: PropTypes.object.isRequired,
  summary: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  current: PropTypes.string.isRequired,
  onShowSource: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired
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
