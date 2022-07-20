import { Row } from 'antd'
import styled from 'styled-components'
import React from 'react'
import CardImage from './CardImage/cardImage'
import CardTextContent from './CardTextContent/cardTextContent'
import CardAssignmentContent from './CardAssignmentContent/cardAssignmentContent'

const CardBox = styled.div``

const Card = ({ data, userId, setClassType, activeClasses }) => (
  <CardBox data-cy={data.name}>
    <Row>
      <CardImage
        data={data}
        userId={userId}
        setClassType={setClassType}
        activeClasses={activeClasses}
      />
    </Row>
    <CardAssignmentContent data={data} userId={userId} />
    <Row>
      <CardTextContent data={data} userId={userId} />
    </Row>
  </CardBox>
)

export default Card
