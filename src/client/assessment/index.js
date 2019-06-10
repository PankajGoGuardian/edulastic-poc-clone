import React, { useEffect, useState } from "react";
import { compose } from "redux";
import { Spin, Modal, Input, Button, message } from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Switch, Route, withRouter } from "react-router-dom";
// themes
import ThemeContainer from "./themes/index";
import { loadTestAction, getAssigmentPasswordAction } from "./actions/test";
import { testActivityLoadingSelector } from "./selectors/test";

const AssessmentPlayer = ({
  defaultAP,
  loadTest,
  match,
  preview = false,
  testId,
  demo,
  history,
  getAssignmentPassword,
  isPasswordValidated,
  testActivityLoading
}) => {
  useEffect(() => {
    testId = preview ? testId : match.params.id;
    const { utaId: testActivityId } = match.params;

    loadTest({ testId, testActivityId, preview, demo });
  }, [testId]);

  const [assignmentPassword, setAssignmentPassword] = useState("");

  const validatePassword = () => {
    if (!assignmentPassword) return message.error("This assessment requies password");
    getAssignmentPassword(assignmentPassword);
  };

  const onCancel = () => {
    history.push("/home/assignments");
  };
  if (preview) {
    return <ThemeContainer defaultAP preview />;
  }
  if (testActivityLoading) {
    return <Spin />;
  }
  if (!isPasswordValidated) {
    return (
      <React.Fragment>
        <Modal
          title="Require Password"
          visible={!isPasswordValidated}
          onCancel={onCancel}
          maskClosable={false}
          centered={true}
          footer={[
            <Button key="back" onClick={onCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={validatePassword} disabled={!assignmentPassword.length}>
              Start
            </Button>
          ]}
        >
          <p>Enter password to start the assessment</p>
          <br />
          <p>
            <Input.Password
              placeholder="Enter assignment password"
              value={assignmentPassword}
              onChange={e => setAssignmentPassword(e.target.value)}
            />
            ,
          </p>
        </Modal>
      </React.Fragment>
    );
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
  testId: PropTypes.string
};

AssessmentPlayer.defaultProps = {
  preview: false,
  testId: ""
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
      loadTest: loadTestAction,
      getAssignmentPassword: getAssigmentPasswordAction
    }
  )
);
export default enhance(AssessmentPlayer);
