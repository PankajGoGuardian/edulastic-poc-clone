import { helpers } from "@edulastic/common";
import { PDFJSAnnotate } from "@edulastic/ext-libs";
import { setTestDataAction, setUndoStackAction } from "../../../TestPage/ducks";
import { getStore } from "../../../../configureStore";

let store = null;

window.addEventListener("load", () => {
  store = getStore();
});

const getAnnotations = documentId => {
  if (store && store.getState) {
    const state = store.getState();
    const storedAnnotations = state.tests?.entity?.annotations || state.test?.annotations || [];
    const annotations = storedAnnotations.filter(a => !a.questionId);
    return documentId ? annotations.filter(a => a.documentId == documentId) : annotations;
  }

  return [];
};

const updateAnnotations = (documentId, annotations = []) => {
  if (!store) {
    store = getStore();
  }

  if (store && store.getState) {
    const state = store.getState();
    store.dispatch(setUndoStackAction()); // reset redo stack logic
    const storedAnnotations = state.tests?.entity?.annotations || state.test?.annotations || [];
    const questionAnnotations = storedAnnotations?.filter(a => a.questionId);
    store.dispatch(setTestDataAction({ annotations: [...questionAnnotations, ...annotations] }));
  }
};

const findAnnotation = (documentId, annotationId) => {
  let index = -1;
  const annotations = getAnnotations(documentId);
  for (let i = 0, l = annotations.length; i < l; i++) {
    if (annotations[i].uuid === annotationId) {
      index = i;
      break;
    }
  }
  return index;
};

const generalGetHandler = (documentId, annotationId, className) =>
  new Promise(resolve => {
    resolve(getAnnotations(documentId).filter(i => i.class === className && i.annotation === annotationId));
  });

const generalAddHandler = (documentId, annotationId, content, className) =>
  new Promise(resolve => {
    const annotation = {
      documentId,
      class: className,
      uuid: helpers.uuid(),
      annotation: annotationId,
      content
    };
    const annotations = getAnnotations();
    annotations.push(annotation);
    updateAnnotations(documentId, annotations);
    resolve(annotation);
  });

const generalDeleteHandler = (documentId, annotationId) =>
  new Promise(resolve => {
    const annotations = getAnnotations();
    updateAnnotations(documentId, annotations.filter(({ uuid }) => uuid != annotationId));
    resolve(true);
  });

// StoreAdapter for working with redux-store
const PdfStoreAdapter = new PDFJSAnnotate.StoreAdapter({
  getAnnotations(documentId, pageNumber) {
    return new Promise(resolve => {
      const annotations = getAnnotations(documentId).filter(i => i.page === pageNumber && i.class === "Annotation");
      resolve({
        documentId,
        pageNumber,
        annotations
      });
    });
  },

  getAnnotation: (documentId, annotationId) =>
    Promise.resolve(getAnnotations(documentId)[findAnnotation(documentId, annotationId)]),

  addAnnotation(documentId, pageNumber, annotation) {
    return new Promise(resolve => {
      annotation.class = "Annotation";
      annotation.uuid = helpers.uuid();
      annotation.page = pageNumber;
      annotation.documentId = documentId;

      const annotations = getAnnotations();
      annotations.push(annotation);
      updateAnnotations(documentId, annotations);

      resolve(annotation);
    });
  },

  editAnnotation: (documentId, annotationId, annotation) =>
    new Promise(resolve => {
      const annotations = getAnnotations();
      updateAnnotations(documentId, annotations.map(a => (a.uuid == annotationId ? annotation : a)));
      resolve(annotation);
    }),

  deleteAnnotation: generalDeleteHandler,

  getComments: (documentId, annotationId) => generalGetHandler(documentId, annotationId, "Comment"),
  addComment: (documentId, annotationId, content) => generalAddHandler(documentId, annotationId, content, "Comment"),
  deleteComment: generalDeleteHandler,

  getVideos: (documentId, annotationId) => generalGetHandler(documentId, annotationId, "Video"),
  addVideo: (documentId, annotationId, content) => generalAddHandler(documentId, annotationId, content, "Video"),
  deleteVideo: generalDeleteHandler,

  getImages: (documentId, annotationId) => generalGetHandler(documentId, annotationId, "Image"),
  addImage: (documentId, annotationId, content) => generalAddHandler(documentId, annotationId, content, "Image"),
  deleteImage: generalDeleteHandler
});

export default PdfStoreAdapter;
