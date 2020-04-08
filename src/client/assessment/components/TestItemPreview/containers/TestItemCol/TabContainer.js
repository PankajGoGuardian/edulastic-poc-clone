import React, { useRef, useLayoutEffect } from "react";
import { connect } from "react-redux";

import { TabContainer } from "@edulastic/common";
import { updatePosition as updatePositionAction } from "../../../../../author/src/reducers/feedback";

function TabWrapper({
  testReviewStyle,
  fullHeight,
  children,
  updatePositionToStore,
  questionId,
  updatePosition,
  minHeight
}) {
  const containerRef = useRef(null);

  const heightOfContainer = containerRef.current?.clientHeight;

  /**
   * as of https://snapwiz.atlassian.net/browse/EV-12821
   *
   * we are showing stacked view in lcb
   * for multipart item, with level scoring off
   *
   * so different blocks will come at different positions, and we need to show feedback for respective questions
   * also, we don't show feedback for resources used in the item
   * so, we need a way to determine, from where we should start showing the feedback for the particular question
   *
   * storing the y coorindate of the question container and its height to the store
   * so that we can use it later in the code where we render feedback
   */

  useLayoutEffect(() => {
    if (containerRef.current && updatePositionToStore) {
      const top = containerRef.current.offsetTop;
      const height = containerRef.current.clientHeight;
      updatePosition({ id: questionId, dimensions: { top, height } });
    }
  }, [containerRef.current, heightOfContainer]); // change whenever, ref or the height of container changes

  return (
    <TabContainer
      ref={containerRef}
      style={{
        ...testReviewStyle,
        position: "relative",
        paddingTop: "0px",
        display: "flex",
        flexDirection: "column",
        height: fullHeight ? "100%" : "auto",
        minHeight
      }}
      className="question-tab-container"
    >
      {children}
    </TabContainer>
  );
}

const mapDispatchToProps = {
  updatePosition: updatePositionAction
};

const enhance = connect(
  null,
  mapDispatchToProps
)(TabWrapper);

export default enhance;
