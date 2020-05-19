//@ts-check
import * as Firebase from "firebase/app";
// Required for side-effects
import "firebase/firestore";
import { firebaseConfig } from "../../../app-config";
import { useState, useEffect } from "react";

Firebase.initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId
});

export const db = Firebase.firestore();
//for debugging purposes if needed
if (process?.env?.NODE_ENV === "development") {
  window._firebase = Firebase;
  window._firedb = db;
}

/**
 *
 * Get realtime single document from firestore using primary key
 * Usage:
 *  const doc = useFirestoreRealtimeDocument((db)=> db.collection("items").doc("id"),[])
 *
 * @param {(db: import('firebase').firestore.Firestore) => Firebase.firestore.DocumentReference<Firebase.firestore.DocumentData>} queryFn funtcion which accepts firestore db and returns a document by querying
 * @param {Object[]} args array of dependencies for query , that need to change to re-run the query
 */
export function useFirestoreRealtimeDocument(queryFn, args) {
  const [doc, setDoc] = useState();
  useEffect(() => {
    const unsubscribeCallback = queryFn(db).onSnapshot(_doc => {
      setDoc(_doc.data());
    });
    return () => unsubscribeCallback();
  }, args);

  return doc;
}

/**
 * Get realtime multiple documents from firestore using general query
 * Usage:
 *  const pricedItems = useFirestoreRealtimeDocuments((db)=> db.collection("items").where("price",">",100),[]);
 *  const [bengaluruCity] = useFirestoreRealtimeDocuments((db)=> db.collection("city").where("name","==","bengaluru"),[]);
 *
 * @param {(db: import('firebase').firestore.Firestore) => Firebase.firestore.DocumentReference<Firebase.firestore.DocumentData>} queryFn funtcion which accepts firestore db and returns a document by querying
 */
export function useFirestoreRealtimeDocuments(queryFn, args) {
  const [docs, setDocs] = useState([]);
  useEffect(() => {
    const unsubscribeCallback = queryFn(db).onSnapshot(snapshot => {
      const initial = [];

      snapshot.forEach(_doc => {
        initial.push({ ..._doc.data(), __id: _doc.id });
      });

      setDocs(initial);

      snapshot.docChanges().forEach(change => {
        const id = change.doc.id;
        const data = change.doc.data();
        const newDoc = { ...data, __id: id };
        if (change.type === "added") setDocs(_docs => [..._docs, newDoc]);
        if (change.type === "modified") setDocs(_docs => _docs.map(item => (item.__id === id ? newDoc : item)));
        if (change.type === "removed") setDocs(_docs => _docs.filter(item => item.__id !== id));
      });
    });
    return () => unsubscribeCallback();
  }, args);
  return docs;
}
