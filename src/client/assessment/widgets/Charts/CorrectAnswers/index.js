import React from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import { Col } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { Tabs, Tab, FlexContainer } from "@edulastic/common";

import Question from "../../../components/Question";
import { Subtitle } from "../../../styled/Subtitle";
import { Row } from "./styled/Grid";

import { IconClose } from "./styled/IconClose";
import { Label } from "../../../styled/WidgetOptions/Label";
import { CorrectAnswerHeader, PointsInput } from "../../../styled/CorrectAnswerHeader";
import { AlternateAnswerLink } from "../../../styled/ButtonStyles";

const CorrectAnswers = ({
  t,
  onTabChange,
  validation,
  chartPreview,
  fillSections,
  cleanSections,
  onChangePoints,
  currentTab,
  onAdd,
  onCloseTab,
  points,
  item
}) => {
  const handleChangePoint = event => {
    if (event.target.value > 0) {
      onChangePoints(+event.target.value);
    }
  };

  const handleAddAlternate = () => {
    onTabChange();
    onAdd();
  };

  const handleCloseAlter = index => () => {
    onCloseTab(index - 1);
  };

  const tabs = new Array(validation.altResponses ? validation.altResponses.length + 1 : 0).fill(
    true
  );
  const isAlt = !isEmpty(validation.altResponses);

  return (
    <Question
      section="main"
      label={t("component.correctanswers.setcorrectanswers")}
      fillSections={fillSections}
      cleanSections={cleanSections}
    >
      <Subtitle
        id={getFormattedAttrId(`${item?.title}-${t("component.correctanswers.setcorrectanswers")}`)}
      >
        {t("component.correctanswers.setcorrectanswers")}
      </Subtitle>

      <Row gutter={24}>
        <Col md={12}>
          <CorrectAnswerHeader>
            <Label>{t("component.correctanswers.points")}</Label>
            <PointsInput
              type="number"
              value={points}
              onChange={handleChangePoint}
              step={0.5}
              min={0.5}
            />
          </CorrectAnswerHeader>
        </Col>
        <Col md={12}>
          <AlternateAnswerLink onClick={handleAddAlternate}>
            {`+ ${t("component.correctanswers.alternativeAnswer")}`}
          </AlternateAnswerLink>
        </Col>
      </Row>
      {isAlt && (
        <Tabs value={currentTab} onChange={onTabChange}>
          {tabs.map((_, i) => {
            let label = t("component.correctanswers.correct");
            if (i > 0) {
              label = (
                <FlexContainer>
                  <span>{`${t("component.correctanswers.alternate")} ${i}`}</span>
                  <IconClose onClick={handleCloseAlter(i)} data-cy="del-alter" />
                </FlexContainer>
              );
            }
            return <Tab key={`alter-tab-${i}`} label={label} type="primary" />;
          })}
        </Tabs>
      )}
      {chartPreview}
    </Question>
  );
};

CorrectAnswers.propTypes = {
  onTabChange: PropTypes.func.isRequired,
  onChangePoints: PropTypes.func.isRequired,
  onCloseTab: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  validation: PropTypes.object.isRequired,
  points: PropTypes.number.isRequired,
  currentTab: PropTypes.number.isRequired,
  chartPreview: PropTypes.any,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  item: PropTypes.object.isRequired
};

CorrectAnswers.defaultProps = {
  chartPreview: null,
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(CorrectAnswers);
