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
const NEW_LINE_SEPARATOR = '$$$___NEW_LINE___$$$'
const INPUT_MATH_SEPARATOR = '$$$___INPUT_MATH___$$$'

const ImmersiveReader = ({ t: i18translate, title, ImmersiveReaderButton }) => {
  const getImmersiveReaderArgs = async () => {
    try {
      const { token, subdomain } = await fetchIRtokenAndSubDomain()

      let chunks = []
      // eslint-disable-next-line func-names
      $(`.${IR_CONTENT_SELECTOR}`).each(function () {
        /** cloning jquery object to prevent modification in assessment player content, here we are manipulating html content. */
        const itemContent = $(this).clone()

        // Cloning again to keep a reference for fallback in case of an exception.
        const clonedItemContent = $(this).clone()

        $(itemContent)
          .find(`.${IR_MCQ_LABEL_SELECTOR}`)
          // eslint-disable-next-line func-names
          .each(function () {
            const labelText = $(this).text()
            $(this).text(`${labelText} `)
          })

        const questionMaths = $(itemContent).find('.input__math')
        if (questionMaths.length > 0) {
          try {
            // add new line for each div and p tags
            $(itemContent).find('div, p, ul, li, br').after(NEW_LINE_SEPARATOR)

            // remove math input with custom match string
            $(itemContent)
              .find('.input__math')
              .replaceWith(INPUT_MATH_SEPARATOR)

            // get all non math content
            const nonMathContents = $(itemContent)
              .text()
              .split(INPUT_MATH_SEPARATOR)

            // prepare chunks for IR
            nonMathContents.forEach((text, index) => {
              // joining all div and p with empty div for new line
              const content = `<span>${text
                .split(NEW_LINE_SEPARATOR)
                .join('<div></div>')}</span>`

              chunks.push({
                content,
                mimeType: 'text/html',
              })

              const mathContent = questionMaths?.[index]
              if (mathContent) {
                // reading mathML content
                const mathMLContent = $(mathContent).find('.katex-mathml')
                mathMLContent.find('semantics.edu').contents().unwrap()
                mathMLContent.find('annotation').remove()

                chunks.push({
                  content: mathMLContent.html(),
                  mimeType: 'application/mathml+xml',
                })
              }
            })
          } catch (err) {
            captureSentryException(err, {
              errorMessage: 'ImmersiveReader - unable to parse math content',
            })

            /**
             * falling back to current implementation by
             * Removing span.katex-mathml (non visible math latex) elements from the cloned HTML
             *  */

            $(clonedItemContent).find('span.katex-mathml').remove()

            chunks = []
            const content = $(clonedItemContent).html()
            chunks.push({
              content,
              mimeType: 'text/html',
            })
          }
        } else {
          const content = $(itemContent).html()
          chunks.push({
            content,
            mimeType: 'text/html',
          })
        }
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
