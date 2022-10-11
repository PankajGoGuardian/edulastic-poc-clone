import React, { useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'
import uuidv4 from 'uuid/v4'
import { connect } from 'react-redux'
import CardMapImage from '../../../src/assets/map-card.svg'
import { Content, Header, RoundDiv, StyledPreviewImage } from '../../components'
import { setUserAnswerAction } from '../../../../assessment/actions/answers'

const Card = ({
  title,
  cardImage,
  onSelectQuestionType,
  data,
  setUserAnswer,
}) => {
  const smallData = {
    ...data,
    smallSize: true,
  }

  return (
    <>
      <RoundDiv onClick={() => onSelectQuestionType(smallData)} data-cy={title}>
        <Header className="card-title">{title}</Header>
        <Content>
          <StyledPreviewImage src={cardImage || CardMapImage} alt="" />
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
  setUserAnswer: PropTypes.func.isRequired,
}

export default connect(null, { setUserAnswer: setUserAnswerAction })(Card)
