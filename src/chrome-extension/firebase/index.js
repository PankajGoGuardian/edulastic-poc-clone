import { useState, useEffect } from 'react'
import firebase from 'firebase/app'

import 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAuhiIU4yWmVx5lyiZ8TDfb9cTr2B_sIkY',
  authDomain: 'edu-meet-dev.firebaseapp.com',
  databaseURL: 'https://edu-meet-dev.firebaseio.com',
  projectId: 'edu-meet-dev',
  storageBucket: 'edu-meet-dev.appspot.com',
  messagingSenderId: '414031562106',
  appId: '1:414031562106:web:2ed1cb00d9ea9f6b5142c3',
  measurementId: 'G-LXX5ZZEPN6',
}

firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()

export const useFirestoreRealtimeDocuments = (queryFn, args) => {
  const [docs, setDocs] = useState([])

  useEffect(() => {
    const unsubscribeCallback = queryFn(db).onSnapshot((querySnapshot) => {
      const queriedDocs = querySnapshot.map((_doc) => ({
        ..._doc.data(),
        __id: _doc.id,
      }))
      setDocs(queriedDocs)

      querySnapshot.docChanges().forEach((change) => {
        const id = change.doc.id
        const data = change.doc.data()
        const newDoc = { ...data, __id: id }
        if (change.type === 'added') setDocs((_docs) => [..._docs, newDoc])
        if (change.type === 'modified')
          setDocs((_docs) =>
            _docs.map((item) => (item.__id === id ? newDoc : item))
          )
        if (change.type === 'removed')
          setDocs((_docs) => _docs.filter((item) => item.__id !== id))
      })
    })

    return () => unsubscribeCallback()
  }, args)

  return docs
}

export default db
