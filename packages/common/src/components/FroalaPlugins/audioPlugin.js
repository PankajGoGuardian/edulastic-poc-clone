/* eslint-disable func-names */
import React from 'react'
import { aws } from '@edulastic/constants'
import _ from 'lodash'
import { IconWhiteMic, IconWhiteStop, IconTick } from '@edulastic/icons'

import { renderToString } from 'react-dom/server'

import { uploadToS3 } from '../../helpers'
import { getFormattedTimeInMinutesAndSeconds } from '../../../../../src/client/assessment/utils/timeUtils'
import SpinLoader from '../Spinner'

function audioPlugin(FE, onClickRecordAudio, onClickStopRecording) {
  if (window.jQuery) {
    $.extend(FE.POPUP_TEMPLATES, {
      'audio.insert':
        '[_BUTTONS_][_RECORD_AUDIO_][_BY_URL_LAYER_][_UPLOAD_LAYER_][_PROGRESS_BAR_]',
      'audio.edit': '[_BUTTONS_]',
    })
    $.extend(FE.DEFAULTS, {
      audioAllowedTypes: ['mp3', 'mpeg', 'x-m4a', 'wav'],
      audioEditButtons: [
        'audioReplace',
        'audioRemove',
        '|',
        'audioAutoplay',
        'audioAlign',
      ],
      audioInsertButtons: [
        'audioBack',
        '|',
        'audioRecord',
        'audioByURL',
        'audioUpload',
      ],
      audioMove: true,
      audioSplitHTML: false,
      audioUpload: true,
      audioUploadMethod: 'POST',
      audioUploadParam: 'file',
      audioUploadParams: {},
      audioUploadURL: 'https://i.froala.com/upload',
    })

    // This SVG icon is licensed under Apache 2.0 and was retrieved from
    // https://material.io/resources/icons/?search=audio&icon=volume_up&style=baseline
    $.extend(FE.SVG, {
      insertAudio:
        'M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1.2-9.1c0-.66.54-1.2 1.2-1.2.66 0 1.2.54 1.2 1.2l-.01 6.2c0 .66-.53 1.2-1.19 1.2-.66 0-1.2-.54-1.2-1.2V4.9zm6.5 6.1c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z',
    })

    FE.PLUGINS.audio = function (editor) {
      const MISSING_LINK = 1
      const ERROR_DURING_UPLOAD = 2
      const BAD_RESPONSE = 4
      const BAD_FILE_TYPE = 8

      const errorMessages = {
        [MISSING_LINK]: 'No link in upload response.',
        [ERROR_DURING_UPLOAD]: 'Error during file upload.',
        [BAD_RESPONSE]: 'Parsing response failed.',
        [BAD_FILE_TYPE]:
          'Unsupported file type - please provide an audio file.',
      }

      const bindInsertEvents = function ($popup) {
        // Drag over the droppable area.
        editor.events.$on(
          $popup,
          'dragover dragenter',
          '.fr-audio-upload-layer',
          function () {
            $(this).addClass('fr-drop')
            return false
          },
          true
        )

        // Drag end.
        editor.events.$on(
          $popup,
          'dragleave dragend',
          '.fr-audio-upload-layer',
          function () {
            $(this).removeClass('fr-drop')
            return false
          },
          true
        )

        // Drop.
        editor.events.$on(
          $popup,
          'drop',
          '.fr-audio-upload-layer',
          function (e) {
            e.preventDefault()
            e.stopPropagation()

            $(this).removeClass('fr-drop')

            const dt = e.originalEvent.dataTransfer

            if (dt && dt.files) {
              const inst = $popup.data('instance') || editor
              inst.events.disableBlur()
              inst.audio.upload(dt.files)
              inst.events.enableBlur()
            }
          },
          true
        )

        if (editor.helpers.isIOS()) {
          editor.events.$on(
            $popup,
            'touchstart',
            '.fr-audio-upload-layer input[type="file"]',
            function () {
              $(this).trigger('click')
            },
            true
          )
        }

        editor.events.$on(
          $popup,
          'change',
          '.fr-audio-upload-layer input[type="file"]',
          function () {
            if (this.files) {
              const inst = $popup.data('instance') || editor
              inst.events.disableBlur()
              $popup.find('input:focus').blur()
              inst.events.enableBlur()
              inst.audio.upload(this.files)
            }

            // Else IE 9 case.
            // Chrome fix.
            $(this).val('')
          },
          true
        )
      }

      const refreshInsertPopup = function () {
        const $popup = $(editor.popups.get('audio.insert'))
        const $inputs = $popup.find('input, button')
        $inputs.prop('disabled', false).val('').trigger('change')
      }

      /* eslint-disable camelcase */
      const initInsertPopup = function () {
        editor.popups.onRefresh('audio.insert', refreshInsertPopup)
        editor.popups.onHide('audio.insert', editor.audio.hideProgressBar)

        let buttonSpec = editor.opts.audioInsertButtons
        if (!editor.opts.audioUpload)
          buttonSpec = _.omit(buttonSpec, 'audioUpload')
        const buttons =
          buttonSpec.length < 2
            ? ''
            : `<div class="fr-buttons">
				  ${editor.button.buildList(buttonSpec)}
			  </div>`

        const record_audio = `<div class="fr-audio-record-layer fr-layer" id="fr-audio-record-layer-${
          editor.id
        }">
				  <div class="fr-input-line" style="display:flex;justify-items:center;align-items:center;flex-direction:column;">
            <button type="button" class="fr-command fr-submit" tabIndex="2" role="button" data-cmd="audioRecordStart" style="background-color:#1AB394;border-radius:50%;border:none;cursor:pointer;width:50px;height:50px;box-shadow:0 2px 5px 10px #c6c6c633; margin-bottom: 30px;">
               ${renderToString(<IconWhiteMic />)}
            </button>
            <p>Tap on mic to record</p>
            <small style="color: #666;"></small>
				  </div>
			  </div>`

        const by_url_layer = `<div class="fr-audio-by-url-layer fr-layer" id="fr-audio-by-url-layer-${
          editor.id
        }">
				  <div class="fr-input-line">
					  <input id="fr-audio-by-url-layer-text-${
              editor.id
            }" type="text" placeholder="${editor.language.translate(
          'Paste in an audio URL'
        )}" tabIndex="1" aria-required="true" />
				  </div>
				  <div class="fr-action-buttons">
					  <button type="button" class="fr-command fr-submit" data-cmd="audioInsertByURL" tabIndex="2" role="button">${editor.language.translate(
              'Insert'
            )}</button>
				  </div>
			  </div>`

        const accept = editor.opts.audioAllowedTypes
          .map((t) => `audio/${t}`)
          .join(',')
        const upload_layer = `<div class="fr-audio-upload-layer fr-file-upload-layer fr-layer" id="fr-audio-upload-layer-${
          editor.id
        }">
				  <strong>${editor.language.translate(
            'Drop audio'
          )}</strong><br />(${editor.language.translate('or click')})
				  <div class="fr-form">
					  <input type="file" accept="${accept}" tabIndex="-1" aria-labelledby="fr-audio-upload-layer-${
          editor.id
        }" role="button" />
				  </div>
			  </div>`

        const progress_bar = `<div class="fr-audio-progress-bar-layer fr-layer">
          <div style="display:flex;justify-items:center;align-items:center;">
            <div class="fr-loader" style="margin-right: 20px"></div>
            <h3 tabIndex="-1" class="fr-message"></h3>
          </div>
			  </div>`

        const $popup = editor.popups.create('audio.insert', {
          buttons,
          record_audio,
          by_url_layer,
          upload_layer,
          progress_bar,
        })
        bindInsertEvents($popup)
        return $popup
      }

      const showProgressMessage = function (message, progress) {
        const $popup = editor.popups.get('audio.insert')
        if (!$popup) return

        const $layer = $popup.find('.fr-audio-progress-bar-layer')
        $layer.find('h3').text(editor.language.translate(message))
        $layer.removeClass('fr-error')

        if (progress) {
          $layer.find('.fr-loader').html(renderToString(<IconTick />))
        } else {
          $layer
            .find('.fr-loader')
            .html(renderToString(<SpinLoader position="relative" />))
        }
      }

      const showProgressBar = function (message) {
        const $popup = editor.popups.get('audio.insert') || initInsertPopup()

        $popup
          .find('.fr-layer.fr-active')
          .removeClass('fr-active')
          .addClass('fr-pactive')
        $popup.find('.fr-audio-progress-bar-layer').addClass('fr-active')
        $popup.find('.fr-buttons').hide()

        if (message) showProgressMessage(message, 0)
      }

      const showErrorMessage = function (message) {
        showProgressBar()
        const $popup = editor.popups.get('audio.insert')
        const $layer = $popup.find('.fr-audio-progress-bar-layer')
        $layer.addClass('fr-error')
        const $messageHeader = $layer.find('h3')
        $messageHeader.text(editor.language.translate(message))
        editor.events.disableBlur()
        $messageHeader.focus()
      }

      const throwError = function (code, response) {
        editor.edit.on()
        showErrorMessage(errorMessages[code])
        editor.events.trigger('audio.error', [
          { code, message: errorMessages[code] },
          response,
        ])
      }

      const addNewAudio = function (src) {
        const data = {}
        const $audio = $(
          '<span contenteditable="false" draggable="true" class="fr-audio fr-uploading">' +
            '<audio controls="controls" class="fr-draggable" controlsList="nodownload"></audio>' +
            '</span>'
        )
        $audio.toggleClass('fr-draggable', editor.opts.audioMove)

        editor.events.focus(true)
        editor.selection.restore()

        editor.undo.saveStep()

        if (editor.opts.audioSplitHTML) {
          editor.markers.split()
        } else {
          editor.markers.insert()
        }

        editor.html.wrap()
        const $marker = editor.$el.find('.fr-marker')

        // Do not insert audio inside emoticon.
        if (
          editor.node.isLastSibling($marker) &&
          $marker.parent().hasClass('fr-deletable')
        ) {
          $marker.insertAfter($marker.parent())
        }

        $marker.replaceWith($audio)
        editor.selection.clear()

        const player = $audio.find('audio')
        player
          .text(
            editor.language.translate(
              'Your browser does not support HTML5 audio.'
            )
          )
          .on('canplaythrough loadeddata', function () {
            editor.popups.hide('audio.insert')
            $audio.removeClass('fr-uploading')
            editor.events.trigger('audio.loaded', [$audio])
          })
          .on('error', function (e) {
            editor.popups.hide('audio.insert')
            $audio.addClass('fr-error').removeClass('fr-uploading')
            editor.events.trigger('audio.error', [$audio, e])
          })
          .attr(_.mapKeys(data, (v, k) => `data-${_.kebabCase(k)}`))
          .attr({ src })

        return $audio
      }

      const insertHtmlAudio = function (link, response = '{}') {
        editor.edit.on()
        const $audio = addNewAudio(link, response)

        editor.undo.saveStep()
        editor.events.trigger('audio.inserted', [$audio, response])
      }

      return {
        _init() {
          // editor.events.$on(editor.$el, 'mousedown', 'span.fr-audio', function (
          //   e
          // ) {
          //   e.stopPropagation()
          // })
        },
        showInsertPopup() {
          if (!editor.popups.get('audio.insert')) initInsertPopup()

          // Find the first button and show its associated layer.
          editor.opts.audioInsertButtons.some(function (b) {
            if (b === 'audioRecord') {
              editor.audio.showLayer('audio-record')
              return true
            }
            if (b === 'audioByURL') {
              editor.audio.showLayer('audio-by-url')
              return true
            }
            if (b === 'audioUpload') {
              editor.audio.showLayer('audio-upload')
              return true
            }
            return false
          })
        },

        refreshRecordButton($btn) {
          const $popup = editor.popups.get('audio.insert')
          if ($popup.find('.fr-audio-record-layer').hasClass('fr-active')) {
            $btn.addClass('fr-active').attr('aria-pressed', true)
          }
        },
        refreshByURLButton($btn) {
          const $popup = editor.popups.get('audio.insert')
          if ($popup.find('.fr-audio-by-url-layer').hasClass('fr-active')) {
            $btn.addClass('fr-active').attr('aria-pressed', true)
          }
        },
        refreshUploadButton($btn) {
          const $popup = editor.popups.get('audio.insert')
          if ($popup.find('.fr-audio-upload-layer').hasClass('fr-active')) {
            $btn.addClass('fr-active').attr('aria-pressed', true)
          }
        },

        showLayer(name) {
          const $popup = editor.popups.get('audio.insert')
          editor.popups.setContainer('audio.insert', editor.$tb)

          let left
          let top
          const height = 0
          if (editor.opts.toolbarInline) {
            // Set top to the popup top.
            top =
              $popup.offset().top -
              editor.helpers.getPX($popup.css('margin-top'))

            // If the popup is above apply height correction.
            if ($popup.hasClass('fr-above')) top += $popup.outerHeight()
          } else {
            const $btn = editor.$tb.find('.fr-command[data-cmd="insertAudio"]')
            const offset = $btn.offset()
            left = offset.left + $btn.outerWidth() / 2
            top =
              offset.top +
              (editor.opts.toolbarBottom ? 10 : $btn.outerHeight() - 10)
          }
          // Show the new layer.
          $popup.find('.fr-layer').removeClass('fr-active')
          $popup.find(`.fr-${name}-layer`).addClass('fr-active')
          editor.popups.show('audio.insert', left, top, height)
          editor.accessibility.focusPopup($popup)
          editor.popups.refresh('audio.insert')
        },

        hideProgressBar(dismiss) {
          const $popup = editor.popups.get('audio.insert')
          if (!$popup) return

          $popup
            .find('.fr-layer.fr-pactive')
            .addClass('fr-active')
            .removeClass('fr-pactive')
          $popup.find('.fr-audio-progress-bar-layer').removeClass('fr-active')
          $popup.find('.fr-buttons').show()

          // Dismiss error message.
          const audios = editor.$el.find('audio.fr-error')
          if (dismiss || audios.length) {
            editor.events.focus()

            if (audios.length) {
              audios.parent().remove()
              editor.undo.saveStep()
              editor.undo.run()
              editor.undo.dropRedo()
            }

            editor.popups.hide('audio.insert')
          }
        },

        insertByURL(link) {
          if (!link) {
            const $popup = editor.popups.get('audio.insert')
            link = (
              $popup.find('.fr-audio-by-url-layer input[type="text"]').val() ||
              ''
            ).trim()
            // $popup.find('input, button').prop({ disabled: true })
          }

          if (!/^http/.test(link) && !link.includes('blob'))
            link = `https://${link}`
          insertHtmlAudio(link)
        },
        upload(audios) {
          showProgressBar()
          // Make sure we have what to upload.
          if (!(audios && audios.length)) return false

          // Check if we should cancel the upload.
          if (editor.events.trigger('audio.beforeUpload', [audios]) === false)
            return false

          const audio = audios[0]

          showProgressMessage('Uploading', 0)

          if (
            !_.includes(
              editor.opts.audioAllowedTypes,
              audio.type.replace(/audio\//g, '')
            )
          ) {
            throwError(BAD_FILE_TYPE)
            return false
          }

          if (!editor.drag_support.formdata) return false

          //   const formData = new FormData()
          //   _.each(editor.opts.audioUploadParams, (key, value) =>
          //     formData.append(key, value)
          //   )
          //   formData.append(editor.opts.audioUploadParam, audio)

          //   const url = editor.opts.audioUploadURL
          //   const xhr = editor.core.getXHR(url, editor.opts.audioUploadMethod)
          // showProgressBar('Uploading.....')
          uploadToS3(audio, aws.s3Folders.DEFAULT)
            .then((url) => {
              showProgressMessage('Successfully Uploaded', 100)
              setTimeout(() => {
                insertHtmlAudio(url)
              }, 1000)
            })
            .catch((e) => {
              console.error(e)
              editor.edit.on()
              editor.audio.hideProgressBar(true)
              throwError(BAD_RESPONSE, e)
            })

          // showProgressBar()
          editor.events.disableBlur()
          editor.edit.off()
          editor.events.enableBlur()

          //   const $popup = $(editor.popups.get('audio.insert'))
          //   if ($popup) {
          //     $popup.off('abortUpload').on('abortUpload', function () {
          //       if (xhr.readyState !== 4) xhr.abort()
          //     })
          //   }

          // Send data.
          //   xhr.send(formData)
          return true
        },
      }
    }

    let timer

    FE.DefineIcon('insertAudio', {
      NAME: 'volume-up',
      FA5NAME: 'volume-up',
      SVG_KEY: 'insertAudio',
    })
    FE.RegisterCommand('insertAudio', {
      title: 'Insert Audio',
      undo: false,
      focus: true,
      refreshAfterCallback: false,
      popup: true,
      callback() {
        if (!this.popups.isVisible('audio.insert'))
          return this.audio.showInsertPopup()
        if (this.$el.find('.fr-marker').length) {
          this.events.disableBlur()
          this.selection.restore()
        }
        return this.popups.hide('audio.insert')
      },
      plugin: 'audio',
    })

    FE.DefineIcon('audioRecord', { NAME: 'link', SVG_KEY: 'insertAudio' })
    FE.RegisterCommand('audioRecord', {
      title: 'Record Audio',
      undo: false,
      focus: false,
      toggle: true,
      callback() {
        this.audio.showLayer('audio-record')
      },
      refresh($btn) {
        this.audio.refreshRecordButton($btn)
      },
    })
    FE.RegisterCommand('audioRecordStart', {
      undo: true,
      focus: true,
      refreshAfterCallback: true,
      callback() {
        onClickRecordAudio()
        const $popup = this.shared.popups['audio.insert']
        const $layer = $popup.find('.fr-audio-record-layer')
        $layer.find('button').attr('data-cmd', 'audioRecordStop')
        $layer.find('button').html(renderToString(<IconWhiteStop />))
        let ms = 0
        let time = getFormattedTimeInMinutesAndSeconds(ms)
        $layer.find('p').html(`Recording ... | ${time}`)
        timer = setInterval(() => {
          ms += 1000
          time = getFormattedTimeInMinutesAndSeconds(ms)
          $layer.find('p').html(`Recording ... | ${time}`)
        }, 1000)
        $layer.find('small').html('Click to stop recording')
      },
    })
    FE.RegisterCommand('audioRecordStop', {
      undo: true,
      focus: true,
      callback() {
        onClickStopRecording()
        clearInterval(timer)
        timer = setInterval(() => {
          if (window.audioFile) {
            this.audio.upload([window.audioFile])
            clearInterval(timer)
            const $popup = this.shared.popups['audio.insert']
            const $layer = $popup.find('.fr-audio-record-layer')
            $layer.find('button').attr('data-cmd', 'audioRecordStart')
            $layer.find('button').html(renderToString(<IconWhiteMic />))
            $layer.find('p').html(`Tap on mic to record`)
            $layer.find('small').html('')
          }
        }, 100)
      },
    })

    FE.DefineIcon('audioByURL', { NAME: 'link', SVG_KEY: 'insertLink' })
    FE.RegisterCommand('audioByURL', {
      title: 'By URL',
      undo: false,
      focus: false,
      toggle: true,
      callback() {
        this.audio.showLayer('audio-by-url')
      },
      refresh($btn) {
        this.audio.refreshByURLButton($btn)
      },
    })

    FE.DefineIcon('audioUpload', { NAME: 'upload', SVG_KEY: 'upload' })
    FE.RegisterCommand('audioUpload', {
      title: 'Upload Audio',
      undo: false,
      focus: false,
      toggle: true,
      callback() {
        this.audio.showLayer('audio-upload')
      },
      refresh($btn) {
        this.audio.refreshUploadButton($btn)
      },
    })

    FE.RegisterCommand('audioInsertByURL', {
      undo: true,
      focus: true,
      callback(e) {
        console.log('insert url', e)
        this.audio.insertByURL()
      },
    })

    if (!FE.RegisterQuickInsertButton) return
    FE.RegisterQuickInsertButton('audio', {
      icon: 'insertAudio',
      requiredPlugin: 'audio',
      title: 'Insert Audio',
      undo: false,
      callback() {
        const src = prompt(
          this.language.translate(
            'Paste the URL of the audio you want to insert.'
          )
        )
        console.log('insert url', src)
        if (src) this.audio.insertByURL(src)
      },
    })
  }
}

export default audioPlugin
