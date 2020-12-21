import { Row } from 'antd'
import styled from 'styled-components'
import React from 'react'
import CardImage from './CardImage/cardImage'
import CardTextContent from './CardTextContent/cardTextContent'

const CardBox = styled.div``

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
