import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withWindowSizes } from '@edulastic/common';

import MainInfoCell from './MainInfoCell';
import MetaInfoCell from './MetaInfoCell';
import {
  getItemsTypesSelector,
  getStandardsSelector
} from '../../../../selectors/testItems';

const ItemsTable = ({
  items,
  types,
  setSelectedTests,
  selectedTests,
  onAddItems,
  standards,
  windowWidth,
}) => {
  const columns = [
    {
      title: 'Main info',
      dataIndex: 'main',
      key: 'main',
      render: data => <MainInfoCell data={data} />
    },
    {
      title: 'Meta info',
      dataIndex: 'meta',
      key: 'meta',
      render: data => (
        <MetaInfoCell
          data={data}
          setSelectedTests={setSelectedTests}
          selectedTests={selectedTests}
          onAddItems={onAddItems}
          windowWidth={windowWidth}
        />
      )
    }
  ];

  const mobileColumns = [
    {
      title: 'Meta info',
      dataIndex: 'meta',
      key: 'meta',
      render: data => (
        <MetaInfoCell
          data={data}
          setSelectedTests={setSelectedTests}
          selectedTests={selectedTests}
          onAddItems={onAddItems}
          windowWidth={windowWidth}
        />
      )
    }
  ];

  const data = items.map((item) => {
    const main = {
      title: item._id,
      id: item._id
    };
    const meta = {
      id: item._id,
      title: item._id,
      by: 'Kevin Hart',
      shared: '9578 (1)',
      likes: 9,
      types: types[item._id],
      standards: standards[item._id]
    };

    if (item.data.questions && item.data.questions.length) {
      main.stimulus = item.data.questions[0].data.stimulus;
      meta.stimulus = item.data.questions[0].data.stimulus;
    }

    return {
      key: item._id,
      main,
      meta
    };
  });

  return (
    <Table
      columns={windowWidth > 993 ? columns : mobileColumns}
      dataSource={data}
      showHeader={false}
    />
  );
};

ItemsTable.propTypes = {
  items: PropTypes.array.isRequired,
  types: PropTypes.object.isRequired,
  setSelectedTests: PropTypes.func.isRequired,
  onAddItems: PropTypes.func.isRequired,
  selectedTests: PropTypes.array.isRequired,
  standards: PropTypes.object.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

const enhance = compose(
  memo,
  withWindowSizes,
  connect(
    state => ({
      types: getItemsTypesSelector(state),
      standards: getStandardsSelector(state)
    }),
  )
);

export default enhance(ItemsTable);
