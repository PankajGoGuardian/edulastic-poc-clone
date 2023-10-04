import React from 'react'
import { launchAsync } from '@microsoft/immersive-reader-sdk'
import { fetchIRtokenAndSubDomain } from '@edulastic/api'
import { isUndefined } from 'lodash'
import { question } from '@edulastic/constants'

import { Tooltip } from 'antd'
import { notification, captureSentryException } from '@edulastic/common'
import { compose } from 'redux'
import { withNamespaces } from '@edulastic/localization'

const { IR_CONTENT_SELECTOR, IR_MCQ_LABEL_SELECTOR } = question

const ImmersiveReader = ({ t: i18translate, title, ImmersiveReaderButton }) => {
  const getImmersiveReaderArgs = async () => {
    try {
      const { token, subdomain } = await fetchIRtokenAndSubDomain()

      const chunks = []
      // eslint-disable-next-line func-names
      $(`.${IR_CONTENT_SELECTOR}`).each(function () {
        /** cloning jquery object to prevent modification in assessment player content, here we are manipulating html content. */
        const cloned = $(this).clone()
        $(cloned)
          .find(`.${IR_MCQ_LABEL_SELECTOR}`)
          // eslint-disable-next-line func-names
          .each(function () {
            const labelText = $(this).text()
            $(this).text(`${labelText} `)
          })
        const content = $(cloned).html()
        chunks.push({
          content,
          mimeType: 'text/html',
        })
      })

      const content = {
        title,
        chunks,
      }

      const options = {
        uiZIndex: 2000,
      }

      return [token, subdomain, content, options]
    } catch (error) {
      notification({
        messageKey: 'immersiveReaderFailedApiError',
      })
      captureSentryException(error, {
        errorMessage:
          'ImmersiveReader - failed to get Immersive reader token and sub-domain',
      })
    }
  }

  const handleLaunchImmersiveReader = async () => {
    try {
      const immersiveReaderArgs = await getImmersiveReaderArgs()
      if (!isUndefined(immersiveReaderArgs))
        await launchAsync(...immersiveReaderArgs)
    } catch (error) {
      notification({
        messageKey: 'immersiveReaderLaunchError',
      })
      captureSentryException(error, {
        errorMessage: 'ImmersiveReader - failed to launch Immersive reader',
      })
    }
  }

  return (
    <Tooltip
      placement="bottom"
      title={i18translate('assessmentPlayer.immersiveReaderToolTip')}
    >
      <ImmersiveReaderButton
        data-cy="immersiveReader"
        onClick={handleLaunchImmersiveReader}
      />
    </Tooltip>
  )
}

const enhance = compose(withNamespaces('common'))
export default enhance(ImmersiveReader)
