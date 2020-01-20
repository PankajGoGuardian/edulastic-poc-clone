import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import produce from "immer";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

import { withNamespaces } from "@edulastic/localization";
import { Checkbox } from "@edulastic/common";

import Question from "../../../components/Question";
import { Row, Col } from "../../../styled/Grid";

import { Subtitle } from "../../../styled/Subtitle";
import { updateVariables } from "../../../utils/variables";
import { SubtitleContainer, StyledSectionContainer } from "../styled";
import { languages } from "../StaticData";
import { loadModeSpecificfiles } from "../ace";

const styles = {
  padding: 0,
  background: "none"
};

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

  const renderRow = (langs, i) => {
    return (
      <Row key={i} gutter={60}>
        {langs.map(lang => {
          const checked = item.languages.find(l => l.label === lang.label);
          return (
            <Col key={lang.label} md={6} style={{ textAlign: "left" }}>
              <Checkbox
                onChange={() => onChangeLanguage(lang)}
                checked={!!checked}
                label={lang.label}
                textTransform="uppercase"
              />
            </Col>
          );
        })}
      </Row>
    );
  };

  return (
    <Question
      dataCy="codinglanguages"
      section="main"
      label={t("component.coding.languageSection")}
      fillSections={fillSections}
      cleanSections={cleanSections}
      styles={styles}
    >
      <SubtitleContainer>
        <Subtitle
          id={getFormattedAttrId(`${item?.title}-${t("component.coding.languageSection")}`)}
          textStyles={{ margin: "0" }}
          showIcon={false}
        >
          {t("component.coding.languageSection")}
        </Subtitle>
      </SubtitleContainer>
      <StyledSectionContainer>{languages.map(renderRow)}</StyledSectionContainer>
    </Question>
  );
};

LanguageSection.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  fillSections: PropTypes.func.isRequired,
  cleanSections: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

LanguageSection.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(withNamespaces("assessment"));

export default enhance(LanguageSection);
