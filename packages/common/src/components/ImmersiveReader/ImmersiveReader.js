/* eslint-disable react/button-has-type */
import React, { useEffect } from 'react'
import { renderButtons, launchAsync } from '@microsoft/immersive-reader-sdk'
import { fetchIRtokenAndSubDomain } from '@edulastic/api'
import { isUndefined } from 'lodash'

import { notification, captureSentryException } from '@edulastic/common'
import EduButton from '../EduButton'

const ImmersiveReader = ({ title }) => {
  useEffect(() => {
    renderButtons()
  })

  const getImmersiveReaderArgs = async () => {
    try {
      const { token, subdomain } = await fetchIRtokenAndSubDomain()

      const chunks = []
      // eslint-disable-next-line func-names
      $('.immersive-reader-content').each(function () {
        chunks.push({
          content: $(this).html(),
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
    <EduButton
      className="immersive-reader-button"
      data-locale="en"
      btnType="primary"
      isGhost
      data-icon-px-size={20}
      onClick={() => handleLaunchImmersiveReader()}
    />
  )
}

export default ImmersiveReader
