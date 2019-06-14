import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { withNamespaces } from "@edulastic/localization";
import { Paper } from "@edulastic/common";
import { get } from "lodash";

import QuestionTextArea from "../../components/QuestionTextArea";
import Template from "./Template";
import { Subtitle } from "../../styled/Subtitle";

import { changeItemAction, changeUIStyleAction } from "../../../author/src/actions/question";

const MutiPartRichText = ({ col, item, t }) => {
  const handleStimulusChange = stimulus => {
    console.log(stimulus);
  };

  const setConent = newItem => {
    console.log(newItem);
  };

  const isV1Multipart = get(col, "isV1Multipart", false);

  return (
    <Fragment>
      <Paper isV1Multipart={isV1Multipart} style={{ marginBottom: 30 }}>
        <Subtitle>{t("component.multipart.composequestion")}</Subtitle>
        <QuestionTextArea
          placeholder={t("component.multipart.enterQuestion")}
          onChange={handleStimulusChange}
          value={item.stimulus}
        />
        <Template item={item} setQuestionData={setConent} />
      </Paper>
    </Fragment>
  );
};

MutiPartRichText.propTypes = {
  item: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  col: PropTypes.object
};

const enhance = compose(
  withNamespaces("assessment"),
  connect(
    ({ user }) => ({ user }),
    { changeItem: changeItemAction, changeUIStyle: changeUIStyleAction }
  )
);

export default enhance(MutiPartRichText);
