import { Input, Button, Row, Card, Spin } from 'antd'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Container, Heading, Count } from './styled'
import { validateQtiAction } from '../author/ImportTest/ducks'

const QtiValidator = ({ data, validateRequest, showLoader }) => {
  const [url, setUrl] = useState('')
  const [disabled, setDisabled] = useState(true)
  useEffect(() => {
    if (disabled && url.endsWith('.zip')) {
      setDisabled(false)
    } else if (!disabled && !url.endsWith('.zip')) {
      setDisabled(true)
    }
  }, [url])

  const validate = () => {
    validateRequest(url)
  }

  return (
    <Container>
      <Heading title="Qti validator">Edulastic - validate qti upload</Heading>
      <div>
        <Input
          value={url}
          placeholder="Please enter zip file path"
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button onClick={validate} disabled={disabled}>
          Validate
        </Button>
      </div>
      {showLoader && <Spin size="large" />}
      {data?.response?.data?.error}
      {data?.totalItems && (
        <div className="qti-validator-response">
          <Row gutter={16}>
            <Card title="Result" bordered={false}>
              <div>
                <Heading>
                  Total Items:
                  <Count>{data?.totalItems || 0}</Count>
                </Heading>
              </div>
              <div>
                <Heading>
                  Supported:
                  <Count>{data?.supportedItemsCount || 0}</Count>
                </Heading>
              </div>
              <div>
                <Heading>
                  Unsupported:
                  <Count>{data?.unSupportedItemsCount || 0}</Count>
                </Heading>
              </div>
              <div>
                <Heading>
                  Passages:
                  <Count>{data?.passageCount || 0}</Count>
                </Heading>
              </div>
            </Card>
          </Row>
        </div>
      )}
    </Container>
  )
}

export default connect(
  (state) => ({
    data: state?.admin?.importTest?.qtiValidationData,
    showLoader: state?.admin?.importTest?.showValidationLoader,
  }),
  {
    validateRequest: validateQtiAction,
  }
)(QtiValidator)
