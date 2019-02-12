import styled from 'styled-components';

export const QlBlocks = styled.button`
  display: block !important;
  width: 40px !important;
  height: 40px !important;
  background: ${({ active, theme }) => (active
    ? theme.widgets.essayRichText.qlBlocksBgActiveColor
    : theme.widgets.essayRichText.qlBlocksBgColor)}!important;
  .ql-stroke.ql-fill,
  .ql-stroke.ql-thin,
  .ql-fill,
  .ql-thin {
    fill: ${({ active, theme }) => (active
    ? theme.widgets.essayRichText.qlBlocksActiveColor
    : theme.widgets.essayRichText.qlBlocksColor)}!important;
  }

  color: ${({ active, theme }) => (active
    ? theme.widgets.essayRichText.qlBlocksActiveColor
    : theme.widgets.essayRichText.qlBlocksColor)}!important;
  .ql-stroke {
    stroke: ${({ active, theme }) => (active
    ? theme.widgets.essayRichText.qlBlocksActiveColor
    : theme.widgets.essayRichText.qlBlocksColor)}!important;
  }
`;
