import styled from 'styled-components'

export const StyledVerticalTextSliderWrapper = styled.div`
  overflow: hidden;
  margin: auto;
`

export const StyledSliderContainer = styled.div`
  height: 300px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const StyledSliderItem = styled.div`
  position: absolute;
  transition: transform 1s ease, opacity 0.4s ease, font-size 0.3s ease;
  font-weight: 700;
  font-size: 20px;
  line-height: 1.3;
  opacity: 0;
  width: 95%;
  height: 60px;
  display: flex;
  align-items: center;
  word-wrap: break-word;
  text-align-last: center;
  justify-content: center;
`
