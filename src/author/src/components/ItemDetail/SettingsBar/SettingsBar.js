import React, { Component } from 'react';
import styled from 'styled-components';
import { white, greenDark } from '@edulastic/colors';
import { Button, FlexContainer, Checkbox } from '@edulastic/common';
import { IconSettings } from '@edulastic/icons';
import PropTypes from 'prop-types';
import { withNamespaces } from '@edulastic/localization';

import SettingsBarItem from './SettingsBarItem';
import SettingsBarTags from './SettingsBarTags';
import SettingsBarUseTabs from './SettingsBarUseTabs';

class SettingsBar extends Component {
  layouts = [
    {
      value: '100-100',
      text: 'Single column',
    },
    {
      value: '30-70',
      text: '30 | 70',
    },
    {
      value: '70-30',
      text: '70 | 30',
    },
    {
      value: '50-50',
      text: '50 | 50',
    },
    {
      value: '40-60',
      text: '40 | 60',
    },
    {
      value: '60-40',
      text: '60 | 40',
    },
  ];

  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    onApply: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    useTabs: PropTypes.func.isRequired,
    useTabsLeft: PropTypes.bool.isRequired,
    useTabsRight: PropTypes.bool.isRequired,
    verticalDivider: PropTypes.bool.isRequired,
    scrolling: PropTypes.bool.isRequired,
    onVerticalDividerChange: PropTypes.func.isRequired,
    onScrollingChange: PropTypes.func.isRequired,
  };

  handleCheckboxChange = name => () => {
    this.setState(state => ({
      [name]: !state[name],
    }));
  };

  handleRemoveTag = () => {};

  handleChangeLeftTab = () => {
    const { useTabs, useTabsLeft } = this.props;
    useTabs({ rowIndex: 0, isUseTabs: !useTabsLeft });
  };

  handleChangeRightTab = () => {
    const { useTabs, useTabsRight } = this.props;
    useTabs({ rowIndex: 1, isUseTabs: !useTabsRight });
  };

  render() {
    const {
      onCancel,
      type,
      t,
      useTabsLeft,
      useTabsRight,
      onApply,
      verticalDivider,
      scrolling,
      onVerticalDividerChange,
      onScrollingChange,
    } = this.props;

    return (
      <Container>
        <SettingsButtonWrapper justifyContent="flex-end">
          <Button color="primary" onClick={onCancel} style={{ minWidth: 85 }}>
            <IconSettings color={white} />
          </Button>
        </SettingsButtonWrapper>
        <Heading>{t('author:component.settingsBar.layout')}</Heading>
        <Items>
          {this.layouts.map(item => (
            <SettingsBarItem
              onSelect={() => onApply({ type: item.value })}
              selected={type === item.value}
              key={item.value}
              item={item}
            />
          ))}
        </Items>
        <SettingsBarUseTabs
          onChangeLeft={this.handleChangeLeftTab}
          onChangeRight={this.handleChangeRightTab}
          checkedLeft={useTabsLeft}
          checkedRight={useTabsRight}
        />
        <Checkboxes>
          <Checkbox
            style={{ marginBottom: 20 }}
            label={t('author:component.settingsBar.showVerticalDivider')}
            checked={verticalDivider}
            onChange={onVerticalDividerChange}
          />
          <Checkbox
            label={t('author:component.settingsBar.enableScrolling')}
            checked={scrolling}
            onChange={onScrollingChange}
          />
        </Checkboxes>
        <Heading>{t('author:component.settingsBar.tags')}</Heading>
        <SettingsBarTags
          tags={['equations', 'algebra']}
          onRemove={this.handleRemoveTag}
        />
      </Container>
    );
  }
}

export default withNamespaces(['default', 'author'])(SettingsBar);

const Container = styled.div`
  width: 25vw;
  background: ${white};
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  padding: 30px;
  box-shadow: -3px 3px 6px 0 rgba(0, 0, 0, 0.16);
  overflow-y: auto;
`;

const SettingsButtonWrapper = styled(FlexContainer)`
  margin-bottom: 25px;
`;

const Heading = styled.div`
  color: ${greenDark};
  margin-bottom: 25px;
  font-size: 16px;
  font-weight: 600;
`;

const Items = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Checkboxes = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
`;
