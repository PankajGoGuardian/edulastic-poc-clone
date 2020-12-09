import { countryApi } from '@edulastic/api'
import { SelectInputStyled, TextInputStyled } from '@edulastic/common'
import Col from "antd/es/col";
import Form from "antd/es/form";
import Row from "antd/es/row";
import Select from "antd/es/select";
import { debounce, get } from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { RemoteAutocompleteDropDown } from '../../../../common/components/widgets/remoteAutoCompleteDropDown'
import { searchDistrictsRequestAction } from '../../duck'
import { states } from './constants'

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
      stateList: states,
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
      form.setFieldsValue({ state: '' })
    } else {
      this.setState({
        stateList: states,
      })
      form.setFieldsValue({ state: states[0] })
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
      userInfo,
      handleSubmit,
      fromUserProfile,
    } = this.props
    const { getFieldDecorator } = form
    const { keyword, countryList, stateList } = this.state
    const country = form.getFieldValue('country')
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 24 },
      },
    }

    const countryOptions = Object.entries(countryList).map(([key, value]) => (
      <Option value={key} key={key}>
        {value}
      </Option>
    ))

    const stateOptions = stateList.map((state) => (
      <Option value={state} key={state}>
        {state}
      </Option>
    ))

    return (
      <FormWrapper {...formItemLayout} onSubmit={handleSubmit}>
        <Form.Item label="Name">
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
        {fromUserProfile ? (
          <Form.Item label="District">
            {getFieldDecorator('districtId', {
              initialValue: userInfo.orgData.districts?.[0].districtName,
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
                    if (value.title.length === 0 || value.key.length === 0) {
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
                      let signOnMethod = 'userNameAndPassword'
                      signOnMethod = userInfo.msoId
                        ? 'office365SignOn'
                        : signOnMethod
                      signOnMethod = userInfo.cleverId
                        ? 'cleverSignOn'
                        : signOnMethod
                      signOnMethod = userInfo.googleId
                        ? 'googleSignOn'
                        : signOnMethod
                      const checkDistrictPolicyPayload = {
                        districtId: value.key,
                        email: userInfo.email,
                        type: userInfo.role,
                        signOnMethod,
                      }
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
        <Row gutter={24}>
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
        <Row gutter={24}>
          <Col xs={24} sm={12}>
            <Form.Item label="State" style={{ width: '100%' }}>
              {getFieldDecorator('state', {
                rules: [
                  { required: false, message: 'Please provide a valid state.' },
                ],
                initialValue: states[0],
              })(
                country === 'US' || country === 'United States' ? (
                  <>
                    {console.log('countrySelect: ', country)}
                    <SelectInputStyled
                      data-cy="state"
                      showSearch
                      placeholder="Select your state"
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    >
                      {stateOptions}
                    </SelectInputStyled>
                  </>
                ) : (
                  <>
                    {console.log('country: ', country)}
                    <TextInputStyled
                      data-cy="state"
                      placeholder="Enter your state"
                    />
                  </>
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
                initialValue: 'United States',
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
  }),
  {
    searchDistrict: searchDistrictsRequestAction,
  }
)(RequestSchoolForm)

const FormWrapper = styled(Form)`
  .ant-row .ant-form-item-label {
    line-height: normal;
    text-align: left;
    padding: 0px;
    label {
      font-size: 11px;
      text-transform: uppercase;
      &:after {
        display: none;
      }
    }
  }
  .ant-form-item-control {
    .ant-form-explain {
      font-size: 11px;
    }
  }
  .ant-row.ant-form-item {
    margin-bottom: 15px;
  }
`
