import styled from 'styled-components'

/**
 * @see https://snapwiz.atlassian.net/browse/EV-35030
 * The div containing the text needs a max-width to avoid overflowing of text and show overflowing text as ellipsis
 * Need to reduce 24px to prevent text from overlapping on right/wrong icon
 * In case of show answer view we show index for response box. Thus need to reduce 32px more.
 */
export const TextContainer = styled.div`
  max-width: ${({ singleResponseBox, checkAnswer, lessMinWidth }) =>
    `calc(100% - ${
      singleResponseBox || checkAnswer || lessMinWidth ? '24px' : '56px'
    })`};
`
export const PopOverTextContainer = styled.div`
  white-space: normal;
  word-break: break-word;
`
