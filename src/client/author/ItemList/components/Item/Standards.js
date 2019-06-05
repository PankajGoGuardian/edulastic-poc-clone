import React from "react";
import { connect } from "react-redux";
import { getInterestedCurriculumsSelector } from "../../../src/selectors/user";
import { StandardContent, LabelStandard, LabelStandardText, CountGreen } from "./styled";
const Standards = ({ item, interestedCurriculums, search }) => {
  const outStandardsCount = 3;
  const { curriculumId } = search;
  const domains = [];
  const standards = [];
  if (item.data && item.data.questions) {
    item.data.questions.map(question => {
      if (!question.alignment || !question.alignment.length) return;
      //removing all multiStandard mappings
      const authorAlignments = question.alignment.filter(item => !item.isEquivalentStandard && item.curriculumId);

      //pick alignments matching with interested curriculums
      let interestedAlignments = authorAlignments.filter(alignment =>
        interestedCurriculums.some(interested => interested._id === alignment.curriculumId)
      );

      //pick alignments based on search if interested alignments is empty
      if (!interestedAlignments.length) {
        interestedAlignments = authorAlignments.filter(alignment => alignment.curriculumId === curriculumId);
        // use the authored alignments if still the interested alignments is empty
        if (!interestedAlignments.length) {
          interestedAlignments = authorAlignments;
        }
      }
      interestedAlignments.map(el => (el.domains && el.domains.length ? domains.push(...el.domains) : null));
    });
    if (!domains.length) return null;
    domains.map(el => (el.standards && el.standards.length ? standards.push(...el.standards) : null));
  }

  return standards.length ? (
    <StandardContent>
      {standards.map((standard, index) =>
        index + 1 <= outStandardsCount ? (
          <LabelStandard key={`Standard_${standard.name}_${index}`}>
            <LabelStandardText>{standard.name}</LabelStandardText>
          </LabelStandard>
        ) : (
          index + 1 === standards.length && (
            <CountGreen key={`Count_${item._id}`}>+{standards.length - outStandardsCount}</CountGreen>
          )
        )
      )}
    </StandardContent>
  ) : null;
};

export default connect(
  state => ({ interestedCurriculums: getInterestedCurriculumsSelector(state) }),
  null
)(Standards);
