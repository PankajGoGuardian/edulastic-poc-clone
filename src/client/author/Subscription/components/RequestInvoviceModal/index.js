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
import { getUserOrgData } from '../../../src/selectors/user'
import { slice, getInvoiceRequestStatus } from '../../ducks'
import {
  ModalTitle,
  Container,
  Text,
  SubText,
  Label,
  StyledInput,
  StyledSelect,
} from './styled'

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
  1: 100,
  2: 100,
  3: 100,
}

const SAMPLE_PRODUCT_NAMES = {
  1: 'Teacher License Count',
  2: 'Spark Science',
  3: 'Spark Books',
}

const RequestInvoiceModal = ({
  visible = false,
  closeModal = () => {},
  cartProducts = SAMPLE_PRODUCTS || {},
  productNamesById = SAMPLE_PRODUCT_NAMES || {},
  userOrgData = {},
  isRequestInvoiceActionPending = false,
  handleRequestInvoice = () => {},
}) => {
  const [documentType, setDocumentType] = useState('QUOTE')
  const [customDocumentType, setCustomDocumentType] = useState()
  const [bookkeeperEmail, setBookkeeperEmail] = useState()
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
    }))
    return [...districts, ...schools]
  }, userOrgData)

  const onDocumentTypeChange = (e) => setDocumentType(e.target.value)
  const onCustomTypeChange = (e) => setCustomDocumentType(e.target.value)
  const handleBookkeepersChange = (e) => setBookkeeperEmail(e.target.value)
  const handleSchoolOrDistrictChange = (value) => setSchoolOrDistrict(value)

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

    if (bookkeeperEmail) {
      const flag = emailRegex.test(bookkeeperEmail.trim())
      if (!flag) {
        notification({
          type: 'warning',
          msg: 'Invalid email format specified for Bookkeeper.',
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
      const payload = {
        documentType,
        typeDescription: customDocumentType,
        schoolOrDistrict,
        bookkeeperEmail,
        cartProducts,
        otherInfo,
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
        value={bookkeeperEmail}
        onChange={handleBookkeepersChange}
      />

      <Label>Any other information we need to know about your order?</Label>
      <StyledInput
        placeholder="Is there any other information we need to know to fill your request..."
        value={otherInfo}
        onChange={setOtherInfo}
      />
    </CustomModalStyled>
  )
}

export default connect(
  (state) => ({
    userOrgData: getUserOrgData(state),
    isRequestInvoiceActionPending: getInvoiceRequestStatus(state),
  }),
  {
    handleRequestInvoice: slice.actions.requestInvoiceAction,
  }
)(RequestInvoiceModal)
