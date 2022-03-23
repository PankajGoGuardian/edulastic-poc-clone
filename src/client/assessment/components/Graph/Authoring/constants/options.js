import { RENDERING_BASE } from '../../Builder/config/constants'

export const fontSizeList = [
  {
    id: 'small',
    label: 'small',
    value: 10,
    selected: false,
  },
  {
    id: 'normal',
    label: 'normal',
    value: 12,
    selected: true,
  },
  {
    id: 'large',
    label: 'large',
    value: 16,
    selected: false,
  },
  {
    id: 'extra_large',
    label: 'extraLarge',
    value: 20,
    selected: false,
  },
  {
    id: 'huge',
    label: 'huge',
    value: 24,
    selected: false,
  },
]

export const renderingBaseList = [
  {
    id: RENDERING_BASE.LINE_MINIMUM_VALUE,
    value: 'Line minimum value',
    label: 'lineMinValue',
    selected: true,
  },
  {
    id: RENDERING_BASE.ZERO_BASED,
    value: 'Zero',
    label: 'zero',
    selected: false,
  },
]

export const orientationList = [
  { value: 'horizontal', label: 'component.options.horizontal' },
  { value: 'vertical', label: 'component.options.vertical' },
]
