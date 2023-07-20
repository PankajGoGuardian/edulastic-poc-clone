import React, { useState, useEffect } from 'react'
import { RadioBtn } from '@edulastic/common'
import {
  testContentVisibilityTypes,
  combinedVisibilityOptions,
  testContentVisibility as contentVisibilityOptions,
} from '@edulastic/constants/const/test'
import { Block, StyledRadioGroup, Description } from '../Container/styled'

const ContentVisibilityOptions = ({
  isDisabled = false,
  testContentVisibility,
  updateTestContentVisibility,
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
        testContentVisibility || contentVisibilityOptions.ALWAYS
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
