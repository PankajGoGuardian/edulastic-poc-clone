import React from 'react'
import { Route } from 'react-router-dom'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'

import WholeChildReport from './wholeChildReport'

const DataWarehouseReportsContainer = ({
  breadcrumbData,
  isCliUser,
  showApply,
  showFilter,
  onRefineResultsCB,
  loc,
  updateNavigation,
  ..._props
}) => {
  return (
    <FeaturesSwitch
      inputFeatures="dataWarehouseReports"
      actionOnInaccessible="hidden"
    >
      <Route
        exact
        path="/author/reports/whole-child-report/student/:studentId?"
        render={() => (
          <WholeChildReport
            {..._props}
            breadcrumbData={breadcrumbData}
            isCliUser={isCliUser}
            showApply={showApply}
            showFilter={showFilter}
            onRefineResultsCB={onRefineResultsCB}
            loc={loc}
          />
        )}
      />
    </FeaturesSwitch>
  )
}

export default DataWarehouseReportsContainer
