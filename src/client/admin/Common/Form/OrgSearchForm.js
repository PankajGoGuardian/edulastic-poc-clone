import React from 'react'
import { AutoComplete, Form } from 'antd'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { adminApi } from '@edulastic/api'
import SearchDistrictByIdName from './SearchDistrictByIdName'
import {
  getDistrictDataAction,
  getDistrictList,
  getIsDistrictLoading,
  getSelectedDistrict,
  setSelectedDistrict,
} from '../../Components/CustomReportContainer/ducks'

const { Option: AutocompleteOption } = AutoComplete

const OrgSearch = Form.create({ name: 'orgSearch' })(
  ({
    form: { getFieldDecorator, validateFields, getFieldsValue },
    loadingDistrict,
    getDistrictData,
    selectDistrict,
    districtList = [],
    setOrg,
  }) => {
    const handleDistrictGroupSearch = async (value) => {
      try {
        if (!value) return
        const result = await adminApi.searchDistrictGroups({ id: value })
        setOrg({
          districtGroupId: result?.result?._id,
        })
      } catch (err) {
        console.error(err)
      }
    }
    const loading = loadingDistrict
    const searchOrg = (evt) => {
      evt.preventDefault()
      validateFields(
        (
          err,
          {
            districtSearchOption: orgSearchOption,
            districtSearchValue: orgSearchValue,
          }
        ) => {
          if (err) return
          if (orgSearchOption === 'districtGroupId') {
            return handleDistrictGroupSearch(orgSearchValue)
          }
          getDistrictData({
            [orgSearchOption]: orgSearchValue,
          })
        }
      )
    }
    const onOrgSelect = (value, option) => {
      const formValue = getFieldsValue()
      if (formValue.districtSearchOption === 'districtGroupId') {
        return handleDistrictGroupSearch(formValue.districtSearchValue)
      }

      // name search is only supported for Districts. Hence, options are for Districts only.
      selectDistrict(option.props.index)
      setOrg({ districtId: districtList[option.props.index] })
    }
    const dataSource = districtList.map(({ _source = {} }, index) => (
      <AutocompleteOption key={_source.name} index={index}>
        {_source.name}
      </AutocompleteOption>
    ))
    return (
      // The component is named SearchDistrictByIdName, but has no "District" specific logic.
      <SearchDistrictByIdName
        getFieldDecorator={getFieldDecorator}
        handleSubmit={searchOrg}
        autocomplete
        onSelect={onOrgSelect}
        dataSource={dataSource}
        loading={loading}
        filterOption={false}
        listOfRadioOptions={[
          {
            id: 'name',
            label: 'District Name',
            message: 'Please enter valid district name',
          },
          {
            id: 'id',
            label: 'District Id',
            message: 'Please enter valid District ID',
          },
          {
            id: 'districtGroupId',
            label: 'District Group Id',
            message: 'Please enter valid District Group ID',
          },
        ]}
      />
    )
  }
)

const OrgSearchForm = compose(
  connect(
    (state) => ({
      districtList: getDistrictList(state),
      loadingDistrict: getIsDistrictLoading(state),
      selectedDistrictData: getSelectedDistrict(state),
    }),
    {
      getDistrictData: getDistrictDataAction,
      selectDistrict: setSelectedDistrict,
    }
  )
)(OrgSearch)

export default OrgSearchForm
