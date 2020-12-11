import React from 'react'
import Form from "antd/es/Form";
import Input from "antd/es/Input";
import Icon from "antd/es/Icon";
import Radio from "antd/es/Radio";
import AutoComplete from "antd/es/AutoComplete";
import Spin from "antd/es/Spin";
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
            />
          ) : (
            <CircularInput placeholder={placeholder} style={{ width: 300 }} />
          )
        )}
        <Button
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
          {loading ? <Spin size="small" /> : <Icon type="search" />}
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
