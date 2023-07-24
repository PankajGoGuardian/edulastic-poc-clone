import styled from 'styled-components'
import { Input } from 'antd'

import { IconCheck } from '@edulastic/icons'
import { secondaryTextColor, greenDark } from '@edulastic/colors'

export const SectionWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 240px;
  margin: 17px 20px 17px 13px;
`

export const SectionTitle = styled.p`
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  padding: 5px;
  width: 205px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  color: ${secondaryTextColor};
`

export const SectionForm = styled(Input)`
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  color: ${secondaryTextColor};
  background: transparent;
  border-radius: unset;
  border: 1px solid red;
  &:focus {
    border: none;
    border-bottom: 1px solid #cbcbcb;
  }
  box-shadow: none !important;
`

export const SectionFormConfirmButton = styled(IconCheck)`
  right: 0;
  fill: ${greenDark};
  cursor: pointer;

  path {
    stroke: ${greenDark};
    stroke-width: 2;
  }
`

export const Actions = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  width: 38px;
  height: 32px;

  svg {
    fill: ${greenDark};
    width: 13px;
    height: 13px;
    cursor: pointer;

    &:hover {
      fill: ${greenDark};
      opacity: 0.7;
    }

    &:last-child {
      fill: ${secondaryTextColor};

      &:hover {
        fill: ${secondaryTextColor};
      }
    }
  }
`
