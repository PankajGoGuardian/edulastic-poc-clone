import { MeetFirebase } from '@edulastic/common'

const db = MeetFirebase

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
