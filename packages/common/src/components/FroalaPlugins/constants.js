const buttons = [
  'bold',
  'italic',
  'underline',
  'insertVideo',
  'insertAudio',
  'fontSize',
  'indent',
  'outdent',
  'math',
  'paragraphFormat',
  'insertTable',
  'insertImage',
  'insertLink',
  'align',
  'backgroundColor',
  'textColor',
  'strikeThrough',
  'subscript',
  'superscript',
  'undo',
  'redo',
  'specialCharacters',
]

export const audioUploadFileLimit = 10 // in MB

export const premiumToolbarButtons = ['insertAudio']

export const DEFAULT_TOOLBAR_BUTTONS = {
  STD: {
    moreText: {
      buttons,
      buttonsVisible: 10,
    },
  },
  MD: {
    moreText: {
      buttons,
      buttonsVisible: 8,
    },
  },
  SM: {
    moreText: {
      buttons,
      buttonsVisible: 8,
    },
  },
  XS: {
    moreText: {
      buttons,
      buttonsVisible: 7,
    },
  },
}

export const defaultCharacterSets = [
  {
    title: 'spanish',
    char: 'es',
    list: [
      {
        char: '&aacute;',
        desc: 'LATIN SMALL LETTER A WITH ACUTE',
      },
      {
        char: '&Aacute;',
        desc: 'LATIN CAPITAL LETTER A WITH ACUTE',
      },
      {
        char: '&eacute;',
        desc: 'LATIN SMALL LETTER E WITH ACUTE',
      },
      {
        char: '&Eacute;',
        desc: 'LATIN CAPITAL LETTER E WITH ACUTE',
      },
      {
        char: '&iacute;',
        desc: 'LATIN SMALL LETTER i WITH ACUTE',
      },
      {
        char: '&Iacute;',
        desc: 'LATIN CAPITAL LETTER I WITH ACUTE',
      },
      {
        char: '&ntilde;',
        desc: 'LATIN SMALL LETTER N WITH TILDE',
      },
      {
        char: '&Ntilde;',
        desc: 'LATIN CAPITAL LETTER N WITH TILDE',
      },
      {
        char: '&oacute;',
        desc: 'LATIN SMALL LETTER 0 WITH ACUTE',
      },
      {
        char: '&Oacute;',
        desc: 'LATIN CAPITAL LETTER O WITH ACUTE',
      },
      {
        char: '&uacute;',
        desc: 'LATIN SMALL LETTER u WITH ACUTE',
      },
      {
        char: '&Uacute;',
        desc: 'LATIN CAPITAL LETTER U WITH ACUTE',
      },
      {
        char: '&uuml;',
        desc: 'LATIN SMALL LETTER U WITH DIAERESIS',
      },
      {
        char: '&Uuml;',
        desc: 'LATIN CAPITAL LETTER U WITH DIAERESIS',
      },
      {
        char: '&iexcl;',
        desc: 'INVERTED EXCLAMATION MARK',
      },
      {
        char: '&iquest;',
        desc: 'INVERTED QUESTION MARK',
      },
    ],
  },
  {
    title: 'german',
    char: 'de',
    list: [
      {
        char: '&Auml;',
        desc: 'Capital A-umlaut',
      },
      {
        char: '&auml;',
        desc: 'Lowercase a-umlaut',
      },
      {
        char: '&Eacute;',
        desc: 'Capital E-acute',
      },
      {
        char: '&eacute;',
        desc: 'Lowercase E-acute',
      },
      {
        char: '&Ouml;',
        desc: 'Capital O-umlaut',
      },
      {
        char: '&ouml;',
        desc: 'Lowercase o-umlaut',
      },
      {
        char: '&Uuml;',
        desc: 'Capital U-umlaut',
      },
      {
        char: '&uuml;',
        desc: 'Lowercase u-umlaut',
      },
      {
        char: '&szlig;',
        desc: 'SZ ligature',
      },
      {
        char: '&laquo;',
        desc: 'Left angle quotes',
      },
      {
        char: '&raquo;',
        desc: 'Right angle quotes',
      },
      {
        char: '&bdquo;',
        desc: 'Left lower quotes',
      },
      {
        char: '&#8220;',
        desc: 'Left quotes',
      },
      {
        char: '&#8221;',
        desc: 'Right quotes',
      },
      {
        char: '&deg;',
        desc: 'Degree sign (Grad)',
      },
      {
        char: '&euro;',
        desc: 'Euro',
      },
      {
        char: '&pound;',
        desc: 'Pound Sterling',
      },
    ],
  },
  {
    title: 'french',
    char: 'fr',
    list: [
      {
        char: '&Agrave;',
        desc: 'Capital A-grave',
      },
      {
        char: '&agrave;',
        desc: 'Lowercase a-grave',
      },
      {
        char: '&Acirc;',
        desc: 'Capital A-circumflex',
      },
      {
        char: '&acirc;',
        desc: 'Lowercase a-circumflex',
      },
      {
        char: '&AElig;',
        desc: 'Capital AE Ligature',
      },
      {
        char: '&aelig;',
        desc: 'Lowercase AE Ligature',
      },
      {
        char: '&Ccedil;',
        desc: 'Capital C-cedilla',
      },
      {
        char: '&ccedil;',
        desc: 'Lowercase c-cedilla',
      },
      {
        char: '&Egrave;',
        desc: 'Capital E-grave',
      },
      {
        char: '&egrave;',
        desc: 'Lowercase e-grave',
      },
      {
        char: '&Eacute;',
        desc: 'Capital E-acute',
      },
      {
        char: '&eacute;',
        desc: 'Lowercase e-acute',
      },
      {
        char: '&Ecirc;',
        desc: 'Capital E-circumflex',
      },
      {
        char: '&ecirc;',
        desc: 'Lowercase e-circumflex',
      },
      {
        char: '&Euml;',
        desc: 'Capital E-umlaut',
      },
      {
        char: '&euml;',
        desc: 'Lowercase e-umlaut',
      },
      {
        char: '&Icirc;',
        desc: 'Capital I-circumflex',
      },
      {
        char: '&icirc;',
        desc: 'Lowercase i-circumflex',
      },
      {
        char: '&Iuml;',
        desc: 'Capital I-umlaut',
      },
      {
        char: '&iuml;',
        desc: 'Lowercase i-umlaut',
      },
      {
        char: '&Ocirc;',
        desc: 'Capital O-circumflex',
      },
      {
        char: '&ocirc;',
        desc: 'Lowercase o-circumflex',
      },
      {
        char: '&OElig;',
        desc: 'Capital OE ligature',
      },
      {
        char: '&oelig;',
        desc: 'Lowercase oe ligature',
      },
      {
        char: '&Ugrave;',
        desc: 'Capital U-grave',
      },
      {
        char: '&ugrave;',
        desc: 'Lowercase u-grave',
      },
      {
        char: '&Ucirc;',
        desc: 'Capital U-circumflex',
      },
      {
        char: '&ucirc;',
        desc: 'Lowercase u-circumflex',
      },
      {
        char: '&Uuml;',
        desc: 'Capital U-umlaut',
      },
      {
        char: '&uuml;',
        desc: 'Lowercase u-umlaut',
      },
      {
        char: '&laquo;',
        desc: 'Left angle quotes',
      },
      {
        char: '&raquo;',
        desc: 'Right angle quotes',
      },
      {
        char: '&euro;',
        desc: 'Euro',
      },
      {
        char: '&#8355',
        desc: 'Franc',
      },
    ],
  },
]

/**
 * These are the extra buttons width taken on the toolbar. If rendered extra buttons we need these widths
 * to get the remaining width of the toolbar to render default buttons.
 * Note: Width of the buttons will be same for all the resoution (may be slight less by 1 or 2 pixel).
 */
export const buttonWidthMap = {
  responseBoxes: 178,
  response: 119,
  textinput: 119,
  textdropdown: 167,
  mathinput: 42,
  mathunit: 42,
  paragraphNumber: 42,
}
