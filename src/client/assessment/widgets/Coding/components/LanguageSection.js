import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { withNamespaces } from "@edulastic/localization";
import produce from "immer";
import PropTypes from "prop-types";
import React from "react";
import { compose } from "redux";
import Question from "../../../components/Question";
import { CheckboxLabel } from "../../../styled/CheckboxWithLabel";
import { Subtitle } from "../../../styled/Subtitle";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Row } from "../../../styled/WidgetOptions/Row";
import { updateVariables } from "../../../utils/variables";
import { loadModeSpecificfiles } from "../ace";
import { languages } from "../StaticData";

const LanguageSection = ({ item, setQuestionData, fillSections, cleanSections, t }) => {
  const onChangeLanguage = lang => {
    setQuestionData(
      produce(item, draft => {
        const isChecked = draft.languages.find(l => l.label === lang.label);
        if (!isChecked) {
          draft.languages.push(lang);
          loadModeSpecificfiles(lang).catch(() => {});
        } else {
          draft.languages = draft.languages.filter(l => l.label !== lang.label);
        }
        updateVariables(draft);
      })
    );
  };

  const renderRow = (langs, i) => (
    <Row key={i} gutter={24}>
      {langs.map(lang => {
        const checked = item.languages.find(l => l.label === lang.label);
        return (
          <Col key={lang.label} md={6}>
            <CheckboxLabel onChange={() => onChangeLanguage(lang)} checked={!!checked} textTransform="uppercase">
              {lang.label}
            </CheckboxLabel>
          </Col>
        );
      })}
    </Row>
  );

  return (
    <Question
      dataCy="codinglanguages"
      section="main"
      label={t("component.coding.languageSection")}
      fillSections={fillSections}
      cleanSections={cleanSections}
    >
      <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.coding.languageSection")}`)} showIcon={false}>
        {t("component.coding.languageSection")}
      </Subtitle>
      {languages.map(renderRow)}
    </Question>
  );
};

LanguageSection.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  item: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

LanguageSection.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(withNamespaces("assessment"));

export default enhance(LanguageSection);
