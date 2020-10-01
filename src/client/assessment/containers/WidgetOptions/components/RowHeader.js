import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from '@edulastic/localization'

import { Label } from '../../../styled/WidgetOptions/Label'
import { WidgetFRInput } from '../../../styled/Widget'
import QuestionTextArea from '../../../components/QuestionTextArea'

const RowHeader = ({ t, onChange, value, size, ...restProps }) => (
  <>
    <Label data-cy="rowHeaderInput">{t('component.options.rowHeader')}</Label>
    <WidgetFRInput>
      <QuestionTextArea
        toolbarId="rowHeader"
        toolbarSize="SM"
        placeholder=""
        onChange={onChange}
        value={value}
      />
    </WidgetFRInput>
  </>
)

RowHeader.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['default', 'large', 'small']),
  value: PropTypes.string,
}

RowHeader.defaultProps = {
  value: '',
  size: 'large',
}

export default withNamespaces('assessment')(RowHeader)
