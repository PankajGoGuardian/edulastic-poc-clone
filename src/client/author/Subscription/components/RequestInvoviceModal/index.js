import React, { useMemo, useState } from 'react'
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
  getInvoiceRequestStatus,
  getSubscriptionSelector,
} from '../../ducks'
import {
  ModalTitle,
  Container,
  Text,
  SubText,
  Label,
  StyledInput,
  StyledSelect,
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

// TODO: Remove post integration
const SAMPLE_PRODUCTS = {
  '5f0835a1984cfa6bcef1e14d': 10,
  '60098dbef33e901c6f1021c6': 30,
  '606eb0f759e92006545eac36': 100,
}

const SAMPLE_PRODUCT_NAMES = {
  '5f0835a1984cfa6bcef1e14d': 'Teacher License Count',
  '60098dbef33e901c6f1021c6': 'Spark Science',
  '606eb0f759e92006545eac36': 'Spark Books',
}

const RequestInvoiceModal = ({
  visible = false,
  closeModal = () => {},
  cartProducts = SAMPLE_PRODUCTS || {},
  productNamesById = SAMPLE_PRODUCT_NAMES || {},
  userOrgData = {},
  isRequestInvoiceActionPending = false,
  handleRequestInvoice = () => {},
  userSubscription,
  userFullname,
  userDetails,
}) => {
  const [documentType, setDocumentType] = useState('QUOTE')
  const [customDocumentType, setCustomDocumentType] = useState()
  const [bookkeeperEmails, setBookkeeperEmails] = useState()
  const [selectedSchoolOrDistrict, setSchoolOrDistrict] = useState()
  const [otherInfo, setOtherInfo] = useState()

  const schoolsAndDistricts = useMemo(() => {
    const districts = (userOrgData.districts || []).map((x) => ({
      id: x.districtId,
      name: x.districtName,
      type: 'DISTRICT',
    }))

    const schools = (userOrgData.schools || []).map((x) => ({
      id: x._id,
      name: x.name,
      type: 'SCHOOL',
      districtId: x.districtId,
    }))
    return [...districts, ...schools]
  }, userOrgData)

  const onDocumentTypeChange = (e) => setDocumentType(e.target.value)
  const onCustomTypeChange = (e) => setCustomDocumentType(e.target.value)
  const handleBookkeepersChange = (e) => setBookkeeperEmails(e.target.value)
  const handleSchoolOrDistrictChange = (value) => setSchoolOrDistrict(value)
  const handleSetOtherInfo = (e) => setOtherInfo(e.target.value)

  const filterOption = (input, option) =>
    option?.props?.children?.toLowerCase()?.indexOf(input.toLowerCase()) >= 0

  const validateFields = () => {
    if (documentType === 'OTHER' && !customDocumentType) {
      notification({
        type: 'warning',
        msg: 'Please specify the type of documentation.',
      })
      return false
    }

    if (!selectedSchoolOrDistrict) {
      notification({
        type: 'warning',
        msg: 'Please select your school or district.',
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
      const schoolOrDistrict = schoolsAndDistricts.find(
        (x) => x.id === selectedSchoolOrDistrict
      )
      const emails = bookkeeperEmails
        ? bookkeeperEmails
            .split(',')
            .map((email) => email.trim())
            .filter((x) => x)
        : []
      const payload = {
        userFullname,
        userEmail: userDetails.email,
        documentType,
        typeDescription: customDocumentType,
        schoolOrDistrict,
        bookkeeperEmails: emails.length ? emails : undefined,
        cartProducts,
        otherInfo,
        licenseType:
          userSubscription.subType === 'enterprise'
            ? 'Enterprise'
            : 'Teacher Premium',
      }
      handleRequestInvoice(payload)
    }
  }

  return (
    <CustomModalStyled
      width="580px"
      visible={visible}
      title={<ModalTitle>Request Invoice</ModalTitle>}
      onCancel={closeModal}
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
        {Object.entries(cartProducts).map(([id, price]) => (
          <FlexContainer
            key={id}
            justifyContent="space-between"
            alignItems="center"
          >
            <SubText key="productName">{productNamesById[id]}</SubText>
            <SubText key="productPrice">${price}</SubText>
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

      <Label required>School or Disctict</Label>
      <StyledSelect
        placeholder="Select your school or district"
        getPopupContainer={(node) => node.parentNode}
        value={selectedSchoolOrDistrict}
        onChange={handleSchoolOrDistrictChange}
        optionFilterProp="children"
        filterOption={filterOption}
      >
        {schoolsAndDistricts.map(({ id, name }) => (
          <StyledSelect.Option value={id}>{name}</StyledSelect.Option>
        ))}
      </StyledSelect>

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
    isRequestInvoiceActionPending: getInvoiceRequestStatus(state),
    userSubscription: getSubscriptionSelector(state),
    userFullname: getUserFullNameSelector(state),
    userDetails: getUserDetails(state),
  }),
  {
    handleRequestInvoice: slice.actions.requestInvoiceAction,
  }
)(RequestInvoiceModal)
