import React from 'react'
import { QLabelSpan } from '../styled'
import Tags from '../../../../../../src/components/common/Tags'

const ColumnTitle = ({ question }) => {
  const { questionLabel, standards = [], points } = question
  return (
    <>
      <QLabelSpan>{questionLabel}</QLabelSpan>
      <Tags placement="topRight" tags={standards} show={1} />
      <span>points {points}</span>
    </>
  )
}

export default ColumnTitle
