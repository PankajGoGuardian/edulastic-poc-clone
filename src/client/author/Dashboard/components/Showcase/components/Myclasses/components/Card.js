import { Row } from 'antd'
import styled from 'styled-components'
import React from 'react'
import CardImage from './CardImage/cardImage'
import CardTextContent from './CardTextContent/cardTextContent'

const CardBox = styled.div``

const Card = ({ data, userId }) => (
  <CardBox data-cy={data.name}>
    <Row>
      <CardImage data={data} userId={userId} />
    </Row>
    <Row>
      <CardTextContent data={data} userId={userId} />
    </Row>
  </CardBox>
)

export default Card
