import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { get } from "lodash";
import { Spin } from "antd";
import styled from "styled-components";
import { greyLight1 } from "@edulastic/colors";
import ViewModal from "../../author/TestList/components/ViewModal";
import TestPreviewModal from "../../author/Assignments/components/Container/TestPreviewModal";
import { fetchTestAction } from "../ducks";

const PublicTestPage = ({ match, fetchTest, loading, test, error, history }) => {
  const { testId } = match.params;
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  useEffect(() => {
    fetchTest({ testId, sharedType: "PUBLIC" });
  }, []);

  const assignTest = e => {
    e && e.stopPropagation();
    history.push({
      pathname: `/author/assignments/${test._id}`,
      state: { from: "testLibrary", fromText: "Test Library", toUrl: "/author/tests" }
    });
  };

  const handleShowPreviewModal = () => setShowPreviewModal(true);

  if (error) {
    return <Redirect to="/login" />;
  } else if (loading || !test) {
    return <Spin />;
  }
  return (
    <StyledMainWrapper>
      <ViewModal
        item={test}
        modalView={false}
        publicAccess
        assign={assignTest}
        status={test.status}
        previewLink={handleShowPreviewModal}
      />
      {showPreviewModal && (
        <TestPreviewModal
          isModalVisible
          testId={testId}
          closeTestPreviewModal={() => setShowPreviewModal(false)}
          demo
          sharedType="PUBLIC"
        />
      )}
    </StyledMainWrapper>
  );
};

const StyledMainWrapper = styled.div`
  width: 50%;
  margin: auto;
  margin-top: 20px;
  .scrollbar-container {
    max-height: 100%;
    position: relative;
    top: 0;
  }
  .public-access-btn-wrapper {
    display: flex;
    flex-direction: column;
    button {
      margin-left: 0;
    }
    button + button {
      margin-top: 30px;
    }
  }
  .ant-card-bordered {
    border: 1px solid ${greyLight1};
    padding: 40px;
  }
`;

export default connect(
  state => ({
    loading: state.publicTest.loading,
    test: get(state, "publicTest.test"),
    error: get(state, "publicTest.error")
  }),
  {
    fetchTest: fetchTestAction
  }
)(PublicTestPage);
