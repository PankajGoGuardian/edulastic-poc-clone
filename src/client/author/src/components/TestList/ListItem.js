import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FaAngleDoubleRight } from 'react-icons/fa';
import { blue, darkBlue, greenDark, grey } from '@edulastic/colors';
import { withNamespaces } from '@edulastic/localization';
import { IconHeart, IconShare } from '@edulastic/icons';
import { Card } from '@edulastic/common';
import { Rate, Row, Col } from 'antd';
import Tags from '../common/Tags';

class ListItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
  };

  moveToItem = () => {
    const { history, item, match } = this.props;
    history.push(`${match.url}/${item._id}`);
  };

  get name() {
    const {
      item: { createdBy },
    } = this.props;
    return `${createdBy.firstName} ${createdBy.lastName}`;
  }

  render() {
    const { item, t } = this.props;
    const { createdBy } = item;
    return (
      <Container>
        <ListCard
          title={(
            <Header>
              <Stars size="small" />
            </Header>
          )}
        />
        <Row gutter={32}>
          <Col span={12}>
            <Inner>
              <Question>
                <StyledLink onClick={this.moveToItem}>
                  {item.title}# <FaAngleDoubleRight />
                </StyledLink>
              </Question>
              <Description>
                {'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean fermentum metus et luctus lacinia. Nullam vel tincidunt nibh. Duis ac eros nunc.'}
              </Description>
            </Inner>
          </Col>
          <Col span={12}>
            <ItemInformation>
              <Row style={{ width: '100%', paddingTop: 15 }}>
                <Col span={6}>
                  <Author>
                    <span>
                      {`${t('component.item.by')}: `}
                    </span>
                    <AuthorName>{this.name}</AuthorName>
                  </Author>
                </Col>
                <Col span={6}>
                  <Author>
                    <span>ID: </span>
                    <AuthorName>{createdBy.id}</AuthorName>
                  </Author>
                </Col>
                <Col span={6}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconShare color={greenDark} />
                    &nbsp;
                    <span style={{ fontSize: 13 }}>{item.analytics.usage}</span>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconHeart color={greenDark} />
                    &nbsp;
                    <span style={{ fontSize: 13 }}>{item.analytics.likes}</span>
                  </div>
                </Col>
              </Row>
            </ItemInformation>
            <TypeContainer>
              {'Type: '}<Tags tags={item.tags} />
            </TypeContainer>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withNamespaces('author')(ListItem);

const Container = styled.div`
  display: flex;
  padding: 20px;
  border-bottom: 1px solid ${grey};
`;

const ListCard = styled(Card)`
  width: 190px;
  height: 106px;
  border-radius: 4px;

  .ant-card-body {
    padding: 0;
  }

  .ant-card-head {
    padding: 0;
  }

  .ant-card-head-title {
    padding: 0;
  }
`;

const Inner = styled.div`
  padding: 10px 0px 0px 25px;
`;

const Description = styled.div`
  font-size: 13px;
  color: #444444;
`;

const Author = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
`;

const AuthorName = styled.span`
  color: ${greenDark};
`;

const Header = styled.div`
  min-height: 100px;
  position: relative;
  background: url('https://fakeimg.pl/250x100/');
  background-repeat: no-repeat;
  background-size: cover;
`;

const Stars = styled(Rate)`
  position: absolute;
  top: 5px;
  left: 11px;
`;

const StyledLink = styled.a`
  font-size: 16px;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: ${blue};
  cursor: pointer;

  :hover {
    color: ${darkBlue};
  }
`;

const Question = styled.div`
`;

const ItemInformation = styled.div`
  display: flex;
`;

const TypeContainer = styled.div`
  margin-top: 15px;
  font-size: 13px;
  font-weight: 600;
  color: #444444;
`;
