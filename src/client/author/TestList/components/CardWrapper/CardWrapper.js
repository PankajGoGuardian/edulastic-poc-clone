import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Col } from 'antd'
import { getTestAuthorName, getPlaylistAuthorName } from '../../../dataUtils'
import Item from '../Item/Item'
import ListItem from '../ListItem/ListItem'
import { CardBox } from '../Container/styled'

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
    owner: PropTypes.object,
  }

  static defaultProps = {
    owner: false,
    windowWidth: null,
    isTestAdded: false,
    blockStyle: '',
  }

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
      isTestRecommendation,
      adaptiveTestId,
      setAdaptiveTestId,
    } = this.props

    const itemId = _id?.substr(_id.length - 6)

    const isTestLiked = (!isPlaylist && item?.alreadyLiked) || false

    if (blockStyle === 'tile') {
      return (
        <CardBox
          data-cy={item._id}
          data-test="card"
          className={`testCard${item._id}`}
          key={item._id}
          style={{ marginBottom: 20 }}
          isPlaylist={isPlaylist}
        >
          <Item
            owner={owner}
            item={item}
            history={history}
            match={match}
            authorName={
              isPlaylist ? getPlaylistAuthorName(item) : getTestAuthorName(item)
            }
            testItemId={itemId}
            isPlaylist={isPlaylist}
            windowWidth={windowWidth}
            standards={standards}
            isTestLiked={isTestLiked}
            isTestRecommendation={isTestRecommendation}
            adaptiveTestId={adaptiveTestId}
            setAdaptiveTestId={setAdaptiveTestId}
          />
        </CardBox>
      )
    }

    return (
      <Col
        data-cy={item._id}
        className={`testCard${item._id}`}
        key={item._id}
        span={24}
      >
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
          authorName={
            isPlaylist ? getPlaylistAuthorName(item) : getTestAuthorName(item)
          }
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
    )
  }
}

export default CardWrapper
