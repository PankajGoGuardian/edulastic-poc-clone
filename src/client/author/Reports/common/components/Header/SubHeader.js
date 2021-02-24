import React from 'react'
import styled from 'styled-components'

import Breadcrumb from '../../../../src/components/Breadcrumb'

import StandardsMasteryRowFilters from '../../../subPages/standardsMasteryReport/common/components/RowFilters'

const SubHeader = ({
  breadcrumbsData,
  onRefineResultsCB,
  title,
  showFilter,
  isSharedReport,
}) => {
  const isShowBreadcrumb = title !== 'Standard Reports'
  const showStandardFilters =
    title === 'Standards Performance Summary' ||
    title === 'Standards Gradebook' ||
    title === 'Standards Progress'

  return (
    <SecondaryHeader
      style={{
        marginBottom: isShowBreadcrumb ? 20 : 0,
        paddingLeft: '5px',
      }}
    >
      <HeaderTitle>
        {isShowBreadcrumb ? (
          <Breadcrumb data={breadcrumbsData} style={{ position: 'unset' }} />
        ) : null}
      </HeaderTitle>
      {!isSharedReport && onRefineResultsCB && showStandardFilters ? (
        <StandardsMasteryRowFilters pageTitle={title} showFilter={showFilter} />
      ) : null}
    </SecondaryHeader>
  )
}

export default SubHeader

const HeaderTitle = styled.div`
  h1 {
    font-size: 25px;
    font-weight: bold;
    color: white;
    margin: 0px;
    display: flex;
    align-items: center;
    svg {
      width: 30px;
      height: 30px;
      fill: white;
      margin-right: 10px;
    }
  }
`

const SecondaryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media print {
    display: none;
  }
`
