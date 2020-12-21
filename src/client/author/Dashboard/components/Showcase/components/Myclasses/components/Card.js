import { Row } from 'antd'
import React from 'react'
import { CardBox } from '../styled'
import CardImage from './CardImage/cardImage'
import CardTextContent from './CardTextContent/cardTextContent'

const Card = ({ data }) => (
  <CardBox data-cy={data.name}>
    <Row>
      <CardImage data={data} />
    </Row>
    <Row>
      <CardTextContent data={data} />
    </Row>
  </CardBox>
)

export default Card
