import React from 'react'
import { Form, Input, Icon, Radio, AutoComplete, Spin } from 'antd'
import styled from 'styled-components'
import { radioButtondata } from '../../Data'
import { Button } from '../StyledComponents'

const { Group: RadioGroup } = Radio

const CircularInput = styled(Input)`
  margin-right: 10px;
  border-radius: 20px;
`

export default function SearchDistrictByIdName({
  getFieldDecorator,
  handleSubmit,
  autocomplete,
  dataSource,
  onSelect,
  listOfRadioOptions,
  valueKey,
  labelKey,
  placeholder,
  loading,
  initialSearchValue,
}) {
  return (
    <Form onSubmit={handleSubmit} layout="inline">
      <Form.Item>
        {getFieldDecorator('districtSearchValue', {
          initialValue: initialSearchValue,
        })(
          autocomplete ? (
            <AutoComplete
              onSelect={onSelect}
              dataSource={dataSource}
              style={{ width: 350 }}
              data-cy="district-search-input"
            />
          ) : (
            <CircularInput placeholder={placeholder} style={{ width: 300 }} />
          )
        )}
        <Button
          data-cy="manage-by-district-input-search-btn"
          icon="search"
          type="submit"
          style={{
            position: 'absolute',
            top: '0',
            right: '10px',
            zIndex: 20,
          }}
          aria-label="Search"
          noStyle
        >
          {loading ? (
            <Spin size="small" style={{ marginTop: '10px' }} />
          ) : (
            <Icon type="search" />
          )}
        </Button>
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('districtSearchOption', {
          initialValue: listOfRadioOptions[0][valueKey],
        })(
          <RadioGroup name="searchOptions">
            {listOfRadioOptions.map((item) => (
              <Radio
                key={item[valueKey]}
                id={item[valueKey]}
                value={item[valueKey]}
                data-cy={`${item.label}-radio`}
              >
                {item[labelKey]}
              </Radio>
            ))}
          </RadioGroup>
        )}
      </Form.Item>
    </Form>
  )
}

SearchDistrictByIdName.defaultProps = {
  listOfRadioOptions: radioButtondata.list,
  valueKey: 'id',
  labelKey: 'label',
  placeholder: 'Search...',
  loading: false,
  initialSearchValue: '',
}
