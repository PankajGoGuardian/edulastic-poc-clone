import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { cloneDeep, isEqual } from 'lodash';

import { FlexContainer } from '@edulastic/common';
import { IconEraseText, IconRedo, IconUndo, IconDraw, IconTrash } from '@edulastic/icons';
import {
  dashBorderColorOpacity,
  greenDark,
  secondaryTextColor,
  dashBorderColor,
  white
} from '@edulastic/colors';
import { withNamespaces } from '@edulastic/localization';

import { setQuestionDataAction } from '../../../../../../author/src/actions/question';
import SvgContainer from './SvgContainer';
import { DRAW_MODE, DELETE_MODE } from '../../../../constants/constantsForQuestions';
import SvgDeleteContainer from './SvgDeleteContainer';

const AreasContainer = ({ itemData, areas, width, imageSrc, height, t, setQuestionData }) => {
  const [history, setHistory] = useState([{ areas: [], points: [] }]);

  const [historyTab, setHistoryTab] = useState(0);

  const [mode, setMode] = useState(DRAW_MODE);

  useEffect(
    () => {
      if (history[historyTab] && !isEqual(history[historyTab].areas, areas, areas)) {
        const newHistory = cloneDeep(history);

        if (historyTab !== history.length - 1) {
          newHistory.splice(historyTab + 1);
        }

        newHistory.push({
          areas,
          points: []
        });

        setHistory(newHistory);
        setHistoryTab(newHistory.length - 1);
      }
    },
    [areas]
  );

  const handleHistoryChange = (newAreas, points) => {
    const newHistory = cloneDeep(history);

    newHistory.splice(historyTab + 1);

    newHistory.push({ areas: newAreas, points: cloneDeep(points) });

    setHistory(newHistory);

    setHistoryTab(newHistory.length - 1);

    setQuestionData({ ...itemData, areas: newAreas });
  };

  const handleUndoClick = () => {
    setHistoryTab(historyTab - 1);
    setQuestionData({ ...itemData, areas: history[historyTab - 1].areas });
  };

  const handleRedoClick = () => {
    setHistoryTab(historyTab + 1);
    setQuestionData({
      ...itemData,
      areas: history[historyTab + 1] ? history[historyTab + 1].areas : []
    });
  };

  const handleClearClick = () => {
    setHistoryTab(0);

    setHistory([]);

    setQuestionData({ ...itemData, areas: [] });
  };

  const handleModeChange = newMode => () => {
    setMode(newMode);
  };

  return (
    <FlexContainer>
      <div style={{ width: width + 117 }}>
        <Container justifyContent="flex-end" childMarginRight={45}>
          <Button disabled={historyTab === 0} onClick={handleUndoClick}>
            <IconUndo style={{ marginRight: 25 }} width={18} height={18} />
            <Text>{t('component.hotspot.undo')}</Text>
          </Button>
          <Button disabled={historyTab === history.length - 1} onClick={handleRedoClick}>
            <IconRedo style={{ marginRight: 25 }} width={18} height={18} />
            <Text>{t('component.hotspot.redo')}</Text>
          </Button>
          <Button onClick={handleClearClick}>
            <IconEraseText style={{ marginRight: 25 }} width={18} height={18} />
            <Text>{t('component.hotspot.clear')}</Text>
          </Button>
        </Container>
        <FlexContainer childMarginRight={0} alignItems="stretch">
          <SideBar>
            <ButtonWithShadow onClick={handleModeChange(DRAW_MODE)} active={mode === DRAW_MODE}>
              <IconDraw style={{ marginBottom: 10 }} color={greenDark} width={42} height={42} />
              <Text>{t('component.hotspot.draw')}</Text>
            </ButtonWithShadow>
            <ButtonWithShadow onClick={handleModeChange(DELETE_MODE)} active={mode === DELETE_MODE}>
              <IconTrash style={{ marginBottom: 10 }} color={greenDark} width={42} height={42} />
              <Text>{t('component.hotspot.delete')}</Text>
            </ButtonWithShadow>
          </SideBar>
          {imageSrc &&
            (mode === DRAW_MODE ? (
              <SvgContainer
                changeHistory={handleHistoryChange}
                areas={areas}
                history={history[historyTab]}
                width={width}
                height={height}
                itemData={itemData}
                imageSrc={imageSrc}
              />
            ) : (
              <SvgDeleteContainer
                areas={areas}
                history={history[historyTab]}
                width={width}
                height={height}
                itemData={itemData}
                imageSrc={imageSrc}
              />
            ))}
        </FlexContainer>
      </div>
    </FlexContainer>
  );
};

AreasContainer.propTypes = {
  t: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  imageSrc: PropTypes.string.isRequired,
  areas: PropTypes.array.isRequired,
  itemData: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired
};

export default connect(
  null,
  { setQuestionData: setQuestionDataAction }
)(withNamespaces('assessment')(AreasContainer));

const Container = styled(FlexContainer)`
  min-height: 67px;
  padding: 14px 28px 14px 14px;
  background: ${dashBorderColorOpacity};
  margin-top: 20px;
  border-bottom: 1px solid ${dashBorderColor};
`;

const ButtonWithShadow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 103px;
  cursor: pointer;
  height: 105px;
  border-radius: 4px;
  box-shadow: ${({ active }) => (active ? '1px 3px 6px 0 rgba(0, 0, 0, 0.06)' : 'none')};
  background-color: ${({ active }) => (active ? white : 'transparent')};
  transition: all 0.3s ease-in-out;
  &:hover {
    box-shadow: 1px 3px 6px 0 rgba(0, 0, 0, 0.06);
  }
`;

const SideBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${dashBorderColorOpacity};
  width: 117px;
  padding: 22px 7px;

  & > * {
    margin-bottom: 10px;
  }
  & > *:last-child {
    margin-bottom: 0;
  }
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
