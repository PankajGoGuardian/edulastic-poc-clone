import { css } from 'styled-components'

const desktop = 320

export const breakpoints = {
  xs: 1,
  sm: 1,
  md: 1,
  lg: 1,
  xl: 1,
}

const respondToBreakpoint = (zoomLevel, breakpoint) => (...style) => {
  if (zoomLevel === breakpoint) {
    return css`
      @media (min-width: ${desktop * breakpoints[breakpoint]}px) {
        ${css(...style)}
      }
    `
  }

  return ''
}

export const fontSizes = {
  fontSize: 16,
  size1: 26,
  size2: 22,
  size3: 16,
  size4: 14,
  size5: 10,
  size6: 12,
  size7: 11,
}

export const getZoomedTheme = (theme, zoomLevel) => {
  const modifiedTheme = {
    ...theme,
    ...fontSizes,
    breakpoints,
    desktop,
  }

  Object.keys(fontSizes).forEach((key) => {
    modifiedTheme[key] = fontSizes[key] * modifiedTheme.breakpoints[zoomLevel]
  })

  const zoomedCss = (...args) => {
    if (zoomLevel !== 'xs') {
      return css`
        @media (min-width: ${modifiedTheme.desktop *
          modifiedTheme.breakpoints.xs}px) {
          ${css(...args)}
        }
      `
    }
  }

  const respondTo = {
    xl: respondToBreakpoint(zoomLevel, 'xl'),
    lg: respondToBreakpoint(zoomLevel, 'lg'),
    md: respondToBreakpoint(zoomLevel, 'md'),
    sm: respondToBreakpoint(zoomLevel, 'sm'),
  }

  return {
    respondTo,
    zoomedCss,
    zoomLevel,
    ...modifiedTheme,
  }
}
