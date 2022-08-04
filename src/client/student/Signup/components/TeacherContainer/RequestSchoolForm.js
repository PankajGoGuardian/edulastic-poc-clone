import { countryApi } from '@edulastic/api'
import { SelectInputStyled, TextInputStyled } from '@edulastic/common'
import { Col, Form, Row, Select, Spin } from 'antd'
import { debounce, get, isEmpty, map } from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { darkGrey3 } from '@edulastic/colors'
import { RemoteAutocompleteDropDown } from '../../../../common/components/widgets/remoteAutoCompleteDropDown'
import { searchDistrictsRequestAction } from '../../duck'
import { statesWithCodes } from './constants'
import { getUserOrg, getUserOrgId } from '../../../../author/src/selectors/user'

const { Option } = Select
class RequestSchoolForm extends React.Component {
  state = {
    keyword: '',
    countryList: {},
    stateList: [],
  }

  transformInput = (value) => {
    if (value) {
      return value.trim()
    }
  }

  async componentDidMount() {
    const countryList = await countryApi.getCountries()
    this.setState({
      countryList,
      stateList: statesWithCodes,
    })
  }

  handleTyping = debounce((keyword) => {
    this.onSearch(keyword)
  }, 500)

  changeCountryHandler = (value) => {
    const { form } = this.props
    if (value !== 'US') {
      this.setState({
        stateList: [],
      })
      form.setFieldsValue({ other_state: '' })
    } else {
      this.setState({
        stateList: statesWithCodes,
      })
    }
  }

  onSearch = (searchText) => {
    const { searchDistrict, isSearching } = this.props
    if (!isSearching && searchText.length > 2) {
      searchDistrict({ searchText })
    }
  }

