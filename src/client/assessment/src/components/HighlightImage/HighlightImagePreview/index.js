import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Select } from 'antd';

import { Paper, Stimulus, FlexContainer } from '@edulastic/common';
import { withNamespaces } from '@edulastic/localization';
import { IconUndo, IconRedo, IconEraseText } from '@edulastic/icons';
import {
  dashBorderColorOpacity,
  dashBorderColor,
  secondaryTextColor,
  greenDark
} from '@edulastic/colors';

import { PREVIEW } from '../../../constants/constantsForQuestions';

const { Option } = Select;

const HighlightImagePreview = ({ view, item, smallSize, saveAnswer, userAnswer, t }) => {
  const canvas = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyTab, setHistoryTab] = useState(0);
  const [mouseDown, setMouseDown] = useState(false);

  const { image, line_color } = item;

  const [currentColor, setCurrentColor] = useState(line_color[0]);

  const width = image ? image.width : 900;
  const height = image ? image.height : 470;
  const altText = image ? image.altText : '';
  const file = image ? image.source : '';

  const drawImage = (context) => {
    if (!Array.isArray(userAnswer)) {
      const img = new Image();
      img.alt = altText;
      img.onload = () => {
        context.clearRect(0, 0, width, height);
        context.drawImage(img, 0, 0, width, height);
        if (canvas.current) {
          setHistory([canvas.current.toDataURL()]);
        }
        setHistoryTab(0);
        if (canvas.current) {
          saveAnswer(canvas.current.toDataURL());
        }
        setCtx(context);
      };
      img.src = userAnswer;
    } else {
      context.clearRect(0, 0, width, height);
      if (canvas.current) {
        setHistory([canvas.current.toDataURL()]);
      }
      setHistoryTab(0);
      if (canvas.current) {
        saveAnswer(canvas.current.toDataURL());
      }

      setCtx(context);
    }
  };

  useEffect(
    () => {
      if (canvas) {
        canvas.current.width = width;
        canvas.current.height = height;
        const context = canvas.current.getContext('2d');
        context.lineWidth = 10;
        context.lineJoin = 'round';
        context.lineCap = 'round';

        drawImage(context);
      }
    },
    [file]
  );

  const onCanvasMouseDown = (e) => {
    const bounded = canvas.current.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - bounded.left, e.clientY - bounded.top);
    setCtx(ctx);
    setMouseDown(true);
  };

  const onCanvasMouseUp = (e) => {
    if (mouseDown) {
      const bounded = canvas.current.getBoundingClientRect();
      ctx.lineTo(e.clientX - bounded.left, e.clientY - bounded.top);
      ctx.strokeStyle = currentColor;
      ctx.stroke();
      ctx.closePath();
      const newHistory = [...history.slice(0, historyTab + 1), canvas.current.toDataURL()];
      setHistory(newHistory);
      setHistoryTab(newHistory.length - 1);
      setCtx(ctx);
      setMouseDown(false);
      saveAnswer(canvas.current.toDataURL());
    }
  };

  const onCanvasMouseMove = (e) => {
    if (mouseDown) {
      const bounded = canvas.current.getBoundingClientRect();

      ctx.lineTo(e.clientX - bounded.left, e.clientY - bounded.top);
      ctx.strokeStyle = currentColor;
      ctx.stroke();
      setCtx(ctx);
    }
  };

  const onClearClick = () => {
    ctx.clearRect(0, 0, width, height);
    setCtx(ctx);
    const newHistory = [...history.slice(0, historyTab + 1), canvas.current.toDataURL()];
    setHistory(newHistory);
    setHistoryTab(newHistory.length - 1);
  };

  const onUndoClick = () => {
    const img = new Image();

    img.onload = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      setHistoryTab(historyTab - 1);
      setCtx(ctx);
    };
    img.src = history[historyTab - 1];
    saveAnswer(history[historyTab - 1]);
  };

  const onRedoClick = () => {
    const img = new Image();

    img.onload = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      setHistoryTab(historyTab + 1);
      setCtx(ctx);
    };
    img.src = history[historyTab + 1];
    saveAnswer(history[historyTab + 1]);
  };

  return (
    <Paper padding={smallSize} boxShadow={smallSize ? 'none' : ''}>
      {view === PREVIEW && !smallSize && (
        <Stimulus dangerouslySetInnerHTML={{ __html: item.stimulus }} />
      )}

      <Container style={{ maxWidth: '100%' }} width={`${+width}px`} justifyContent="space-between">
        {line_color.length > 1 && (
          <StyledSelect value={currentColor} onChange={setCurrentColor}>
            {line_color.map((color, i) => (
              <Option key={i} value={color}>
                <div className="rc-color-picker-wrap">
                  <span className="rc-color-picker-trigger" style={{ background: color }} />
                </div>
              </Option>
            ))}
          </StyledSelect>
        )}
        <FlexContainer childMarginRight={45}>
          <Button disabled={historyTab === 0} onClick={onUndoClick}>
            <IconUndo style={{ marginRight: 25 }} width={18} height={18} />
            <Text>{t('component.hotspot.undo')}</Text>
          </Button>
          <Button
            disabled={historyTab === history.length - 1 || history.length === 0}
            onClick={onRedoClick}
          >
            <IconRedo style={{ marginRight: 25 }} width={18} height={18} />
            <Text>{t('component.hotspot.redo')}</Text>
          </Button>
          <Button onClick={onClearClick}>
            <IconEraseText style={{ marginRight: 25 }} width={18} height={18} />
            <Text>{t('component.hotspot.clear')}</Text>
          </Button>
        </FlexContainer>
      </Container>
      <CanvasContainer>
        <img src={file} alt={altText} width={width} height={height} />
        <canvas
          onMouseDown={onCanvasMouseDown}
          onMouseUp={onCanvasMouseUp}
          onMouseMove={onCanvasMouseMove}
          ref={canvas}
        />
      </CanvasContainer>
    </Paper>
  );
};

HighlightImagePreview.propTypes = {
  smallSize: PropTypes.bool,
  item: PropTypes.object.isRequired,
  view: PropTypes.string.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  userAnswer: PropTypes.any.isRequired
};

HighlightImagePreview.defaultProps = {
  smallSize: false
};

export default withNamespaces('assessment')(HighlightImagePreview);

const StyledSelect = styled(Select)`
  & > .ant-select-selection__rendered {
    display: flex !important;
    align-items: center !important;
    padding: 0px !important;
    line-height: 40px !important;
    height: 40px !important;
  }
  & > .ant-select-selection {
    background: transparent !important;
    border: none !important;
    &:focus {
      outline: none;
      box-shadow: none !important;
    }
  }
`;

const CanvasContainer = styled.div`
  position: relative;
  img {
    user-select: none;
  }
  canvas {
    position: absolute;
    left: 0;
    top: 0;
  }
`;

const Container = styled(FlexContainer)`
  min-height: 67px;
  width: ${({ width }) => width || '100%'};
  padding: 14px 28px 14px 14px;
  background: ${dashBorderColorOpacity};
  margin-top: 20px;
  border-bottom: 1px solid ${dashBorderColor};
`;
const Button = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: transparent;
  color: ${secondaryTextColor};
  cursor: pointer;
  user-select: none;
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'all')};
  svg {
    fill: ${secondaryTextColor};
  }
  &:hover {
    color: ${greenDark};
    svg {
      fill: ${greenDark};
    }
  }
`;

const Text = styled.div`
  font-size: 14px;
  font-weight: 600;
`;
