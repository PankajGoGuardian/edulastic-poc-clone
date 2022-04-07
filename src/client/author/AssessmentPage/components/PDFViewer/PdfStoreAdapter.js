import { findIndex, uniqBy } from 'lodash'
import { helpers } from '@edulastic/common'
import { PDFJSAnnotate } from '@edulastic/ext-libs'
import { setTestDataAction, setUndoStackAction } from '../../../TestPage/ducks'
import {
  resetAnnotationUpdateAction,
  saveUserWorkAction,
} from '../../../../assessment/actions/userWork'
import { getStore } from '../../../../configureStore'

export class PdfStoreAdapter extends PDFJSAnnotate.StoreAdapter {
  constructor(testMode, reportMode, testItemId, annotations) {
    super()
    this.testMode = testMode
    this.reportMode = reportMode
    this.testItemId = testItemId
    this.annotations = annotations || []

    const _store = getStore()
    if (_store) {
      this.store = _store
    } else if (typeof window.getStore === 'function') {
      this.store = window.getStore()
    }
  }

  _findFromStore(documentId) {
    if (this.store && this.store.getState) {
      const state = this.store.getState()
      let annotations = []
      if (!this.reportMode && !this.testMode) {
        // authoring mode
        annotations =
          state.tests?.entity?.annotations || state.test?.annotations || []
        annotations = annotations.filter((a) => !a.questionId)
      } else if ((this.testMode || this.reportMode) && this.testItemId) {
        const stdWork =
          state?.userWork?.present?.[this.testItemId]?.freeNotesStd || []
        annotations = stdWork.concat(
          (this.annotations || []).map((a) => ({
            ...a,
            protected: true,
          }))
        )
      }
      return documentId
        ? annotations.filter((a) => a.documentId == documentId)
        : annotations
    }
    return []
  }

  _updateStore(documentId, annotations = []) {
    if (this.store && this.store.getState) {
      const state = this.store.getState()
      this.store.dispatch(resetAnnotationUpdateAction(true))
      if (!this.reportMode && !this.testMode) {
        const questionAnnotations = (
          state.tests?.entity?.annotations ||
          state.test?.annotations ||
          []
        )?.filter((a) => a.questionId)
        this.store.dispatch(setUndoStackAction()) // reset redo stack logic
        this.store.dispatch(
          setTestDataAction({
            annotations: uniqBy(
              [...questionAnnotations, ...annotations],
              'uuid'
            ),
          })
        )
      } else if (this.testItemId && this.testMode) {
        const userWork = state?.userWork?.present?.[this.testItemId]
        this.store.dispatch(
          saveUserWorkAction({
            [this.testItemId]: {
              ...userWork,
              freeNotesStd: [
                ...annotations.filter((x) => !x.questionId && !x.protected),
              ],
            },
          })
        )
      }
    }
  }

  _remove(documentId, annotationId) {
    const annotations = this._findFromStore().filter(
      ({ uuid }) => uuid !== annotationId
    )
    this._updateStore(documentId, annotations)
    return Promise.resolve(true)
  }

  _findByName(documentId, annotationId, className) {
    const annotations = this._findFromStore(documentId).filter(
      (a) => a.class === className && a.annotation === annotationId
    )
    return Promise.resolve(annotations)
  }

  _add(documentId, annotationId, content, className) {
    const annotation = {
      content,
      documentId,
      class: className,
      uuid: helpers.uuid(),
      annotation: annotationId,
    }
    const annotations = this._findFromStore()
    this._updateStore(documentId, [...annotations, annotation])

    return Promise.resolve(annotation)
  }

  getAnnotations(documentId, pageNumber) {
    return new Promise((resolve) => {
      const annotations = this._findFromStore(documentId).filter(
        (i) => i.page === pageNumber && i.class === 'Annotation'
      )
      resolve({
        documentId,
        pageNumber,
        annotations,
      })
    })
  }

  getAnnotation(documentId, annotationId) {
    const annotations = this._findFromStore(documentId)
    const annotationIndex = findIndex(
      annotations,
      (annotation) => annotation.uuid === annotationId
    )
    return Promise.resolve(annotations[annotationIndex])
  }

  addAnnotation(documentId, pageNumber, annotation = {}) {
    const newAnnotation = {
      ...annotation,
      documentId,
      class: 'Annotation',
      uuid: helpers.uuid(),
      page: pageNumber,
    }
    const annotations = this._findFromStore()

    this._updateStore(documentId, [...annotations, newAnnotation])
    return Promise.resolve(newAnnotation)
  }

  editAnnotation(documentId, annotationId, annotation) {
    const annotations = this._findFromStore().map((a) =>
      a.uuid === annotationId ? annotation : a
    )

    this._updateStore(documentId, annotations)
    return Promise.resolve(annotation)
  }

  deleteAnnotation(documentId, annotationId) {
    return this._remove(documentId, annotationId)
  }

  getComments(documentId, annotationId) {
    return this._findByName(documentId, annotationId, 'Comment')
  }

  addComment(documentId, annotationId, content) {
    return this._add(documentId, annotationId, content, 'Comment')
  }

  deleteComment(documentId, annotationId) {
    return this._remove(documentId, annotationId)
  }

  getVideos(documentId, annotationId) {
    return this._findByName(documentId, annotationId, 'Video')
  }

  addVideo(documentId, annotationId, content) {
    return this._add(documentId, annotationId, content, 'Video')
  }

  deleteVideo(documentId, annotationId) {
    return this._remove(documentId, annotationId)
  }

  getImages(documentId, annotationId) {
    return this._findByName(documentId, annotationId, 'Image')
  }

  addImage(documentId, annotationId, content) {
    this._add(documentId, annotationId, content, 'Image')
  }

  deleteImage(documentId, annotationId) {
    return this._remove(documentId, annotationId)
  }
}
