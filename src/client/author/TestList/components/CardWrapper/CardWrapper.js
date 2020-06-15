import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Col } from "antd";
import { getTestAuthorName, getPlaylistAuthorName } from "../../../dataUtils";
import Item from "../Item/Item";
import ListItem from "../ListItem/ListItem";
import { CardBox } from "../Container/styled";
import { getCollectionsSelector, getUserFavoritesByType } from "../../../src/selectors/user";

class CardWrapper extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    windowWidth: PropTypes.number,
    blockStyle: PropTypes.string,
    isTestAdded: PropTypes.bool,
    mode: PropTypes.string.isRequired,
    removeTestFromPlaylist: PropTypes.func.isRequired,
    addTestToPlaylist: PropTypes.func.isRequired,
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
      mode,
      owner,
      standards = [],
      checked,
      handleCheckboxAction,
      moduleTitle,
      onRemoveFromCart,
      onAddToCart,
      collections,
      userFavorites
    } = this.props;

    const itemId = _id.substr(_id.length - 6);

    const isTestLiked = !isPlaylist && userFavorites.some(contentId => contentId === item.versionId);

    if (blockStyle === "tile") {
      return (
        <CardBox data-cy={item._id} key={item._id} style={{ marginBottom: 20 }}>
          <Item
            owner={owner}
            item={item}
            history={history}
            match={match}
            authorName={isPlaylist ? getPlaylistAuthorName(item) : getTestAuthorName(item, collections)}
            testItemId={itemId}
            isPlaylist={isPlaylist}
            windowWidth={windowWidth}
            standards={standards}
            isTestLiked={isTestLiked}
          />
        </CardBox>
      );
    }

    return (
      <Col data-cy={item._id} key={item._id} span={24}>
        <ListItem
          owner={owner}
          item={item}
          windowWidth={windowWidth}
          history={history}
          match={match}
          mode={mode}
          addTestToPlaylist={addTestToPlaylist}
          isTestAdded={isTestAdded}
          removeTestFromPlaylist={removeTestFromPlaylist}
          authorName={isPlaylist ? getPlaylistAuthorName(item) : getTestAuthorName(item, collections)}
          isPlaylist={isPlaylist}
          testItemId={itemId}
          standards={standards}
          moduleTitle={moduleTitle}
          checked={checked}
          handleCheckboxAction={handleCheckboxAction}
          onRemoveFromCart={onRemoveFromCart}
          onAddToCart={onAddToCart}
          isTestLiked={isTestLiked}
        />
      </Col>
    );
  }
}

export default connect(
  state => ({
    collections: getCollectionsSelector(state),
    userFavorites: getUserFavoritesByType(state, "TEST")
  }),
  {}
)(CardWrapper);
