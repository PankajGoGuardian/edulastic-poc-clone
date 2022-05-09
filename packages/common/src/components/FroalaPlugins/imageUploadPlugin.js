/* eslint-disable func-names */
import { notification } from '@edulastic/common'
import { aws } from '@edulastic/constants'
import {
  uploadToS3,
  convertBlobToFile,
  canInsert,
  beforeUpload,
} from '../../helpers'
import { loadImage } from './helpers'
import { showProgressBar, hideProgressBar } from './CustomLoader'

function imageUploadPlugin(FroalaEditor) {
  FroalaEditor.PLUGINS.customImageUploadPlugin = function (editor) {
    function imageBeforeUpload(images) {
      this.popups.hideAll()
      showProgressBar()
      this.edit.off()

      if (
        !canInsert(this.selection.element()) ||
        !canInsert(this.selection.endElement()) ||
        !beforeUpload(images[0])
      ) {
        hideProgressBar()
        return false
      }

      // TODO: pass folder as props
      uploadToS3(images[0], aws.s3Folders.DEFAULT)
        .then((result) => {
          hideProgressBar()
          this.image.insert(result, false, null)
        })
        .catch((e) => {
          console.error(e)
          hideProgressBar()
          notification({ messageKey: 'imageUploadErr' })
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
      } finally {
        this.popups.hideAll()
        this.edit.on()
      }
      return false
    }

    function beforePasteUpload(img) {
      fetch(img.src)
        .then((res) => res.blob())
        .then((blob) => {
          const file = convertBlobToFile(blob)
          this.image.upload([file])
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
