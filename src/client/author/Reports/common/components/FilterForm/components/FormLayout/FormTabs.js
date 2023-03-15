import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Tabs } from 'antd'
import FormFields from './FormFields'

const populateConfig = (config) => {
  // TODO fill default values, convert to strict/verbose/fully-defined structure
  return config.map((tab) => ({
    ...tab,
    key: tab.key ?? tab.title,
  }))
}

/** @type {React.CSSProperties} */
const STYLES = {
  width: '100%',
}

function FormTabs(props) {
  const { config, form } = props
  const tabs = useMemo(() => populateConfig(config), [config])
  const [activeTabKey, setActiveTabKey] = useState(tabs[0].key)
  return (
    <Tabs
      animated={{ inkBar: true, tabPane: false }}
      activeKey={activeTabKey}
      onChange={setActiveTabKey}
      style={STYLES}
    >
      {tabs.map((tab) => (
        <Tabs.TabPane key={tab.key} tab={tab.title}>
          <FormFields config={tab.fields} form={form} />
        </Tabs.TabPane>
      ))}
    </Tabs>
  )
}

FormTabs.propTypes = {}
FormTabs.defaultProps = {}

export default FormTabs
