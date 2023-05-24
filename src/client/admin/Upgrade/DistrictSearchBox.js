import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { SelectInputStyled } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { Spin } from 'antd'
import { compose } from 'redux'
import { ORGANIZATION_TYPE } from '@edulastic/constants/const/roleType'
import {
  getDistrictListSelector,
  getFetchOrganizationStateSelector,
  searchOrgaizationRequestAction,
} from '../../author/ContentCollections/ducks'

const DistrictSearchBox = ({
  districtList,
  loadingDistrict,
  searchRequest,
  t,
  ...restProps
}) => {
  const onSearch = (searchString) => {
    const data = {
      orgType: ORGANIZATION_TYPE.DISTRICT,
      searchString,
    }
    searchRequest(data)
  }

  const districtListOptions = (loadingDistrict ? [] : districtList)
    .sort((a, b) => {
      const _aName = (a.name || '').toLowerCase()
      const _bName = (b.name || '').toLowerCase()
      return _aName.localeCompare(_bName)
    })
    .map(({ _id, name }) => (
      <SelectInputStyled.Option
        key={_id}
        value={_id}
        name={name}
        data-cy={name}
      >
        {name}
      </SelectInputStyled.Option>
    ))

  return (
    <SelectInputStyled
      style={{ width: 350 }}
      data-cy="district-search-input"
      onSearch={onSearch}
      filterOption={false}
      placeholder={t('manageByUser.userRegistration.placeholderDistrict')}
      labelInValue
      showSearch
      notFoundContent={loadingDistrict ? <Spin size="small" /> : null}
      {...restProps}
    >
      {districtListOptions}
    </SelectInputStyled>
  )
}

DistrictSearchBox.propTypes = {
  t: PropTypes.func.isRequired,
}

export default compose(
  withNamespaces('upgradePlan'),
  connect(
    (state) => ({
      districtList: getDistrictListSelector(state),
      loadingDistrict: getFetchOrganizationStateSelector(state),
    }),
    {
      searchRequest: searchOrgaizationRequestAction,
    }
  )
)(DistrictSearchBox)
