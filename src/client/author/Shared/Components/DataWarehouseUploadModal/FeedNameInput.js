import React, { useMemo, useEffect } from 'react'
import { Input, Select, Alert, Tooltip } from 'antd'
import { testTypes } from '@edulastic/constants'
import { withNamespaces } from '@edulastic/localization'
import { EduIf, EduThen, EduElse } from '@edulastic/common'
import { isEmpty, lowerCase } from 'lodash'
import { FEED_NAME_LABEL } from '@edulastic/constants/const/dataWarehouse'
import {
  AdministrationLevelOptions,
  FastBridgeSessionOptions,
  NON_ACADEMIC_DATA_TYPE_KEY,
} from './utils'
import {
  StyledSelect,
  StyledCol,
  StyledRow,
  InfoIcon,
} from './styledComponents'

const { Option } = Select

const FeedNameInput = ({
  isInvalidFeedName,
  category,
  feedName,
  dataFomatDropdownOptions,
  setFeedName,
  selectedSchoolYear,
  t,
}) => {
  const feedNameInfoText = useMemo(() => {
    let isNonAcademicFormatSelected = false
    if (!isEmpty(category)) {
      const nonAcademicDataOptions =
        dataFomatDropdownOptions.find(
          (node) => node.key === NON_ACADEMIC_DATA_TYPE_KEY
        )?.children || []
      if (!isEmpty(nonAcademicDataOptions)) {
        const matchingCategory = nonAcademicDataOptions.find(
          (option) => option.value === category
        )
        isNonAcademicFormatSelected = !isEmpty(matchingCategory)
      }
    }
    // later we might need tooltip text per feed type
    return isNonAcademicFormatSelected
      ? t('dataStudio.attendanceHelperText')
      : t('dataStudio.academicHelperText')
  }, [category, dataFomatDropdownOptions])

  useEffect(() => {
    setFeedName(undefined)
  }, [category])

  const sessionDropdownOptions = useMemo(() => {
    const sessionOptions =
      category === testTypes.FP_BAS
        ? AdministrationLevelOptions
        : testTypes.FASTBRIDGE_TEST_TYPES.includes(category)
        ? FastBridgeSessionOptions
        : []
    return sessionOptions.map(({ key, title }) => ({
      key: `${key} (${selectedSchoolYear})`,
      title: `${title} (${selectedSchoolYear})`,
    }))
  }, [selectedSchoolYear, category])

  return (
    <>
      <EduIf condition={isInvalidFeedName}>
        <Alert
          message={`${FEED_NAME_LABEL} already exists, please give another ${lowerCase(
            FEED_NAME_LABEL
          )} or go to Edit to edit the existing record`}
          type="error"
          banner
        />
      </EduIf>
      <StyledRow>
        <StyledCol span={23}>
          <EduIf
            condition={[
              testTypes.FP_BAS,
              ...testTypes.FASTBRIDGE_TEST_TYPES,
            ].includes(category)}
          >
            <EduThen>
              <StyledSelect
                placeholder={`Enter ${FEED_NAME_LABEL}`}
                onChange={setFeedName}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                value={feedName}
                disabled={isEmpty(selectedSchoolYear)}
                data-cy="feedNameDropDown"
              >
                {sessionDropdownOptions.map(({ key, title }) => (
                  <Option key={key} value={key}>
                    {title}
                  </Option>
                ))}
              </StyledSelect>
            </EduThen>
            <EduElse>
              <Input
                placeholder={`Enter ${FEED_NAME_LABEL}`}
                value={feedName}
                onChange={(e) => setFeedName(e.target.value)}
                maxLength={150}
                data-cy="feedName"
              />
            </EduElse>
          </EduIf>
        </StyledCol>
        <StyledCol>
          <Tooltip
            overlayClassName="dw-upload-tooltip"
            placement="top"
            title={feedNameInfoText}
          >
            <InfoIcon />
          </Tooltip>
        </StyledCol>
      </StyledRow>
    </>
  )
}

export default withNamespaces('dataStudio')(FeedNameInput)
