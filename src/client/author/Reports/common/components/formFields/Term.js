import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { getTerms } from '../../../../src/selectors/user'
import ControlDropdown from '../FilterForm/fields/ControlDropdown'
import FormItem from '../FilterForm/components/FormLayout/FormItem'
import useFormDependencies from '../FilterForm/hooks/useFormDependencies'
import useValueWithLabel from '../FilterForm/hooks/useValueWithLabel'

/**
 * @param {{decorator: import('antd/lib/form').FormComponentProps['form']}} props
 */
function Term(props) {
  const { config, terms, form } = props
  const { title = 'School Year', key } = config
  const options = useMemo(() =>
    terms.map((term) => ({ key: term._id, title: term.name }))
  )
  useValueWithLabel(form, config, {
    getValue: (k) => options.find((opt) => opt.key === k),
  })

  useFormDependencies(form, config)
  return (
    <>
      <FormItem data-cy={key} label={title}>
        {form.getFieldDecorator(key, {
          rules: [
            {
              required: true,
            },
          ],
          initialValue:'5f32425f77bf0d0007ccf137'// { key: '5f32425f77bf0d0007ccf137' },
        })(
          <ControlDropdown
            options={options}
            prefix="School Year"
            showPrefixOnSelected={false}
            labelInValue
          />
        )}
      </FormItem>
    </>
  )
}

Term.propTypes = {}
Term.defaultProps = {}
const enhance = compose(
  connect(
    (state) => ({
      terms: getTerms(state),
    }),
    {}
  )
)
export default enhance(Term)
