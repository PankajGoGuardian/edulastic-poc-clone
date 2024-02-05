import React from 'react'
import { FireBaseService } from '@edulastic/common'

export const MoveDetectVideos = ({ testActivityId }) => {
	console.log('testActivityId',testActivityId);
  const doc = FireBaseService.useFirestoreRealtimeDocument(
    (db) => db.collection("timetracking").doc(testActivityId),
    [testActivityId]
  )

  console.log('got doc',doc);
  return (
    <div>
      {(doc?.moveDetectUrls || []).map((url) => (
        <video controls src={url} />
      ))}
    </div>
  )
}
