import React, { Fragment, useMemo } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import { EDIT, PREVIEW, CLEAR } from "../../constants/constantsForQuestions";
import { replaceVariables } from "../../utils/variables";

import EditClassification from "./EditClassification";
import ClassificationPreview from "./ClassificationPreview";

import { ContentArea } from "../../styled/ContentArea";

const Classification = props => {
  const { view, item, isSidebarCollapsed } = props;
  const itemForPreview = useMemo(() => replaceVariables(item), [item]);

  return (
    <Fragment>
      {view === EDIT && (
        <ContentArea isSidebarCollapsed={isSidebarCollapsed}>
          <EditClassification {...props} />
        </ContentArea>
      )}
      {view === PREVIEW && <ClassificationPreview {...props} item={itemForPreview} />}
    </Fragment>
  );
};

Classification.propTypes = {
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  smallSize: PropTypes.bool,
  item: PropTypes.object,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any,
  testItem: PropTypes.bool,
  evaluation: PropTypes.any,
  advancedAreOpen: PropTypes.bool,
  isSidebarCollapsed: PropTypes.bool.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

Classification.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  item: {},
  userAnswer: [],
  testItem: false,
  evaluation: "",
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  connect(({ authorUi }) => ({
    isSidebarCollapsed: authorUi.isSidebarCollapsed
  }))
);

const ClassificationContainer = enhance(Classification);

export { ClassificationContainer as Classification };
