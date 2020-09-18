import React, { useRef, useLayoutEffect } from "react";
import { connect } from "react-redux";

import { TabContainer } from "@edulastic/common";
import { updatePosition as updatePositionAction } from "../../../../../author/src/reducers/feedback";

function TabWrapper({
  testReviewStyle,
  fullHeight,
  children,
  showBorder,
  marginTop,
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

  const borderProps = showBorder ? { border: "1px solid #DADAE4", borderRadius: "10px" } : {};

  return (
    <TabContainer
      ref={containerRef}
      padding="0px"
      style={{
        ...testReviewStyle,
        ...borderProps,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: fullHeight ? "100%" : "auto",
        marginTop,
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
