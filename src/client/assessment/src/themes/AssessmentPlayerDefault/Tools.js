import React, { Fragment } from 'react';
import { Button, Input } from 'antd';
import PropTypes from 'prop-types';
import ColorPicker from 'rc-color-picker';
import styled from 'styled-components';

import { mainBlueColor, white, darkBlueSecondary, secondaryTextColor } from '@edulastic/colors';
import { FlexContainer } from '@edulastic/common';
import { withNamespaces } from '@edulastic/localization';
import { drawTools } from '@edulastic/constants';
import {
  IconPencilEdit,
  IconTrash,
  IconRedo,
  IconUndo,
  IconLine,
  IconBreakingLine,
  IconSquare,
  IconTriangle,
  IconCircleWithPoints,
  IconLetters,
  IconRoot,
  IconSquareTriangle,
  IconSelected
} from '@edulastic/icons';

const customizeIcon = icon => styled(icon)`
  fill: ${white};
  margin-left: -3px;
  margin-top: 3px;
  &:hover {
    fill: ${white};
  }
`;

const Trash = customizeIcon(IconTrash);

const Redo = customizeIcon(IconRedo);

const Undo = customizeIcon(IconUndo);

const Pencil = customizeIcon(IconPencilEdit);

const LineIcon = customizeIcon(IconLine);

const BreakingLineIcon = customizeIcon(IconBreakingLine);

const SquareIcon = customizeIcon(IconSquare);

const TriangleIcon = customizeIcon(IconTriangle);

const CircleWithPointsIcon = customizeIcon(IconCircleWithPoints);

const LettersIcon = customizeIcon(IconLetters);

const RootIcon = customizeIcon(IconRoot);

const SquareTriangleIcon = customizeIcon(IconSquareTriangle);

const SelectedIcon = customizeIcon(IconSelected);

const buttonsList = [
  { mode: drawTools.FREE_DRAW, icon: <Pencil /> },
  { mode: drawTools.DRAW_SIMPLE_LINE, icon: <LineIcon /> },
  { mode: drawTools.DRAW_BREAKING_LINE, icon: <BreakingLineIcon /> },
  { mode: drawTools.DRAW_SQUARE, icon: <SquareIcon /> },
  { mode: drawTools.DRAW_TRIANGLE, icon: <TriangleIcon /> },
  { mode: drawTools.DRAW_CIRCLE, icon: <CircleWithPointsIcon /> },
  { mode: drawTools.DRAW_TEXT, icon: <LettersIcon /> },
  { mode: 'none', icon: <RootIcon /> },
  { mode: 'none', icon: <SquareTriangleIcon /> },
  { mode: 'none', icon: <SelectedIcon /> }
];

