import { EduButton, FlexContainer, SelectInputStyled } from '@edulastic/common'
import { Form, Spin } from 'antd'
import React, { useEffect } from 'react'

const MANAGE_SUBSCRIPTION_SEARCH_TYPE = [
  {
    type: 'BULK_LICENSES',
    name: 'Multiple Licenses',
  },
  {
    type: 'TRIAL_LICENSES',
    name: 'Trial Premium & Trial SparkMath Licenses',
  },
]

const loaderStyles = { height: '30px' }

const SearchFilters = Form.create({
  name: 'searchLicensesByType',
})(
  ({
    form: { getFieldDecorator, validateFields, resetFields },
    setPage,
    fetchLicensesBySearchType,
    setSearchType,
    usersList,
    setUsersList,
    isFetchingOrganization,
    districtList,
    handleSelectDistrict,
    handleSearch,
    fieldData,
    isFetchingUsers,
    handleUsersSearch,
  }) => {
    useEffect(() => {
      setUsersList([])
      resetFields(['username'])
    }, [fieldData])

    const handleSubmit = (evt) => {
      evt.preventDefault()
      validateFields(
        (err, { searchType, username, organisation: districtId }) => {
          if (!err) {
            setSearchType(searchType)
            setPage(1)
            fetchLicensesBySearchType({
              type: searchType,
              page: 1,
              limit: 10,
              ...(username && { userId: username }),
              ...(districtId && { districtId }),
            })
          }
        }
      )
    }

    const handleSelectLicense = (searchType) => {
      setSearchType(searchType)
      resetFields(['organisation'])
      resetFields(['username'])
    }

    return (
      <Form onSubmit={handleSubmit}>
        <FlexContainer justifyContent="space-between" alignItems="center">
          <Form.Item data-cy="searchByLicenseTypeDropDown">
            {getFieldDecorator('searchType', {
              rules: [{ required: true }],
              initialValue: MANAGE_SUBSCRIPTION_SEARCH_TYPE[0].type,
            })(
              <SelectInputStyled
                height="36px"
                width="250px"
                margin="0px 5px 0px 0px"
                data-cy="selectSubscriptionType"
                placeholder="Select a filter to search"
                onChange={handleSelectLicense}
              >
                {MANAGE_SUBSCRIPTION_SEARCH_TYPE.map(({ type, name }) => (
                  <SelectInputStyled.Option key={type}>
                    {name}
                  </SelectInputStyled.Option>
                ))}
              </SelectInputStyled>
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('organisation', {
              initialValue: undefined,
            })(
              <SelectInputStyled
                data-cy="searchForOrganisation"
                height="36px"
                width="250px"
                margin="0px 5px 0px 0px"
                placeholder="Search for an organization"
                filterOption={false}
                showSearch
                notFoundContent={
                  isFetchingOrganization ? <Spin size="small" /> : null
                }
                value={fieldData.districtId}
                onSearch={(d) => handleSearch(d, 'DISTRICT', 50)}
                onFocus={() =>
                  !fieldData.districtName && handleSearch('', 'DISTRICT', 50)
                }
                onChange={handleSelectDistrict}
                allowClear
              >
                {(isFetchingOrganization ? [] : districtList)
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
                  ))}
              </SelectInputStyled>
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('username', {
              initialValue: undefined,
            })(
              <SelectInputStyled
                data-cy="searchByUsername"
                placeholder="Search by username"
                notFoundContent={null}
                filterOption={false}
                onSearch={handleUsersSearch}
                showSearch
                getPopupContainer={(e) => e.parentNode}
                height="36px"
                width="250px"
                disabled={!fieldData?.districtId}
                allowClear
              >
                {isFetchingUsers ? (
                  <SelectInputStyled.Option key="loader" style={loaderStyles}>
                    <Spin />
                  </SelectInputStyled.Option>
                ) : (
                  usersList.length > 0 &&
                  usersList.map((x) => (
                    <SelectInputStyled.Option key={x.userId} value={x.userId}>
                      {x.username}
                    </SelectInputStyled.Option>
                  ))
                )}
              </SelectInputStyled>
            )}
          </Form.Item>
          <Form.Item>
            <EduButton data-cy="searchButton" isBlue htmlType="submit">
              Search
            </EduButton>
          </Form.Item>
        </FlexContainer>
      </Form>
    )
  }
)

export default SearchFilters
