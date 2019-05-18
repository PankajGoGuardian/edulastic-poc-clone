import React, { useMemo, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { CLEAR, EDIT, PREVIEW } from "../../constants/constantsForQuestions";
import { replaceVariables } from "../../utils/variables";

import SortListPreview from "./SortListPreview";
import EditSortList from "./EditSortList";

import { ContentArea } from "../../styled/ContentArea";

const SortList = props => {
  const { item, view, isSidebarCollapsed } = props;
  const itemForPreview = useMemo(() => replaceVariables(item), [item]);

  return (
    <Fragment>
      {view === EDIT && (
        <ContentArea isSidebarCollapsed={isSidebarCollapsed}>
          <EditSortList {...props} />
        </ContentArea>
      )}
      {view === PREVIEW && <SortListPreview {...props} item={itemForPreview} />}
    </Fragment>
  );
};

SortList.propTypes = {
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  smallSize: PropTypes.bool,
  item: PropTypes.object,
  setQuestionData: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any,
  testItem: PropTypes.bool,
  evaluation: PropTypes.any,
  advancedAreOpen: PropTypes.bool
};

SortList.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  item: {},
  userAnswer: [],
  testItem: false,
  advancedAreOpen: false,
  evaluation: ""
};

const SortListContainer = connect(
  ({ authorUi }) => ({ isSidebarCollapsed: authorUi.isSidebarCollapsed }),
  { setQuestionData: setQuestionDataAction }
)(SortList);

export { SortListContainer as SortList };
