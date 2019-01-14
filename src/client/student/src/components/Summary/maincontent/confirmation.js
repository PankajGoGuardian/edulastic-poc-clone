import React, { Component } from 'react';
import styled from 'styled-components';
import Modal from 'react-responsive-modal';
import PropTypes from 'prop-types';
import { withNamespaces } from '@edulastic/localization';
import { compose } from 'redux';
import { Button, Row, Col } from 'antd';

import { secondaryTextColor } from '@edulastic/colors';

class Confirmation extends Component {
  render() {
    const { isVisible, onClose, finishTest, t } = this.props;
    return (
      <Modal
        open={isVisible}
        onClose={onClose}
        showCloseIcon={false}
        styles={{
          modal: {
            maxWidth: '640px',
            borderRadius: 5,
            textAlign: 'center',
            padding: '20px 30px'
          }
        }}
        center
      >
        <ModalContainer>
          <Title>{t('confirmation.submitAssignment')}</Title>
          <TitleDescriptioin>{t('confirmation.confirmationMessage')}</TitleDescriptioin>
          <ButtonContainer>
            <ButtonRow gutter={20}>
              <Col md={12} sm={24}>
                <StyledButton btnType={1} onClick={onClose}>
                  {t('default:cancel')}
                </StyledButton>
              </Col>
              <Col md={12} sm={24}>
                <StyledButton type="primary" btnType={2} onClick={finishTest}>
                  {t('default:submit')}
                </StyledButton>
              </Col>
            </ButtonRow>
          </ButtonContainer>
        </ModalContainer>
      </Modal>
    );
  }
}

Confirmation.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  finishTest: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

const enhance = compose(
  withNamespaces(['summary', 'default'])
);

export default enhance(Confirmation);


const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px 0px;
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

const ButtonRow = styled(Row)`
  width: 100%;
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
  @media screen and (max-width: 767px) {
    margin-top:10px;
  }
`;
