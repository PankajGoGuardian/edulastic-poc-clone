import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { SortableContainer } from 'react-sortable-hoc'
import OrderListReportItem from './components/OrderListReportItem'

class OrderListReport extends Component {
  getStemNumeration = (i, uiStyle) => {
    if (uiStyle) {
      switch (uiStyle.validationStemNumeration) {
        case 'upper-alpha':
          return String.fromCharCode(i + 65)
        case 'lower-alpha':
          return String.fromCharCode(i + 65).toLowerCase()
        default:
          break
      }
    }

    return i + 1
  }

  render() {
    const {
      evaluation,
      listStyle,
      columns,
      disableResponse,
      styleType,
      uiStyle,
      questions,
      getStemNumeration,
    } = this.props
    return (
      <div style={listStyle}>
        {questions.map((q, i) => (
          <OrderListReportItem
            key={i}
            columns={columns}
            disabled={disableResponse}
            listStyle={listStyle}
            styleType={styleType}
            correct={evaluation && evaluation[i]}
            index={i}
            ind={getStemNumeration(uiStyle.validationStemNumeration, i)}
            sortableHelper="sortableHelper"
          >
            {q}
          </OrderListReportItem>
        ))}
      </div>
    )
  }
}

OrderListReport.propTypes = {
  questions: PropTypes.array.isRequired,
  listStyle: PropTypes.object.isRequired,
  getStemNumeration: PropTypes.func.isRequired,
  disableResponse: PropTypes.bool,
  evaluation: PropTypes.array,
  columns: PropTypes.number,
  styleType: PropTypes.string,
  uiStyle: PropTypes.object.isRequired,
}
OrderListReport.defaultProps = {
  disableResponse: false,
  evaluation: [],
  columns: 1,
  styleType: 'button',
}

export default SortableContainer(OrderListReport)
