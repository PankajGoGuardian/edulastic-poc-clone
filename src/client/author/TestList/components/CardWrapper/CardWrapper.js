import React, { Component } from "react";
import PropTypes from "prop-types";
import { Col } from "antd";
import { getTestAuthorName, getPlaylistAuthorName } from "../../../dataUtils";
import Item from "../Item/Item";
import ListItem from "../ListItem/ListItem";

class CardWrapper extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    windowWidth: PropTypes.number,
    blockStyle: PropTypes.string,
    isTestAdded: PropTypes.bool,
    removeTestFromPlaylist: PropTypes.func,
    addTestToPlaylist: PropTypes.func,
    owner: PropTypes.object
  };

  static defaultProps = {
    owner: {},
    windowWidth: null,
    isTestAdded: false,
    blockStyle: ""
  };

  render() {
    const {
      blockStyle,
      item,
      item: { _id },
      windowWidth,
      history,
      match,
      isPlaylist,
      isTestAdded,
      removeTestFromPlaylist,
      addTestToPlaylist,
      owner
    } = this.props;

    const itemId = _id.substr(_id.length - 5);

    if (blockStyle === "tile") {
      return (
        <Col key={item._id} span={windowWidth > 468 ? 8 : 24} style={{ marginBottom: 20 }}>
          <Item
            owner={owner}
            item={item}
            history={history}
            match={match}
            authorName={isPlaylist ? getPlaylistAuthorName(item) : getTestAuthorName(item)}
            testItemId={itemId}
            isPlaylist={isPlaylist}
          />
        </Col>
      );
    }

    return (
      <Col key={item._id} span={24}>
        <ListItem
          owner={owner}
          item={item}
          windowWidth={windowWidth}
          history={history}
          match={match}
          addTestToPlaylist={addTestToPlaylist}
          isTestAdded={isTestAdded}
          removeTestFromPlaylist={removeTestFromPlaylist}
          authorName={isPlaylist ? getPlaylistAuthorName(item) : getTestAuthorName(item)}
          testItemId={itemId}
          isPlaylist={isPlaylist}
        />
      </Col>
    );
  }
}

export default CardWrapper;
