import React from 'react'
import { Tag } from 'antd'
import styled from 'styled-components'
import { white, premiumBg } from '@edulastic/colors'

const PremiumTag = ({ mr }) => <TagPremium mr={mr}>PREMIUM</TagPremium>

export default PremiumTag

const TagPremium = styled(Tag)`
  background: ${premiumBg};
  color: ${white};
  border: none;
  font-weight: 700;
  font-size: 8px;
  height: 20px;
  line-height: 1.5;
  margin-right: ${({ mr }) => mr || '3px'};
  padding: 4px 10px;
`
