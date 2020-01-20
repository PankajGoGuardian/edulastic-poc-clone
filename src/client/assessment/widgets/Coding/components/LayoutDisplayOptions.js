import React from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

import { withNamespaces } from "@edulastic/localization";

import Question from "../../../components/Question";

import { Subtitle } from "../../../styled/Subtitle";
import { updateVariables } from "../../../utils/variables";
import { SubtitleContainer, StyledSectionContainer, StyledRadio, StyledRadioGroup } from "../styled";

const styles = {
  padding: 0,
  background: "none"
};

const LayoutDisplayOptions = ({ fillSections, cleanSections, item, setQuestionData, t }) => {
  const onChange = e => {
    setQuestionData(
      produce(item, draft => {
        draft.layout = e.target.value;
        updateVariables(draft);
      })
    );
  };

  return (
    <Question
      dataCy="codingstub"
      section="main"
      label={t("component.coding.codeDisplayOptions.title")}
      fillSections={fillSections}
      cleanSections={cleanSections}
      styles={styles}
      sectionId="codinglayouts"
    >
      <SubtitleContainer>
        <Subtitle
          id={getFormattedAttrId(`${item?.title}-${t("component.coding.codeDisplayOptions.title")}`)}
          textStyles={{ margin: "0", width: "100%" }}
          showIcon={false}
        >
          {t("component.coding.codeDisplayOptions.title")}
        </Subtitle>
      </SubtitleContainer>
      <StyledSectionContainer>
        <StyledRadioGroup onChange={onChange} value={item.layout}>
          <StyledRadio value={t("component.coding.codeDisplayOptions.leftright")}>
            {t("component.coding.codeDisplayOptions.leftright")}
          </StyledRadio>
          <StyledRadio value={t("component.coding.codeDisplayOptions.topbottom")}>
            {t("component.coding.codeDisplayOptions.topbottom")}
          </StyledRadio>
        </StyledRadioGroup>
      </StyledSectionContainer>
    </Question>
  );
};

LayoutDisplayOptions.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  fillSections: PropTypes.func.isRequired,
  cleanSections: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

LayoutDisplayOptions.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(LayoutDisplayOptions);
