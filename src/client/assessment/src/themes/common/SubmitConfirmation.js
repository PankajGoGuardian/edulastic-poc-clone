import React, { Component } from 'react';
import styled from 'styled-components';
import Modal from 'react-responsive-modal';
import PropTypes from 'prop-types';
import { Button, Row, Col } from 'antd';

import { secondaryTextColor } from '@edulastic/colors';

class SubmitConfirmation extends Component {
  render() {
    const { isVisible, onClose, finishTest } = this.props;
    return (
      <ModalConfirmation
        open={isVisible}
        onClose={onClose}
        showCloseIcon={false}
        center
      >
        <ModalContainer>
          <Title>Are you sure?</Title>
          <TitleDescriptioin>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eget mauris nunc.
          </TitleDescriptioin>
          <ButtonContainer>
            <Row gutter={20} style={{ width: '100%' }}>
              <Col span={12}>
                <StyledButton btnType={1} onClick={onClose}>Cancel</StyledButton>
              </Col>
              <Col span={12}>
                <StyledButton type="primary" btnType={2} onClick={finishTest}>
                  Proceed
                </StyledButton>
              </Col>
            </Row>
          </ButtonContainer>
        </ModalContainer>
      </ModalConfirmation>
    );
  }
}

SubmitConfirmation.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  finishTest: PropTypes.func.isRequired
};

export default SubmitConfirmation;

const ModalConfirmation = styled(Modal)`
  border-radius: 5;  
  @media screen and (min-width: 768px) {
    min-width: 630px;
  }
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px 0px 25px 0px;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: bold;
  color: ${secondaryTextColor};
`;

const TitleDescriptioin = styled.div`
  font-size: 13px;
  font-weight: 600;
  margin-top: 12px;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 80%;
  margin-top: 60px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 40px;
  background: ${props => (props.btnType === 1 ? '#fff' : '#00b0ff')};
  border-color: #00b0ff;
  span {
    text-transform: uppercase;
    font-size: 11px;
    font-weight: 600;
    color: ${props => (props.btnType === 1 ? '#00b0ff' : '#fff')};
  }
`;
