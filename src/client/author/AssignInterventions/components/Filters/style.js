import styled from 'styled-components'
import { black, greyThemeDark4, themeColor } from '@edulastic/colors'
import { Slider } from 'antd'

// a min of 8px of separation in the text that is displated for mastery slider
export const SLIDER_READING_MIN_SEPARATION = 8

export const FiltersContainer = styled.div`
  width: 100%;
`

export const ClassNameContainer = styled.div`
  font-size: 18px;
  line-height: 28px;
  font-weight: 400;
  color: ${greyThemeDark4};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
`

export const TestNameContainer = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: ${greyThemeDark4};
  padding-top: 14px;
  width: 100%;
  display: flex;
  flex-direction: row;
  @media (min-width: 1400px) {
    padding-top: 20px;
  }
`

export const TestNameTextContainer = styled.div`
  max-width: calc(100% - 50px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const StudentInfoContainer = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: #555555;
  padding-top: 8px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  max-width: 330px;

  @media (min-width: 1400px) {
    padding-top: 11px;
  }
`

export const StudentInfoElement = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: capitalize;
`

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin-bottom: 36px;
`

export const HeaderInformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  margin-left: 16px;
  width: calc(100% - 200px);
`

export const FilterContentContainer = styled.div`
  width: 368px;
  margin-top: 36px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  gap: 20px;
`

export const FilterHeadingContainer = styled.div`
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  color: ${black};
`

export const StyledImage = styled.img`
  width: ${({ width }) => (width ? `${width}px` : 'auto')};
  height: ${({ height }) => (height ? `${height}px` : 'auto')};
  border-radius: 4px;

  @media (min-width: 1400px) {
    width: 200px;
    height: 114px;
  }
`

export const FilterSubHeadingContainer = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: ${black};
  margin-bottom: 6px;
  display: flex;
  flex-direction: horizontal;
  align-items: center;
  gap: 3px;
`

export const StyledSlider = styled(Slider)`
  width: 87%;
  height: 6px;
  margin: 16px 10px 0px 10px;
  > div {
    height: 10px;
  }
  .ant-slider-rail {
    height: 6px;
  }
  .ant-slider-handle {
    height: 20px;
    width: 20px;
    margin-top: -7px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    box-shadow: 0px 6px 13px rgba(0, 0, 0, 0.12);
  }
  .ant-slider-track {
    height: 6px;
    background: ${themeColor};
  }
  .ant-slider-dot {
    display: none;
  }
  &:hover {
    & .ant-slider-track {
      background: ${themeColor};
    }
  }
`

export const StandardNameContainer = styled.div`
  width: 64px;
  background: #e7e9eb;
  color: ${greyThemeDark4};
  border-radius: 2px;
  font-weight: 600;
  font-size: 12px;
  line-height: 24px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const StandardDescContainer = styled.div`
  padding-left: 8px;
  font-weight: 600;
  font-size: 12px;
  line-height: 24px;
  width: 170px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

export const StandardStudentCountContainer = styled.div`
  font-weight: 600;
  font-size: 11px;
  line-height: 24px;
  width: 80px;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const SelectAllContainer = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  color: #555555;
`

export const SelectAllTextContainer = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  color: ${themeColor};
`
export const SliderMarkContainer = styled.div`
  font-weight: 600;
  font-size: 11px;
  line-height: 18px;
  color: #777777;
  margin-top: 2px;
  padding-left: 0.75em;
`

export const MasteryRangeContainer = styled.div`
  margin-top: 20px;
  height: 83px;
`
export const EllipseSeparator = styled.div`
  background-color: #d8d8d8;
  border-radius: 3px;
  width: 6px;
  height: 6px;
`
