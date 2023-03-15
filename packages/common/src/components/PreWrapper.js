import styled from 'styled-components'
import { title } from '@edulastic/colors'

const PreWrapper = styled.pre`
  font-family: 'Open Sans', 'Droid Sans', Arial, sans-serif;
  white-space: pre-wrap;

  .template_box {
    padding: ${(props) =>
      props.view === 'preview' ? props.padding : '15px'} !important;
    .jsx-parser {
      & p,
      & span:not(.index) {
        color: ${title};
      }
      /**
       * @see https://snapwiz.atlassian.net/browse/EV-35090
       * table cell shows all content in one line
       */
      @media print {
        & td {
          white-space: normal;
        }
      }
    }
  }
`

PreWrapper.displayName = 'PreWrapper'

export default PreWrapper
