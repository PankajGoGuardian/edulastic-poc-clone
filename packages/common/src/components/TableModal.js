import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import InputNumber from "antd/es/input-number";
import Modal from "antd/es/modal";
import Row from "antd/es/row";
import Col from "antd/es/col";
import Divider from "antd/es/divider";

const Label = styled.label`
  color: #314659;
  font-weight: 500;
  font-size: 14px;
  margin-top: 2px;
`

const TableSizeModal = ({ show, onSave, onClose }) => {
  const rowsInputRef = useRef(null)
  const [rowsVal, setRowsVal] = useState(2)
  const [colsVal, setColsVal] = useState(2)

  useEffect(() => {
    if (show && rowsInputRef.current) {
      rowsInputRef.current.focus()
    }
  }, [show])

  return (
    <Modal
      visible={show}
      title="Set Table Size"
      maskClosable={false}
      onOk={() => onSave(rowsVal, colsVal)}
      onCancel={() => onClose()}
    >
      <Row gutter={16} align="middle">
        <Col md={4}>
          <Label>Rows: </Label>
        </Col>
        <Col md={20}>
          <InputNumber
            ref={rowsInputRef}
            min={1}
            max={30}
            data-cy="table-size-modal-rows"
            value={rowsVal}
            onChange={(val) => setRowsVal(val)}
            autoFocus
          />
        </Col>
      </Row>
      <Divider />
      <Row gutter={16} align="middle">
        <Col md={4}>
          <Label>Cols: </Label>
        </Col>
        <Col md={20}>
          <InputNumber
            min={1}
            data-cy="table-size-modal-cols"
            value={colsVal}
            onChange={(val) => setColsVal(val)}
          />
        </Col>
      </Row>
    </Modal>
  )
}

TableSizeModal.propTypes = {
  show: PropTypes.bool,
  rows: PropTypes.number,
  cols: PropTypes.number,
  onSave: PropTypes.func,
  onClose: PropTypes.func,
}

TableSizeModal.defaultProps = {
  show: false,
  rows: 3,
  cols: 2,
  onSave: () => {},
  onClose: () => {},
}

export default TableSizeModal
