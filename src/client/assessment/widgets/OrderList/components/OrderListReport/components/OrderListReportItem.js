import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { SortableElement } from 'react-sortable-hoc'
import { compose } from 'redux'
import { withTheme } from 'styled-components'

import { FlexContainer, MathFormulaDisplay } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'

import { Container } from '../styled/Container'
import { Text } from '../styled/Text'
import { Index } from '../styled/Index'

import { IconCorrectWrapper, IconCloseWrapper } from '../styled/IconWrapper'

const OrderListReportItem = SortableElement(
  ({ children, correct, ind, theme, columns, styleType }) => (
    <>
      <Container styleType={styleType} columns={columns} correct={correct}>
        <Text>
          <Index>{ind}</Index>
          <FlexContainer justifyContent="center">
            <MathFormulaDisplay
              dangerouslySetInnerHTML={{ __html: children }}
            />
          </FlexContainer>
          {correct && (
            <IconCorrectWrapper
              color={theme.widgets.orderList.correctIconWrapperColor}
            />
          )}
          {correct === false && (
            <IconCloseWrapper
              color={theme.widgets.orderList.incorrectIconWrapperColor}
            />
          )}
        </Text>
      </Container>
    </>
  )
)

OrderListReportItem.propTypes = {
  children: PropTypes.string.isRequired,
  correct: PropTypes.bool.isRequired,
  ind: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  columns: PropTypes.number,
  styleType: PropTypes.string,
}

OrderListReportItem.defaultProps = {
  columns: 1,
  styleType: 'button',
}

const enhance = compose(withNamespaces('assessment'), withTheme)

export default enhance(OrderListReportItem)
