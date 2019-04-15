import React, { Component } from "react";
import PropTypes from "prop-types";
import { Col } from "antd";
import { getTestAuthorName } from "../../../dataUtils";
import Item from "../Item/Item";
import ListItem from "../ListItem/ListItem";

class CardWrapper extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    windowWidth: PropTypes.number,
    blockStyle: PropTypes.string
  };

  render() {
    const {
      blockStyle,
      item,
      item: { _id },
      windowWidth,
      history,
      match
    } = this.props;
    const itemId = _id.substr(_id.length - 5);
    if (blockStyle === "tile") {
      return (
        <Col key={item._id} span={windowWidth > 468 ? 8 : 24} style={{ marginBottom: 20 }}>
          <Item
            owner={this.props.owner}
            item={item}
            history={history}
            match={match}
            authorName={getTestAuthorName(item)}
            testItemId={itemId}
          />
        </Col>
      );
    }

    return (
      <Col key={item._id} span={24}>
        <ListItem
          owner={this.props.owner}
          item={item}
          history={history}
          match={match}
          authorName={getTestAuthorName(item)}
          testItemId={itemId}
        />
      </Col>
    );
  }
}

export default CardWrapper;
