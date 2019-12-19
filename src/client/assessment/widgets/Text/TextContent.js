import React from "react";
import { compose } from "redux";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { Subtitle } from "../../styled/Subtitle";
import Question from "../../components/Question";
import Options from "./components/Options";

const TextContent = ({ item, setQuestionData, t, advancedLink, fillSections, cleanSections }) => (
  <Question section="main" label={t("component.text.text")} fillSections={fillSections} cleanSections={cleanSections}>
    <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.text.text")}`)}>
      {t("component.text.text")}
    </Subtitle>
    {advancedLink}
    <Options setQuestionData={setQuestionData} item={item} t={t} />
  </Question>
);

TextContent.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  }).isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  advancedLink: PropTypes.any,
  cleanSections: PropTypes.func
};

TextContent.defaultProps = {
  advancedLink: null,
  fillSections: () => {},
  cleanSections: () => {}
};

export default compose(withNamespaces("assessment"))(TextContent);
