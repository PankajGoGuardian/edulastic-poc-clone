import React, { useEffect } from "react";
import { compose } from "redux";
import { Spin } from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Switch, Route, withRouter } from "react-router-dom";
// themes
import ThemeContainer from "./themes/index";
import { loadTestAction } from "./actions/test";
import { testActivityLoadingSelector } from "./selectors/test";
import RequirePassword from "./RequirePassword";

const AssessmentPlayer = ({
  defaultAP,
  loadTest,
  match,
  preview = false,
  testId,
  demo,
  isPasswordValidated,
  testActivityLoading,
  test,
  LCBPreviewModal,
  closeTestPreviewModal
}) => {
  useEffect(() => {
    testId = preview ? testId : match.params.id;
    const { utaId: testActivityId, groupId } = match.params;

    loadTest({ testId, testActivityId, preview, demo, test, groupId });
  }, [testId]);

  // const confirmBeforeQuitting = e => {
  //   // for older IE versions
  //   e = e || window.event;
  //   if (e) {
  //     e.returnValue = "Are you sure you want to quit?";
  //   }
  //   // for modern browsers
  //   // note: for modern browsers support for custom messages has been deprecated
  //   return "Are you sure you want to quit";
  // };

  // useEffect(() => {
  //   window.addEventListener("beforeunload", confirmBeforeQuitting);
  //   return () => {
  //     window.removeEventListener("beforeunload", confirmBeforeQuitting);
  //   };
  // }, []);

  if (preview) {
    return (
      <ThemeContainer
        closeTestPreviewModal={closeTestPreviewModal}
        LCBPreviewModal={LCBPreviewModal}
        defaultAP
        preview
      />
    );
  }
  if (testActivityLoading) {
    return <Spin />;
  }
  if (!isPasswordValidated) {
    return <RequirePassword />;
  }

  return (
    <Switch>
      <Route path={`${match.url}/qid/:qid`} render={() => <ThemeContainer defaultAP={defaultAP} url={match.url} />} />
    </Switch>
  );
};

AssessmentPlayer.propTypes = {
  defaultAP: PropTypes.any.isRequired,
  loadTest: PropTypes.func.isRequired,
  match: PropTypes.any.isRequired,
  preview: PropTypes.any,
  testId: PropTypes.string,
  test: PropTypes.object,
  LCBPreviewModal: PropTypes.any.isRequired
};

AssessmentPlayer.defaultProps = {
  preview: false,
  testId: "",
  test: {}
};

// export component
const enhance = compose(
  withRouter,
  connect(
    state => ({
      isPasswordValidated: state.test.isPasswordValidated,
      testActivityLoading: testActivityLoadingSelector(state)
    }),
    {
      loadTest: loadTestAction
    }
  )
);
export default enhance(AssessmentPlayer);
