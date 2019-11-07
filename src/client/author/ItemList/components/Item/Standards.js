import React from "react";
import { connect } from "react-redux";
import { uniqBy } from "lodash";
import { getInterestedCurriculumsSelector } from "../../../src/selectors/user";
import { StandardContent, LabelStandard, LabelStandardText, CountGreen } from "./styled";
import Tags from "../../../src/components/common/Tags";
const Standards = ({ item, interestedCurriculums, search }) => {
  const outStandardsCount = 1;
  const { curriculumId } = search;
  const domains = [];
  let standards = [];
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

  standards = uniqBy(standards, "id");
  return standards.length ? <Tags tags={standards.map(item => ({ ...item, tagName: item.name }))} show={1} /> : null;
};

export default connect(
  state => ({ interestedCurriculums: getInterestedCurriculumsSelector(state) }),
  null
)(Standards);
