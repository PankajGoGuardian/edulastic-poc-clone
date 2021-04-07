import React from 'react'
import { CustomModalStyled } from '@edulastic/common'
import PropTypes from 'prop-types'
import moment from 'moment'
import { ModalBody } from './styled'

const ONE_YEAR = 365 * 24 * 60 * 60 * 1000

const SubscriptionAddonModal = ({
  isVisible,
  handleCloseModal,
  title,
  modalDescription,
  children,
  footer = null,
  shouldProrate = true,
  subEndDate = Date.now(),
}) => {
  const newExtendingExpiry =
    !shouldProrate && moment(subEndDate + ONE_YEAR).format('DD MMM, YYYY')
  return (
    <CustomModalStyled
      centered
      title={title}
      footer={footer}
      visible={isVisible}
      onCancel={handleCloseModal}
      modalWidth="510px"
      width="510px"
      destroyOnClose
    >
      <ModalBody>
        {modalDescription ? (
          <p>{modalDescription}</p>
        ) : (
          <>
            <p>
              The Spark add-ons bundle premium content with some exciting
              software features to make it super easy for you to use.
              <br />
              <a
                href="https://edulastic.com/spark-math/"
                target="_blank"
                rel="noreferrer"
                data-cy="sparkContentLink"
              >
                Click here
              </a>{' '}
              to learn more.
            </p>
            {!shouldProrate && (
              <p>
                Since you have less than 3 months left in your premium
                subscription, you will need to renew the premium subscription to
                make this purchase. As a bonus, you will get to use your add-on
                product(s) for the additional time until expiration for free.
                Both the premium and the add-on subscription will expire on
                &nbsp; &nbsp;
                {newExtendingExpiry}
              </p>
            )}
            <p> These add-ons need the premium or enterprise subscription.</p>
          </>
        )}
        {children}
      </ModalBody>
    </CustomModalStyled>
  )
}

SubscriptionAddonModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
}

export default SubscriptionAddonModal
