import React from 'react';
import { Button, Input } from 'antd';
import PropTypes from 'prop-types';
import ColorPicker from 'rc-color-picker';
import styled from 'styled-components';

import { mainBlueColor, white, darkBlueSecondary, secondaryTextColor } from '@edulastic/colors';
import { FlexContainer } from '@edulastic/common';
import {
  IconArrows,
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

const Tools = ({
  onToolChange,
  activeMode,
  currentColor,
  onColorChange,
  undo,
  redo,
  lineWidth,
  onLineWidthChange
}) => {
  const getAlpha = (color) => {
    const regexValuesFromRgbaColor = /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)$/;

    return color.match(regexValuesFromRgbaColor) !== null
      ? +color.match(regexValuesFromRgbaColor).slice(-1) * 100
      : 100;
  };
  return (
    <ToolBox justifyContent="center">
      {activeMode === '' && (
        <FlexContainer justifyContent="flex-end" style={{ width: 1008 }}>
          <StyledButton onClick={onToolChange('move')} enable={activeMode === 'move'}>
            <Arrows />
          </StyledButton>
          <StyledButton onClick={onToolChange('freeDraw')} enable={activeMode === 'freeDraw'}>
            <Pencil />
          </StyledButton>
          <StyledButton
            onClick={onToolChange('drawSimpleLine')}
            enable={activeMode === 'drawSimpleLine'}
          >
            <LineIcon />
          </StyledButton>
          <StyledButton
            onClick={onToolChange('drawBreakingLine')}
            enable={activeMode === 'drawBreakingLine'}
          >
            <BreakingLineIcon />
          </StyledButton>
          <StyledButton onClick={onToolChange('drawSquare')} enable={activeMode === 'drawSquare'}>
            <SquareIcon />
          </StyledButton>
          <StyledButton>
            <TriangleIcon />
          </StyledButton>
          <StyledButton>
            <CircleWithPointsIcon />
          </StyledButton>
          <StyledButton>
            <LettersIcon />
          </StyledButton>
          <StyledButton>
            <RootIcon />
          </StyledButton>
          <StyledButton>
            <SquareTriangleIcon />
          </StyledButton>
          <StyledButton>
            <SelectedIcon />
          </StyledButton>
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
              <Text>FreeHand Draw Tool</Text>
              <SecondaryText>Tap and drag to draw lines</SecondaryText>
            </FlexContainer>
            <FlexContainer childMarginRight={30} id="tool">
              <FlexContainer>
                <Label>Line Color</Label>
                <ColorPicker
                  animation="slide-down"
                  color={currentColor}
                  alpha={getAlpha(currentColor)}
                  onChange={onColorChange}
                />
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
            <StyledButton onClick={onToolChange('deleteMode')} enable={activeMode === 'deleteMode'}>
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
  onLineWidthChange: PropTypes.func.isRequired
};

export default Tools;

const ToolBox = styled(FlexContainer)`
  height: 50px;
  position: absolute;
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

const customizeIcon = icon => styled(icon)`
  fill: ${white};
  margin-left: -3px;
  margin-top: 3px;
  &:hover {
    fill: ${white};
  }
`;

const Arrows = customizeIcon(IconArrows);

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
