import React from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import { Col } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { Tabs, Tab } from "@edulastic/common";

import Question from "../../../components/Question";
import { Subtitle } from "../../../styled/Subtitle";
import { Row } from "./styled/Grid";

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

  const handleCloseAlter = index => evt => {
    evt?.stopPropagation();
    onCloseTab(index - 1);
  };

  const handleClickTab = index => onTabChange(index);

  const tabs = new Array(validation.altResponses ? validation.altResponses.length + 1 : 0).fill(true);
  const isAlt = !isEmpty(validation.altResponses);

  return (
    <Question
      section="main"
      label={t("component.correctanswers.setcorrectanswers")}
      fillSections={fillSections}
      cleanSections={cleanSections}
    >
      <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.correctanswers.setcorrectanswers")}`)}>
        {t("component.correctanswers.setcorrectanswers")}
      </Subtitle>

      <Row gutter={24}>
        <Col md={12}>
          <CorrectAnswerHeader>
            <Label>{t("component.correctanswers.points")}</Label>
            <PointsInput
              id={getFormattedAttrId(`${item?.title}-${t("component.correctanswers.points")}`)}
              type="number"
              value={points}
              onChange={handleChangePoint}
              step={0.5}
              min={0.5}
            />
          </CorrectAnswerHeader>
        </Col>
        <Col md={12}>
          <AlternateAnswerLink onClick={onAdd}>
            {`+ ${t("component.correctanswers.alternativeAnswer")}`}
          </AlternateAnswerLink>
        </Col>
      </Row>
      {isAlt && (
        <Tabs value={currentTab} onChange={handleClickTab}>
          {tabs.map((_, i) => {
            const label =
              i === 0 ? t("component.correctanswers.correct") : `${t("component.correctanswers.alternate")} ${i}`;
            return (
              <Tab
                key={`alter-tab-${i}`}
                close={i !== 0}
                onClose={handleCloseAlter(i)}
                label={label}
                IconPosition="right"
                type="primary"
              />
            );
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
