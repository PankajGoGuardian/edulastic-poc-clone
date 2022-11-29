import styled from 'styled-components'
import { FlexContainer } from '@edulastic/common'

export const Overlay = styled(FlexContainer)`
  background: ${({ backgroundMaskColor }) => backgroundMaskColor || '#000'};
  opacity: ${({ opacity }) => opacity || '1'};
  height: ${({ height }) => height || '100vh'};
  width: ${({ width }) => width || '100vw'};
  align-items: ${({ verticalAlignment }) => verticalAlignment || 'center'};

  .ant-card {
    height: ${({ contentCardHeight }) => contentCardHeight || '20%'};
    width: ${({ contentCardWidth }) => contentCardWidth || '40%'};
    -webkit-animation: fadein 0.75s; /* Safari, Chrome and Opera > 12.1 */
    -moz-animation: fadein 0.75s; /* Firefox < 16 */
    -ms-animation: fadein 0.75s; /* Internet Explorer */
    -o-animation: fadein 0.75s; /* Opera < 12.1 */
    animation: fadein 0.75s;
  }

  .ant-card-body {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    height: 70%;
    padding-bottom: 0;
    padding-top: 0;
    justify-content: space-evenly;
  }

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Firefox < 16 */
  @-moz-keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Safari, Chrome and Opera > 12.1 */
  @-webkit-keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`
