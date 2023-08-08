import React, { useState, useEffect } from 'react'
import { EduIf, RadioBtn } from '@edulastic/common'
import {
  testContentVisibilityTypes,
  combinedVisibilityOptions,
  rubricOnlyVisibilityOptions,
  testContentVisibility as contentVisibilityOptions,
} from '@edulastic/constants/const/test'
import { IconInfo } from '@edulastic/icons'
import { lightGrey9 } from '@edulastic/colors'
import { Tooltip } from 'antd'
import { Block, StyledRadioGroup, Description } from '../Container/styled'

const ContentVisibilityOptions = ({
  isDisabled = false,
  testContentVisibility,
  updateTestContentVisibility,
  isBulkUpdate = false,
}) => {
  const [combinedVisibilityKey, setCombinedVisibilityKey] = useState(null)
  const [contentVisibility, setContentVisibility] = useState(
    testContentVisibility || contentVisibilityOptions.ALWAYS
  )

  useEffect(() => {
    if (
      testContentVisibility &&
      Object.keys(combinedVisibilityOptions).some((i) =>
        combinedVisibilityOptions[i].some(
          (a) => a.key === testContentVisibility
        )
      )
    ) {
      setCombinedVisibilityKey(testContentVisibility)
      setContentVisibility(
        Object.keys(combinedVisibilityOptions).find((i) =>
          combinedVisibilityOptions[i].some(
            (a) => a.key === testContentVisibility
          )
        )
      )
    } else {
      setCombinedVisibilityKey(null)
      setContentVisibility(
        isBulkUpdate
          ? testContentVisibility
          : testContentVisibility || contentVisibilityOptions.ALWAYS
      )
    }
  }, [testContentVisibility])

  const handleContentVisibility = (e) => {
    const value = e.target.value
    if (
      value !== null &&
      Object.keys(combinedVisibilityOptions).some((i) =>
        combinedVisibilityOptions[i].some((a) => a.key === value)
      )
    ) {
      setCombinedVisibilityKey(value)
      setContentVisibility(
        Object.keys(combinedVisibilityOptions).find((i) =>
          combinedVisibilityOptions[i].some((a) => a.key === value)
        )
      )
    } else {
      setCombinedVisibilityKey(null)
      setContentVisibility((prev) => (value !== null ? value : prev))
    }
    updateTestContentVisibility(value === null ? contentVisibility : value)
  }

  return (
    <StyledRadioGroup
      disabled={isDisabled}
      onChange={handleContentVisibility}
      value={contentVisibility}
    >
      {testContentVisibilityTypes.map((item) => (
        <>
          <RadioBtn
            data-cy={`item-visibility-${item.key}`}
            value={item.key}
            key={item.key}
          >
            {item.value}
          </RadioBtn>
          {item.key === contentVisibility &&
            Object.keys(combinedVisibilityOptions).includes(
              contentVisibility
            ) && (
              <Block noBg>
                <Description marginTop="0px">
                  Grading and item visibility permissions on manually gradable
                  items
                </Description>
                <br />
                <StyledRadioGroup
                  isHorizontal
                  isWrap
                  disabled={isDisabled}
                  onChange={handleContentVisibility}
                  value={combinedVisibilityKey}
                >
                  {combinedVisibilityOptions[contentVisibility].map((ele) => (
                    <RadioBtn
                      data-cy={`item-visibility-${ele.key}`}
                      value={ele.key}
                      key={ele.key}
                    >
                      {ele.value}
                      <EduIf
                        condition={rubricOnlyVisibilityOptions.includes(
                          ele.key
                        )}
                      >
                        <Tooltip title="Item types with input fields within stimulus text is not supported with this setting.">
                          <IconInfo
                            color={lightGrey9}
                            style={{
                              marginLeft: '10px',
                              position: 'relative',
                              top: '3px',
                            }}
                          />
                        </Tooltip>
                      </EduIf>
                    </RadioBtn>
                  ))}
                </StyledRadioGroup>
              </Block>
            )}
        </>
      ))}
    </StyledRadioGroup>
  )
}

export default ContentVisibilityOptions
