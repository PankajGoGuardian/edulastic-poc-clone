import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Radio } from 'antd'
import {
  CustomModalStyled,
  EduButton,
  FlexContainer,
  notification,
} from '@edulastic/common'
import { emailRegex } from '../../../../common/utils/helpers'
import {
  getUserFullNameSelector,
  getUserOrgData,
} from '../../../src/selectors/user'
import {
  slice,
  getRequestOrSubmitActionStatus,
  getSubscriptionSelector,
} from '../../ducks'
import {
  ModalTitle,
  Container,
  Text,
  SubText,
  Label,
  StyledInput,
  StyledInputTextArea,
} from './styled'
import { getUserDetails } from '../../../../student/Login/ducks'

const getFooterComponent = ({
  handleSubmit,
  isRequestInvoiceActionPending,
}) => (
  <EduButton
    loading={isRequestInvoiceActionPending}
    fontSize="14px"
    width="200px"
    height="48px"
    onClick={handleSubmit}
    inverse
  >
    SUBMIT
  </EduButton>
)

const RequestInvoiceModal = ({
  visible = false,
  onCancel = () => {},
  cartProducts = {},
  productNamesAndPriceById = {},
  isRequestInvoiceActionPending = false,
  handleRequestInvoice = () => {},
  userSubscription,
  userFullname,
  userDetails,
}) => {
  const [documentType, setDocumentType] = useState('INVOICE')
  const [customDocumentType, setCustomDocumentType] = useState()
  const [bookkeeperEmails, setBookkeeperEmails] = useState()
  const [otherInfo, setOtherInfo] = useState()

  const onDocumentTypeChange = (e) => setDocumentType(e.target.value)
  const onCustomTypeChange = (e) => setCustomDocumentType(e.target.value)
  const handleBookkeepersChange = (e) => setBookkeeperEmails(e.target.value)
  const handleSetOtherInfo = (e) => setOtherInfo(e.target.value)

  const validateFields = () => {
    if (documentType === 'OTHER' && !customDocumentType) {
      notification({
        type: 'warning',
        msg: 'Please specify the type of documentation.',
      })
      return false
    }

    if (bookkeeperEmails) {
      const flag = bookkeeperEmails
        .split(',')
        .every((email) => emailRegex.test(email.trim()))
      if (!flag) {
        notification({
          type: 'warning',
          msg: 'Invalid email format specified for Bookkeeper(s).',
        })
        return false
      }
    }
    return true
  }

  const handleSubmit = () => {
    if (validateFields()) {
      const emails = bookkeeperEmails
        ? bookkeeperEmails
            .split(',')
            .map((email) => email.trim())
            .filter((x) => x)
        : []
      const reqPayload = {
        userFullname,
        userEmail: userDetails.email,
        documentType,
        typeDescription: customDocumentType,
        bookkeeperEmails: emails.length ? emails : undefined,
        cartProducts,
        otherInfo,
        licenseType:
          userSubscription.subType === 'enterprise'
            ? 'Enterprise'
            : 'Teacher Premium',
      }
      handleRequestInvoice({
        reqPayload,
        closeCallback: onCancel,
      })
    }
  }

  return (
    <CustomModalStyled
      width="580px"
      visible={visible}
      title={<ModalTitle>Request Invoice</ModalTitle>}
      onCancel={onCancel}
      footer={[
        getFooterComponent({
          handleSubmit,
          isRequestInvoiceActionPending,
        }),
      ]}
      centered
    >
      <Container width="500">
        <Text>Shopping Cart</Text>
        {Object.entries(cartProducts).map(([id, quantity]) => (
          <FlexContainer
            key={id}
            justifyContent="space-between"
            alignItems="center"
          >
            <SubText key="productName">
              {productNamesAndPriceById[id].name}
            </SubText>
            <SubText key="productPrice">
              ${quantity * productNamesAndPriceById[id].price}
            </SubText>
          </FlexContainer>
        ))}
        <hr />
        <Label required>Type of Documentation you need</Label>
        <Radio.Group onChange={onDocumentTypeChange} value={documentType}>
          <Radio value="QUOTE">QUOTE</Radio>
          <Radio value="INVOICE">INVOICE</Radio>
          <Radio value="OTHER">OTHER (PLEASE SPECIFY)</Radio>
        </Radio.Group>

        {documentType === 'OTHER' && (
          <StyledInput
            placeholder="Specify the type of documentation"
            value={customDocumentType}
            onChange={onCustomTypeChange}
          />
        )}
      </Container>

      <Label>Person to email documentation to, such as a bookkeeper</Label>
      <StyledInput
        placeholder="Type email address"
        value={bookkeeperEmails}
        onChange={handleBookkeepersChange}
      />

      <Label>Any other information we need to know about your order?</Label>
      <StyledInputTextArea
        placeholder="Is there any other information we need to know to fill your request..."
        rows={4}
        value={otherInfo}
        onChange={handleSetOtherInfo}
      />
    </CustomModalStyled>
  )
}

export default connect(
  (state) => ({
    userOrgData: getUserOrgData(state),
    isRequestInvoiceActionPending: getRequestOrSubmitActionStatus(state),
    userSubscription: getSubscriptionSelector(state),
    userFullname: getUserFullNameSelector(state),
    userDetails: getUserDetails(state),
  }),
  {
    handleRequestInvoice: slice.actions.requestInvoiceAction,
  }
)(RequestInvoiceModal)
