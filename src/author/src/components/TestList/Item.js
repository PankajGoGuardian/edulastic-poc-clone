import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FaAngleDoubleRight } from 'react-icons/fa';
import { blue, darkBlue, lightBlue, greenDark, grey } from '@edulastic/colors';
import { withNamespaces } from '@edulastic/localization';
import { IconHeart, IconShare } from '@edulastic/icons';
import { Card } from '@edulastic/common';
import { Rate } from 'antd';

class Item extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
  };

  moveToItem = () => {
    const { history, item, match } = this.props;
    history.push(`${match.url}/${item.id}`);
  };

  get name() {
    const {
      item: { createdBy },
    } = this.props;
    return `${createdBy.firstName} ${createdBy.lastName}`;
  }

  render() {
    const { item, t } = this.props;
    console.log(item);
    return (
      <Container
        title={(
          <Header>
            <Stars />
          </Header>
)}
      >
        <Inner>
          <Question>
            <StyledLink onClick={this.moveToItem}>
              {item.title}# <FaAngleDoubleRight />
            </StyledLink>
          </Question>
          <Labels>
            {item.tags.map((tag, i) => (
              <Label key={i}>{tag.name}</Label>
            ))}
          </Labels>
        </Inner>
        <Footer>
          <Author>
            <span>
              {t('component.item.by')}
              :&nbsp;
            </span>{' '}
            <AuthorName>{this.name}</AuthorName>
          </Author>
          <Icons>
            <div>
              <IconHeart color={greenDark} />
              &nbsp;
              <span>9</span>
            </div>
            <div>
              <IconShare color={greenDark} />
              &nbsp;
              <span>9578 (1)</span>
            </div>
          </Icons>
        </Footer>
      </Container>
    );
  }
}

export default withNamespaces('author')(Item);

const Container = styled(Card)`
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
  padding: 15px;
  border-bottom: 1px solid ${grey};
`;

const Footer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Author = styled.div`
  width: 70%;
  padding: 15px;
  display: flex;
  align-items: center;
  border-right: 1px solid ${grey};
`;

const AuthorName = styled.span`
  color: ${greenDark};
`;

const Icons = styled.div`
  display: flex;
  padding: 15px;
  width: 30%;
  display: flex;
  flex-direction: column;
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
  bottom: 5px;
  right: 5px;
`;

const StyledLink = styled.a`
  font-size: 16px;
  font-weight: 600;
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
  margin-bottom: 15px;
`;

const Labels = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Label = styled.span`
  text-transform: uppercase;
  border-radius: 10px;
  padding: 10px;
  color: ${darkBlue};
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 7px;
  margin-bottom: 7px;
  background: ${lightBlue};
  font-weight: 700;

  :last-child {
    margin-right: 0;
  }
`;
