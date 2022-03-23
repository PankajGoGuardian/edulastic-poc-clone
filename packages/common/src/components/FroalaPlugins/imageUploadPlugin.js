/* eslint-disable func-names */
import { notification } from '@edulastic/common'
import { aws } from '@edulastic/constants'
import { uploadToS3, canInsert, beforeUpload } from '../../helpers'
import { loadImage } from './helpers'

function imageUploadPlugin(FroalaEditor) {
  FroalaEditor.PLUGINS.customImageUploadPlugin = function (editor) {
    function imageBeforeUpload(image) {
      this.image.showProgressBar()

      if (
        !canInsert(this.selection.element()) ||
        !canInsert(this.selection.endElement()) ||
        !beforeUpload(image[0])
      ) {
        this.image.hideProgressBar()
        return false
      }

      // TODO: pass folder as props
      uploadToS3(image[0], aws.s3Folders.DEFAULT)
        .then((result) => {
          this.image.insert(result, false, null)
        })
        .catch((e) => {
          console.error(e)
          notification({ messageKey: 'imageUploadErr' })
        })
        .finally(() => {
          this.image.hideProgressBar()
        })
      return false
    }

    async function imageInserted($img) {
      try {
        const { imageDefaultWidth } = editor.opts
        if (!$img[0].complete) {
          await loadImage($img[0].src)
          $img.css({
            verticalAlign: 'middle',
            width:
              $img[0].naturalWidth < imageDefaultWidth
                ? `${$img[0].naturalWidth}px`
                : `${imageDefaultWidth}px`,
          })
        }
      } catch (e) {
        notification({ messageKey: 'imageLoadErr' })
      }
    }

    function beforePasteUpload(img) {
      // DO NOT USE ASYNC/AWAIT
      fetch(img.src)
        .then((res) => res.blob())
        .then((blob) => {
          uploadToS3(blob, aws.s3Folders.DEFAULT)
            .then((result) => {
              this.image.insert(result, false, null)
            })
            .catch((e) => {
              console.error(e)
              notification({ messageKey: 'imageUploadErr' })
            })
        })
      img?.remove()
      return false
    }

    function _init() {
      editor.events.on('image.beforeUpload', imageBeforeUpload)
      editor.events.on('image.beforePasteUpload', beforePasteUpload)
      editor.events.on('image.inserted', imageInserted)
    }

    return {
      _init,
    }
  }
}

export default imageUploadPlugin