const Tools = ({
  onToolChange,
  activeMode,
  onFillColorChange,
  fillColor,
  currentColor,
  deleteMode,
  onColorChange,
  undo,
  redo,
  lineWidth,
  t,
  onLineWidthChange
}) => {
  const getAlpha = (color) => {
    const regexValuesFromRgbaColor = /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)$/;

    return color.match(regexValuesFromRgbaColor) !== null
      ? +color.match(regexValuesFromRgbaColor).slice(-1) * 100
      : 100;
  };

  const showFillColorArray = [
    drawTools.DRAW_SQUARE,
    drawTools.DRAW_CIRCLE,
    drawTools.DRAW_TRIANGLE
  ];

  return (
    <ToolBox justifyContent="center">
      {activeMode === '' && (
        <FlexContainer justifyContent="flex-end" style={{ width: 1008 }}>
          {buttonsList.map((button, i) => (
            <StyledButton
              key={i}
              onClick={onToolChange(button.mode)}
              enable={activeMode === button.mode}
            >
              {button.icon}
            </StyledButton>
          ))}
        </FlexContainer>
      )}
      {activeMode !== '' && (
        <FlexContainer style={{ width: '100%' }} justifyContent="space-between">
          <BackButton onClick={onToolChange('')} justifyContent="flex-end" style={{ flex: 0.18 }}>
            <span style={{ fontSize: 18, marginRight: 10 }}>{'<'}</span> Back
          </BackButton>
          <Separator />
          <FlexContainer style={{ flex: 0.64 }} justifyContent="space-between">
            <FlexContainer alignItems="flex-start" flexDirection="column">
              <Text>{t(`common.activeModeTexts.${activeMode}.title`)}</Text>
              <SecondaryText>{t(`common.activeModeTexts.${activeMode}.description`)}</SecondaryText>
            </FlexContainer>
            <FlexContainer childMarginRight={30} id="tool">
              <FlexContainer>
                {showFillColorArray.includes(activeMode) && (
                  <Fragment>
                    <Label>Fill Color</Label>
                    <ColorPicker
                      animation="slide-down"
                      color={fillColor}
                      alpha={getAlpha(fillColor)}
                      onChange={onFillColorChange}
                    />
                  </Fragment>
                )}
                {activeMode !== drawTools.DRAW_TEXT ? (
                  <Fragment>
                    <Label>Line Color</Label>
                    <ColorPicker
                      animation="slide-down"
                      color={currentColor}
                      alpha={getAlpha(currentColor)}
                      onChange={onColorChange}
                    />
                  </Fragment>
                ) : (
                  <Fragment>
                    <Label>Text Color</Label>
                    <ColorPicker
                      animation="slide-down"
                      color={currentColor}
                      alpha={getAlpha(currentColor)}
                      onChange={onColorChange}
                    />
                  </Fragment>
                )}
              </FlexContainer>
              <FlexContainer>
                <Label>Size</Label>
                <Input
                  style={{ width: 60 }}
                  value={lineWidth}
                  onChange={e => onLineWidthChange(+e.target.value)}
                  type="number"
                />
              </FlexContainer>
            </FlexContainer>
          </FlexContainer>
          <Separator />
          <FlexContainer style={{ flex: 0.18 }}>
            <StyledButton onClick={undo}>
              <Undo />
            </StyledButton>
            <StyledButton onClick={redo}>
              <Redo />
            </StyledButton>
            <StyledButton onClick={onToolChange('deleteMode')} enable={deleteMode}>
              <Trash />
            </StyledButton>
          </FlexContainer>
        </FlexContainer>
      )}
    </ToolBox>
  );
};

Tools.propTypes = {
  onToolChange: PropTypes.func.isRequired,
  activeMode: PropTypes.string.isRequired,
  currentColor: PropTypes.string.isRequired,
  onColorChange: PropTypes.func.isRequired,
  lineWidth: PropTypes.number.isRequired,
  undo: PropTypes.func.isRequired,
  redo: PropTypes.func.isRequired,
  onFillColorChange: PropTypes.func.isRequired,
  fillColor: PropTypes.string.isRequired,
  deleteMode: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  onLineWidthChange: PropTypes.func.isRequired
};

export default withNamespaces('student')(Tools);

const ToolBox = styled(FlexContainer)`
  height: 50px;
  position: fixed;
  top: 62px;
  background: ${mainBlueColor};
  width: 100%;
  z-index: 10000;
`;

const Label = styled.div`
  font-weight: 600;
  font-size: 14;
  color: ${white};
  white-space: nowrap;
`;

const Text = styled.div`
  text-transform: uppercase;
  font-weight: 900;
  font-size: 12px;
  color: ${white};
`;
const SecondaryText = styled(Text)`
  font-weight: 600;
  font-size: 11px;
`;

const BackButton = styled(FlexContainer)`
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  user-select: none;
  text-transform: uppercase;
  color: ${white};
`;

const Separator = styled.span`
  display: block;
  width: 0;
  margin-left: 35px;
  margin-right: 35px;
  height: 30px;
  opacity: 0.4;
  border-right: 1px solid ${secondaryTextColor};
`;

const StyledButton = styled(Button)`
  margin-right: 10px;
  background: ${props => (props.enable ? darkBlueSecondary : 'transparent')};
  height: 40px;
  width: 40px;
  border: none;

  &:focus,
  &:hover {
    background: ${props => (props.enable ? darkBlueSecondary : 'transparent')};
  }
`;
