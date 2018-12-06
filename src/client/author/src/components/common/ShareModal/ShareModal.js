import React from 'react';
import Modal from 'react-responsive-modal';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Radio, Input, Button, Row, Col } from 'antd';

import { FlexContainer } from '@edulastic/common';
import { mainBlueColor } from '@edulastic/colors';
import { IconClose, IconCopy } from '@edulastic/icons';


class ShareModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      address: '',
      shareType: 'everyone',
      peopleArray: [],
    };
  }

  addressHandler = (e) => {
    this.setState({ address: e.target.value });
  }

  radioHandler = (e) => {
    this.setState({ shareType: e.target.value });
  }

  removeHandler = (index) => {
    const { peopleArray } = this.state;
    const temp = peopleArray;
    temp.splice(index, 1);
    this.setState({ peopleArray: temp });
  }

  onShare = () => {
    const { address, shareType, peopleArray } = this.state;
    const temp = peopleArray;
    temp.push({ address, type: shareType, permission: ['assign'] });
    this.setState({ peopleArray: temp, address: '' });
  }

  render() {
    const { shareType, peopleArray } = this.state;
    const { isVisible, onClose } = this.props;
    return (
      <Modal
        open={isVisible}
        onClose={onClose}
        center
      >
        <ModalContainer>
          <h2 style={{ fontWeight: 'bold', fontSize: 20 }}>Share with others</h2>
          <ShareBlock>
            <span style={{ fontSize: 13, fontWeight: '600' }}>Share</span>
            <FlexContainer style={{ cursor: 'pointer' }}>
              <ShareTitle>
                <span>https://edulastic.com/assessment/76y8gyug-b8ug-8</span>
              </ShareTitle>
              <TitleCopy>
                <CopyIcon /> COPY
              </TitleCopy>
            </FlexContainer>
            {
              peopleArray.length !== 0 && (
              <ShareList>
                {
                  peopleArray.map((data, index) => (
                    <Row key={index} style={{ paddingBottom: 5, display: 'flex', alignItems: 'center' }}>
                      <Col span={12}>
                        {data.address}
                      </Col>
                      <Col span={11}>
                        {
                          data.permission.map(permission => (
                            <span>{permission}</span>
                          ))
                        }
                      </Col>
                      <Col span={1}>
                        <a onClick={() => this.removeHandler(index)}>
                          <CloseIcon />
                        </a>
                      </Col>
                    </Row>
                  ))
                }
              </ShareList>)
            }
          </ShareBlock>
          <PeopleBlock>
            <span style={{ fontSize: 13, fontWeight: '600' }}>People</span>
            <div style={{ margin: '10px 0px' }}>
              <Radio.Group value={shareType} onChange={e => this.radioHandler(e)}>
                <Radio value="everyone">Everyone</Radio>
                <Radio value="district">District</Radio>
                <Radio value="school">School</Radio>
                <Radio value="individuals">Individuals</Radio>
              </Radio.Group>
            </div>
            <FlexContainer style={{ marginTop: 5 }}>
              <Address
                placeholder="Enter names or email addresses"
                onChange={e => this.addressHandler(e)}
              />
              <ShareButton type="primary" onClick={() => this.onShare()}>
                SHARE
              </ShareButton>
            </FlexContainer>
            <FlexContainer flex={1} justifyContent="center" style={{ marginTop: 20 }}>
              <DoneButton type="primary" onClick={onClose}>
                DONE
              </DoneButton>
            </FlexContainer>
          </PeopleBlock>
        </ModalContainer>
      </Modal>
    );
  }
}

ShareModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ShareModal;

const ModalContainer = styled.div`
  width: 600px;
`;

const ShareBlock = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  padding-bottom: 25px;
  border-bottom: 1px solid #d9d6d6;
`;

const ShareTitle = styled.div`
  height: 35px;
  background-color: #f5f5f5;
  margin-top: 10px;
  border-radius: 4px;
  padding-left: 20px;
  display: flex;
  align-items: center;
  flex: 1;

  span {
    font-size: 13px;
    font-weight: 600;
  }
`;

const ShareList = styled.div`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  max-height: 110px;
  overflow: auto;
`;

const PeopleBlock = styled.div`
  margin-top: 25px;
  display: flex;
  flex-direction: column;

  .ant-radio {
    margin-right: 5px;
  }
`;

const Address = styled(Input)`
  padding-left: 20px;
  height: 35px;

  ::placeholder {
    font-size: 13px;
    font-style: italic;
  }
`;

const ShareButton = styled(Button)`
  height: 35px;
  width: 160px;
  background: ${mainBlueColor};
  border: none;
  span {
    font-size: 12px;
    font-weight: 600;
  }
`;

const DoneButton = styled(Button)`
  width: 200px;
  background: ${mainBlueColor};
  border: none;
  height: 35px;
  span {
    font-size: 11px;
    font-weight: 600;
  }
`;

const CloseIcon = styled(IconClose)`
  width: 11px !important;
  margin-top: 4px;
  fill: #4aac8b;
`;

const TitleCopy = styled.div`
  font-size: 11px;
  font-weight: 600;
  height: 30px;
  margin-top: 8px;
  color: ${mainBlueColor};
  display: flex;
  align-items: center;
`;

const CopyIcon = styled(IconCopy)`
  fill: ${mainBlueColor};
  margin-right: 8px;
  &:hover {
    fill: ${mainBlueColor};
  }
`;
