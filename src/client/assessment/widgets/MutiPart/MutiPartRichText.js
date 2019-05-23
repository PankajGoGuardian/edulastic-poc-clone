import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { withNamespaces } from "@edulastic/localization";
import { Paper } from "@edulastic/common";

import QuestionTextArea from "../../components/QuestionTextArea";
import Template from "./Template";
import { Subtitle } from "../../styled/Subtitle";

import { changeItemAction, changeUIStyleAction } from "../../../author/src/actions/question";

const MutiPartRichText = ({ item, t }) => {
  const handleStimulusChange = stimulus => {
    console.log(stimulus);
  };

  const setConent = newItem => {
    console.log(newItem);
  };

  return (
    <Fragment>
      <Paper style={{ marginBottom: 30 }}>
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
  t: PropTypes.func.isRequired
};

const enhance = compose(
  withNamespaces("assessment"),
  connect(
    ({ user }) => ({ user }),
    { changeItem: changeItemAction, changeUIStyle: changeUIStyleAction }
  )
);

export default enhance(MutiPartRichText);
