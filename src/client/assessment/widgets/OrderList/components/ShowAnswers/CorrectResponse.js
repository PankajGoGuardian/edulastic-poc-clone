import React from 'react'
import styled from 'styled-components'
import { get, sortBy, keys } from 'lodash'
import { MathFormulaDisplay } from '@edulastic/common'
import { getStemNumeration } from '../../../../utils/helpers'
import { OrderListWrapper } from '../OrderListPreview'
import { Container as Item } from '../OrderListPreview/styled/Container'
import { IndexBox } from '../OrderListPreview/styled/IndexBox'
import { Text } from '../OrderListPreview/styled/Text'

export const sortAnswers = (obj) =>
  sortBy(
    keys(obj).map((key) => ({
      id: key,
      index: obj[key],
    })),
    (ite) => ite.index
  )

const PreviewItem = ({
  index,
  value,
  listItemStyle,
  isPrintPreview,
  fontSize,
  styleType,
  smallSize,
  stemNumeration,
}) => {
  const columns = styleType === 'inline' ? 3 : 1

  const content = (
    <Text
      showAnswer
      styleType={styleType}
      smallSize={smallSize}
      {...listItemStyle}
    >
      <MathFormulaDisplay
        style={{ margin: 'auto' }}
        fontSize={fontSize}
        dangerouslySetInnerHTML={{ __html: value || '' }}
      />
    </Text>
  )

  return (
    <div className="__prevent-page-break">
      <Item
        columns={columns}
        id={`order-list-${1}`}
        style={listItemStyle}
        isPrintPreview={isPrintPreview}
        styleType={styleType}
      >
        <IndexBox smallSize={smallSize} showAnswer>
          {getStemNumeration(stemNumeration, index)}
        </IndexBox>
        {content}
      </Item>
    </div>
  )
}

const CorrectResponse = ({
  validation,
  options,
  isPrintPreview,
  smallSize,
  styleType,
  listItemStyle,
  fontSize,
  stemNumeration,
}) => {
  const validResp = get(validation, 'validResponse.value', {})
  const list = sortAnswers(validResp)

  return (
    <OrderListWrapper
      data-cy="order-preview-container"
      id="order-preview-container"
      styleType={styleType}
    >
      <div>
        {list.map((item, index) => (
          <PreviewItem
            key={item.id}
            isPrintPreview={isPrintPreview}
            value={options[item.id]}
            index={index}
            smallSize={smallSize}
            listItemStyle={listItemStyle}
            fontSize={fontSize}
            styleType={styleType}
            stemNumeration={stemNumeration}
          />
        ))}
      </div>
    </OrderListWrapper>
  )
}

export default CorrectResponse

export const AnswerContent = styled.div`
  padding-left: 20px;
`
