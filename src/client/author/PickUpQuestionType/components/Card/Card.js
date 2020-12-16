import React from 'react'
import PropTypes from 'prop-types'
import CardMapImage from '../../../src/assets/map-card.svg'
import { Content, Header, RoundDiv, StyledPreviewImage } from '../../components'

const Card = ({ title, cardImage, onSelectQuestionType, data }) => {
  const smallData = {
    ...data,
    smallSize: true,
  }

  return (
    <>
      <RoundDiv onClick={() => onSelectQuestionType(smallData)}>
        <Header className="card-title">{title}</Header>
        <Content>
          <StyledPreviewImage src={cardImage || CardMapImage} />
        </Content>
      </RoundDiv>
    </>
  )
}

Card.propTypes = {
  data: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  cardImage: PropTypes.object.isRequired,
  onSelectQuestionType: PropTypes.func.isRequired,
}

export default Card
