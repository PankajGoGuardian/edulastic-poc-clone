import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Tag, message } from 'antd';
import { withNamespaces } from '@edulastic/localization';
import { FlexContainer } from '@edulastic/common';
import { IconShare, IconHeart } from '@edulastic/icons';
import { greenDark, textColor, grey, white } from '@edulastic/colors';
import styled from 'styled-components';
import Tags from '../../../common/Tags';
import { setTestItemsAction } from '../../../../actions/testItems';
import { getSelectedItemSelector } from '../../../../selectors/testItems';


class MetaInfoCell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: props.selectedTests,
      isAddOrRemove: true,
    };
  }

  componentDidMount() {
    const { selectedRowKeys } = this.state;
    const { data, setTestItems } = this.props;
    const keys = [];
    selectedRowKeys.map((selectedRow, index) => { keys[index] = selectedRow; return true; });
    setTestItems(selectedRowKeys);
    if (keys.includes(data.id)) {
      this.setState({ isAddOrRemove: false });
    }
  }

  handleSelection = (row) => {
    const { setSelectedTests, setTestItems, selectedRows } = this.props;
    let keys = [];
    if (selectedRows !== undefined) {
      selectedRows.data.map((selectedRow, index) => { keys[index] = selectedRow; return true; });
    }
    if (!keys.includes(row.id)) {
      keys[keys.length] = row.id;
      setSelectedTests(keys);
      setTestItems(keys);
      this.setState({ isAddOrRemove: false });
      message.info(`${row.id} was added`);
    } else {
      keys = keys.filter(item => item !== row.id);
      setSelectedTests(keys);
      setTestItems(keys);
      this.setState({ isAddOrRemove: true });
      message.info(`${row.id} was removed`);
    }
  };

  render() {
    const { isAddOrRemove } = this.state;
    const { data } = this.props;
    return (
      <FlexContainer justifyContent="space-between" style={{ fontWeight: 600, color: textColor, flexWrap: 'wrap' }}>
        <div>
          <FlexContainer>
            <div>
              <CategoryTitle>By:</CategoryTitle> <FirstText>{data.by}</FirstText>
            </div>
            <div>
              <CategoryTitle>ID:</CategoryTitle> <FirstText>{data._id}</FirstText>
            </div>
            <FlexContainer>
              <IconShare color={greenDark} /> <SecondText>{data.shared}</SecondText>
            </FlexContainer>
            <FlexContainer>
              <IconHeart color={greenDark} /> <SecondText>{data.likes}</SecondText>
            </FlexContainer>
          </FlexContainer>
          <TypeContainer>
            {data.standards &&
              !!data.standards.length && (
                <FlexContainer>
                  <Tags tags={data.standards} labelStyle={{ color: greenDark, background: white, border: `1px solid ${grey}` }} />
                </FlexContainer>
            )}
            {data.types &&
              !!data.types.length && (
                <FlexContainer>
                  <CategoryTitle>Type: </CategoryTitle>
                  {
                    data.types.map(type => (
                      <Tag color="cyan" key={type} style={{ marginTop: 3 }}>{type}</Tag>
                    ))
                  }
                </FlexContainer>
            )}
          </TypeContainer>
        </div>
        <StyledButton
          onClick={() => this.handleSelection(data)}
          style={{
            border: isAddOrRemove ? '1px solid #00b0ff' : '1px solid #ee1658',
            color: isAddOrRemove ? '#00b0ff' : '#ee1658',
          }}
        >
          {isAddOrRemove ? 'ADD' : 'REMOVE'}
        </StyledButton>
      </FlexContainer>
    );
  }
}

MetaInfoCell.propTypes = {
  data: PropTypes.object.isRequired,
  setSelectedTests: PropTypes.func.isRequired,
  selectedTests: PropTypes.array.isRequired,
  setTestItems: PropTypes.func.isRequired,
  selectedRows: PropTypes.object.isRequired,
};

const enhance = compose(
  withNamespaces('MetaInfoCell'),
  connect(
    state => ({
      selectedRows: getSelectedItemSelector(state),
    }),
    {
      setTestItems: setTestItemsAction,
    }
  )
);

export default enhance(MetaInfoCell);

const FirstText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${greenDark};
`;

const SecondText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #444444;
`;

const CategoryTitle = styled.span`
  font-size: 13px;
  color: #444444;
`;

const TypeContainer = styled.div`
  margin-top: 10px;
  margin-bottom: 15px;

  .ant-tag {
    background: rgba(0, 176, 255, 0.2);
    color: rgb(0, 131, 190);
  }
`;

const StyledButton = styled(Button)`
  width: 150px;
  height: 40px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: #00b0ff;
  border: 1px solid #00b0ff;
`;
