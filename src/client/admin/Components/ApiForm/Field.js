import { CheckboxLabel } from "@edulastic/common";
import { Button, DatePicker, Input, Radio, Select, Table } from "antd";
import { get } from "lodash";
import React, { useEffect, useState } from "react";
import { doValidate } from "./apis";

const Field = ({ displayName, type, validate, onChange, message, note = {}, ...rest }) => {
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
    setResponse([]);
    onChange({});
    doValidate(
      {
        [validate.validateField]: validate.paramsType === "string" ? value : value.split(",").map(v => v.trim())
      },
      validate.endPoint,
      validate.method
    ).then(data => {
      const res = get(data, validate.response.lodashDepth);
      if (res) {
        setResponse(validate.multiple ? res : [res]);
        onChange(validate.multiple ? res.map(r => r._id) : res.districtId, rest.name);
      } else {
        onChange(validate.multiple ? [] : "", rest.name);
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
        return <CheckboxLabel onChange={onChangeCheckbox}>{displayName}</CheckboxLabel>;
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
      case "p":
        return <p>{message}</p>;
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
          return (
            <div>
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>{display.title}</span>
              <div>{JSON.stringify(response?.[0] || "Please enter valid input")}</div>
            </div>
          );
      }
    }
  };

  const { text, parentField, position, align } = note;

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
      {rest.name === parentField && position === "top" && <span className="note" style={{float: align}}>{text}</span>}
      {renderElement()}
      {rest.name === parentField && position === "bottom" && <span className="note" style={{float: align}}>{text}</span>}
      {renderIfNeedsToValidate()}
      {renderResponse()}
    </div>
  );
};

export default Field;