  render() {
    const {
      form,
      isSearching,
      autocompleteDistricts,
      t,
      handleSubmit,
      districtId,
      userOrg = {},
    } = this.props
    const { getFieldDecorator } = form
    const { keyword, countryList, stateList } = this.state
    const country = form.getFieldValue('country') || 'US'
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 24 },
      },
    }

    if (isEmpty(countryList)) {
      return <Spin />
    }

    const countryOptions = Object.entries(countryList).map(([key, value]) => (
      <Option value={key} key={key}>
        {value}
      </Option>
    ))

    const stateOptions = map(stateList, (value, key) => (
      <Option value={key} key={key}>
        {value}
      </Option>
    ))

    return (
      <FormWrapper {...formItemLayout} onSubmit={handleSubmit}>
        <Form.Item label="Name of your school">
          {getFieldDecorator('name', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              { transform: this.transformInput },
              {
                required: true,
                message: 'Please provide a valid school name.',
              },
            ],
          })(
            <TextInputStyled
              data-cy="school"
              placeholder="Enter your school name"
            />
          )}
        </Form.Item>
        <Row gutter={56}>
          <Col xs={24} sm={12}>
            <Form.Item label="Address">
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: false,
                    message: 'Please provide a valid school address.',
                  },
                ],
              })(
                <TextInputStyled
                  data-cy="address"
                  placeholder="Enter your school address"
                />
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            {districtId ? (
              <Form.Item label="District">
                {getFieldDecorator('districtId', {
                  initialValue: userOrg?.districtName,
                })(<TextInputStyled data-cy="district" disabled />)}
              </Form.Item>
            ) : (
              <Form.Item label="District">
                {getFieldDecorator('districtId', {
                  initialValue: { key: '', title: '' },
                  rules: [
                    {
                      required: true,
                      message: 'Please provide a valid district name.',
                    },
                    {
                      validator: async (rule, value, callback) => {
                        if (
                          value.title.length === 0 ||
                          value.key.length === 0
                        ) {
                          callback('Please provide a valid district name.')
                          return
                        }

                        if (value.key === 'Add New') {
                          callback()
                          return
                        }

                        if (value.cleverId) {
                          callback(
                            'The enrollment for this district is handled by district SIS, Please contact admin to create your Edulastic account.'
                          )
                          return
                        }
                        try {
                          callback()
                          return
                        } catch (error) {
                          console.error(error)
                          callback(t('common.policyviolation'))
                        }
                      },
                    },
                  ],
                })(
                  <RemoteAutocompleteDropDown
                    by={keyword}
                    data={autocompleteDistricts}
                    onSearchTextChange={this.handleTyping}
                    iconType="down"
                    createNew
                    createNewLabel="Create New District"
                    existingLabel="Districts"
                    placeholder="Enter your school district name"
                    isLoading={isSearching}
                    isModalOpen
                  />
                )}
              </Form.Item>
            )}
          </Col>
        </Row>
        <Row gutter={56}>
          <Col xs={24} sm={12}>
            <Form.Item label="City">
              {getFieldDecorator('city', {
                rules: [
                  { required: false, message: 'Please provide a valid city.' },
                ],
              })(
                <TextInputStyled
                  data-cy="city"
                  placeholder="Enter your school city"
                />
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Zip" style={{ width: '100%' }}>
              {getFieldDecorator('zip', {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  { transform: this.transformInput },
                  {
                    required: true,
                    message: 'Please provide a valid zip code.',
                  },
                ],
              })(
                <TextInputStyled
                  data-cy="zip"
                  placeholder="Enter your zip code"
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={56}>
          <Col xs={24} sm={12}>
            <Form.Item label="State" style={{ width: '100%' }}>
              {getFieldDecorator(
                country === 'US' ? 'us_state' : 'other_state',
                {
                  rules: [
                    {
                      required: false,
                      message: 'Please provide a valid state.',
                    },
                  ],
                }
              )(
                country === 'US' ? (
                  <SelectInputStyled
                    data-cy="state"
                    showSearch
                    placeholder="Select your state"
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    {stateOptions}
                  </SelectInputStyled>
                ) : (
                  <TextInputStyled
                    data-cy="state"
                    placeholder="Enter your state"
                  />
                )
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Country">
              {getFieldDecorator('country', {
                rules: [
                  {
                    required: true,
                    message: 'Please provide a valid country.',
                  },
                ],
                initialValue: 'US',
              })(
                <SelectInputStyled
                  data-cy="country"
                  showSearch
                  placeholder="Select your country"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={(value) => this.changeCountryHandler(value)}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {countryOptions}
                </SelectInputStyled>
              )}
            </Form.Item>
          </Col>
        </Row>
      </FormWrapper>
    )
  }
}

export default connect(
  (state) => ({
    isSearching: get(state, 'signup.isSearching', false),
    autocompleteDistricts: get(state, 'signup.autocompleteDistricts', []),
    userOrg: getUserOrg(state),
    districtId: getUserOrgId(state),
  }),
  {
    searchDistrict: searchDistrictsRequestAction,
  }
)(RequestSchoolForm)

const FormWrapper = styled(Form)`
  .ant-row .ant-form-item-label {
    text-align: left;
    padding: 0px;
    label {
      font-weight: 600;
      font-size: 14px;
      line-height: 19px;
      text-transform: uppercase;
      color: ${darkGrey3};
      &:after {
        content: '';
      }
    }
  }
  .ant-form-item-required::before {
    content: '';
  }
  .ant-form-item-required::after {
    font-weight: 600;
    font-size: 14px;
    line-height: 19px;
    color: #ff0000;
    margin-left: 4px;
    content: '*' !important;
  }
  .ant-form-item-control {
    .ant-form-explain {
      font-size: 11px;
    }
  }
  .ant-row.ant-form-item {
    margin-bottom: 20px;
  }
  .ant-form-item-children {
    .ant-input {
      height: 50px;
      margin-top: 10px;
    }
    .remote-autocomplete-dropdown {
      line-height: normal;
      .ant-input-affix-wrapper {
        .ant-input {
          height: 50px;
        }
        .ant-input-suffix {
          top: 60%;
        }
      }
    }
    .ant-select-selection .ant-select-selection__rendered {
      height: 50px;
      .ant-select-selection-selected-value {
        margin-top: 7px;
      }
    }
  }
`
