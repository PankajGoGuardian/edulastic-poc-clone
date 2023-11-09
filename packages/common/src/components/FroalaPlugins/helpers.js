import { cloneDeep, isEmpty } from 'lodash'
import {
  defaultCharacterSets,
  DEFAULT_TOOLBAR_BUTTONS,
  premiumToolbarButtons,
} from './constants'

export const getToolbarButtons = (
  size,
  toolbarSize,
  additionalToolbarOptions,
  buttons,
  buttonCounts,
  isPremiumUser
) => {
  const sizeMap = {
    STD: { STD: 'STD', MD: 'MD', SM: 'SM', XS: 'XS' },
    MD: { STD: 'MD', MD: 'MD', SM: 'SM', XS: 'XS' },
    SM: { STD: 'SM', MD: 'SM', SM: 'SM', XS: 'XS' },
    XS: { STD: 'XS', MD: 'XS', SM: 'XS', XS: 'XS' },
  }
  const cSize = sizeMap[toolbarSize][size]
  const toolbarButtons = cloneDeep(DEFAULT_TOOLBAR_BUTTONS[cSize])
  toolbarButtons.moreText.buttons = buttons
    ? [...buttons]
    : [
        ...toolbarButtons.moreText.buttons.filter(
          (btn) =>
            isPremiumUser ||
            (!isPremiumUser && !premiumToolbarButtons.includes(btn))
        ),
      ]
  toolbarButtons.moreText.buttonsVisible =
    buttonCounts || toolbarButtons.moreText.buttonsVisible
  toolbarButtons.moreMisc = {
    buttons: additionalToolbarOptions,
    buttonsVisible: 3,
  }

  return toolbarButtons
}

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      resolve()
    }
    image.onerror = () => {
      reject()
    }
    image.src = src
  })
}

export const getSpecialCharacterSets = (customCharacters) => {
  const customCharacterSet = isEmpty(customCharacters)
    ? []
    : [
        {
          title: 'Custom',
          char: 'á',
          list: customCharacters.map((char) => ({ char, desc: '' })),
        },
      ]

  return [...defaultCharacterSets, ...customCharacterSet]
}

const possibleClassNames = ['input__math', 'katex-html', 'mord', 'katex']
export const isContainsMathContent = (node) => {
  if (node && node.tagName === 'SPAN') {
    const classNames = [...node.classList]
    return classNames.some((x) => possibleClassNames.includes(x))
  }
  return false
}
