import React, { Fragment } from "react";
import { useDrop } from "react-dnd";
import { connect } from "react-redux";
import { SupportResourceDropTarget, NewActivityTarget } from "./styled";
import { addSubresourceToPlaylistAction } from "../../ducks";

import { addSubresourceToPlaylistAction as addSubresourceInPlaylistAction } from "../../../PlaylistPage/ducks";

function NewActivityTargetContainer({ children, ...props }) {
  const [{ isOver }, dropRef] = useDrop({
    accept: "item",
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      contentType: monitor.getItem()?.contentType
    }),
    drop: item => {
      const { moduleIndex, afterIndex, onDrop } = props;
      if (onDrop) {
        onDrop(moduleIndex, item, afterIndex);
      }
    }
  });

  return (
    <NewActivityTarget {...props} ref={dropRef} active={isOver}>
      {children}
    </NewActivityTarget>
  );
}

function SubResourceDropContainer({ children, ...props }) {
  const [{ isOver }, dropRef] = useDrop({
    accept: "item",
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      contentType: monitor.getItem()?.contentType
    }),
    drop: item => {
      const { moduleIndex, itemIndex, addSubresource } = props;
      if (addSubresource) {
        addSubresource({ moduleIndex, itemIndex, item });
      }
    }
  });

  return (
    <SupportResourceDropTarget {...props} ref={dropRef} active={isOver}>
      {children}
    </SupportResourceDropTarget>
  );
}

const AddResourceToPlaylist = ({
  index,
  isTestType,
  moduleIndex,
  addSubresource,
  onDrop,
  showNewActivity,
  showSupportingResource
}) => (
  <Fragment>
    {isTestType && showSupportingResource && (
      <SubResourceDropContainer moduleIndex={moduleIndex} addSubresource={addSubresource} itemIndex={index}>
        <span>Supporting Resource</span>
      </SubResourceDropContainer>
    )}
    {showNewActivity && (
      <NewActivityTargetContainer moduleIndex={moduleIndex} afterIndex={index} onDrop={onDrop}>
        <span> New activity</span>
      </NewActivityTargetContainer>
    )}
  </Fragment>
);

export default connect(
  null,
  (dispatch, { fromPlaylist }) => ({
    addSubresource: payload =>
      dispatch(fromPlaylist ? addSubresourceInPlaylistAction(payload) : addSubresourceToPlaylistAction(payload))
  })
)(AddResourceToPlaylist);
