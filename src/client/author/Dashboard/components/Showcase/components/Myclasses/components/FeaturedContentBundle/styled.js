import styled from 'styled-components'
import { title, white } from '@edulastic/colors'

export const FeatureContentWrapper = styled.div`
  margin-top: 20px;
`

export const EmptyBox = styled.div`
  width: 240px;
  height: 169px;
  margin: 0px 2px 10px 0px;
`

export const BundleContainer = styled.div`
  width: 240px;
  height: 169px;
  display: flex;
  align-items: flex-end;
  margin: 0px 2px 10px 0px;
  border-radius: 10px;
  padding: 12px 20px;
  color: ${white};
  cursor: pointer;
  background-image: ${(props) => `url(${props.bgImage})`};
  background-size: 100% 100%;
  background-position: top left;
  background-repeat: no-repeat;
`

export const Bottom = styled.div`
  font-size: 13px;
  height: 40px;
  overflow: hidden;
  font-weight: 600;
`
export const Title = styled.div`
  display: flex;
  justify-content: space-between;
  .expire-on {
    font-size: 14px;
    font-weight: 500;
    padding-right: 10px;
  }
`
export const StyledTag = styled.span`
  color: ${title};
  font-size: 11px;
  background: #e3e3e3;
  padding: 7px 22px;
  font-weight: 600;
  border-radius: 20px;
  margin-bottom: 5px;
  margin-right: 5px;
  text-transform: uppercase;
  cursor: pointer;
  &:hover,
  &.active {
    background: #3f85e5;
    color: ${white};
  }
`
export const ContentWrapper = styled.div`
  padding: 5px 0px 20px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  max-height: 250px;
  overflow: auto;
  flex-wrap: wrap;
`
export const CurriculumCard = styled.div`
  width: 160px;
  height: 200px;
  margin-right: 7px;
  margin-bottom: 7px;
  padding: 10px;
  border: 1px solid #dddddd;
  border-radius: 4px 4px 0px 0px;
`
