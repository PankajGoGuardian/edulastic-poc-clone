import React, { useCallback } from 'react'
import { DatePicker } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { useLatestRef } from '@edulastic/common'
import { getTerms } from '../../../../src/selectors/user'
import FormItem from '../FilterForm/components/FormLayout/FormItem'
import useFormDependencies from '../FilterForm/hooks/useFormDependencies'
import moment from 'moment'

const { MonthPicker: AntdMonthPicker } = DatePicker

/**
 * @param {{decorator: import('antd/lib/form').FormComponentProps['form']}} props
 */
function MonthPicker(props) {
  const {
    config,
    form,
    decoratorOptions,
    withinSelectedTerm,
    terms,
    maxFormDate,
    minFormDate,
    ...restProps
  } = props
  const { title, key } = config

  const { startDate: termStartDate, endDate: termEndDate } =
    terms.find((term) => term._id === form.getFieldValue('term')?.key) || {}
  const formRef = useLatestRef(form)
  const checkDisabledDate = useCallback(
    (date) => {
      let isEnabled = true
      if (withinSelectedTerm) {
        if (!termStartDate || !termEndDate) return true
        isEnabled =
          isEnabled &&
          date.valueOf() <= termEndDate &&
          date.valueOf() >= termStartDate
      }
      if (minFormDate) {
        const minDate = formRef.current.getFieldValue(minFormDate)
        isEnabled = minDate ? +minDate < date && isEnabled : isEnabled
      }
      if (maxFormDate) {
        const maxDate = formRef.current.getFieldValue(maxFormDate)
        isEnabled = maxDate ? +maxDate > date && isEnabled : isEnabled
      }
      return !isEnabled
    },
    [termStartDate, termEndDate]
  )

  useFormDependencies(form, config)
  return (
    <FormItem data-cy={key} label={title}>
      {form.getFieldDecorator(key, {
        getValueFromEvent: (d) => +d,
        getValueProps: (d) => ({ value: d ? moment(+d) : undefined }),
        ...decoratorOptions,
      })(
        <AntdMonthPicker
          style={{ width: '100%' }}
          disabledDate={checkDisabledDate}
          allowClear={false}
          {...restProps}
        />
      )}
    </FormItem>
  )
}

MonthPicker.propTypes = {}
MonthPicker.defaultProps = {}

const enhance = compose(
  connect(
    (state) => ({
      terms: getTerms(state),
    }),
    {}
  )
)

export default enhance(MonthPicker)
