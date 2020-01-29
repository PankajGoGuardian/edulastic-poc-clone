import React, { useState, useEffect } from "react";
import { get } from "lodash";
import moment from "moment";
import { Input, DatePicker, Select, Checkbox, Radio, Button, Table } from "antd";

import { doValidate } from "./apis";

const Field = ({ displayName, type, validate, onChange, ...rest }) => {
  const [response, setResponse] = useState();
  const [value, setValue] = useState();
  useEffect(() => {
    document.addEventListener("click", onDropdownVisibleChange);
  }, []);

  const onDropdownVisibleChange = () => {
    const elm = document.querySelector(`.dropdown-custom-menu`);
    if (elm && !elm.style.zIndex) {
      elm.style.zIndex = 10000;
    }

    return () => {
      document.removeEventListener("click", onDropdownVisibleChange);
    };
  };
  const handleValidation = () => {
    doValidate(
      {
        [validate.validateField]: value.split(",").map(v => v.trim())
      },
      validate.endPoint
    ).then(data => {
      const res = get(data, validate.response.lodashDepth);
      if (res) {
        setResponse(res);
        onChange(res.map(r => r._id), rest.name);
      }
    });
  };

  const renderIfNeedsToValidate = () => {
    if (validate) {
      return (
        <Button onClick={handleValidation} type="primary">
          Validate
        </Button>
      );
    }
  };

  const onChangeCheckbox = e => onChange(e.target.checked, rest.name);
  const handleOnChange = e => {
    let value;
    if (typeof e === "object") {
      value = e.target.value;
    } else {
      value = e;
    }
    onChange(value, rest.name);
    setValue(value);
  };

  const onChangeDate = date => onChange(date.toDate().getTime(), rest.name);

  const renderElement = () => {
    switch (type) {
      case "string":
        return <Input {...rest} onChange={handleOnChange} />;
      case "textarea":
        return <Input.TextArea {...rest} onChange={handleOnChange} />;
      case "date":
        return <DatePicker onChange={onChangeDate} showToday />;
      case "dropdown":
        return (
          <Select {...rest} onChange={handleOnChange} dropdownClassName="dropdown-custom-menu">
            {(rest.values || []).map((v, i) => (
              <Select.Option key={i} value={v}>
                {v}
              </Select.Option>
            ))}
          </Select>
        );
      case "checkbox":
        return <Checkbox onChange={onChangeCheckbox}>{displayName}</Checkbox>;
      case "radiogroup":
        return (
          <Radio.Group {...rest} onChange={handleOnChange}>
            {(rest.values || []).map((v, i) => (
              <Radio key={i} value={v}>
                {v}
              </Radio>
            ))}
          </Radio.Group>
        );
      default:
        return null;
    }
  };

  const renderResponse = () => {
    if (response) {
      const display = validate?.response?.display || {};
      switch (display?.type) {
        case "table":
          const columns = display.fields.map(field => {
            return {
              title: field.name,
              dataIndex: field.field
            };
          });
          return (
            <div>
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>{display.title}</span>
              <Table dataSource={response} columns={columns} pagination={false} />
            </div>
          );
        case "json":
          return <div>{JSON.stringify(response)}</div>;
      }
    }
  };

  return (
    <div
      style={{
        marginBottom: "15px"
      }}
    >
      <div
        style={{
          fontSize: "15px",
          fontWeight: 600,
          marginBottom: "5px"
        }}
      >
        {displayName}
      </div>
      {renderElement()}
      {renderIfNeedsToValidate()}
      {renderResponse()}
    </div>
  );
};

export default Field;
