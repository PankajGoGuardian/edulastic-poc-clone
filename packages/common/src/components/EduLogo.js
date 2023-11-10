import {
  IconLogoDark,
  IconLogoWhite,
  IconOnDarkLogo,
  IconOnWhiteLogo,
  IconPearAssessLogo,
} from '@edulastic/icons'
import styled from 'styled-components'

export const OnWhiteBgLogo = styled(IconOnWhiteLogo)`
  width: ${(props) => props.width || 'auto'};
  height: ${(props) => props.height || '30px'};
`

export const OnDarkBgLogo = styled(IconOnDarkLogo)`
  width: ${(props) => props.width || 'auto'};
  height: ${(props) => props.height || '30px'};
`

export const AssessPeardeckOnDarkBgLogo = styled(IconPearAssessLogo)`
  width: ${(props) => props.width || 'auto'};
  height: ${(props) => props.height || '30px'};
`

export const AssessPeardeckOnLightBgLogo = styled(IconPearAssessLogo)`
  width: ${(props) => props.width || 'auto'};
  height: ${(props) => props.height || '30px'};
`

export const WhiteLogo = styled(IconLogoWhite)`
  width: ${(props) => props.width || 'auto'};
  height: ${(props) => props.height || '30px'};
`

export const DarkLogo = styled(IconLogoDark)`
  width: ${(props) => props.width || 'auto'};
  height: ${(props) => props.height || '30px'};
`
