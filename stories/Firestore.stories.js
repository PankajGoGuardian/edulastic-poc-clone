import React from "react";
import { Input } from "antd";
import * as Fbs from "@edulastic/common/src/Firebase";

import { storiesOf } from "@storybook/react";

function SimpleListenAndSet() {
  const doc = Fbs.useFirestoreRealtimeDocument(db => db.collection("test").doc("primaryKey"), []);
  return (
    <div>
      <h1>Open this page in other computer or tab</h1>
      <h2>testValue: {doc.value} </h2>
      <Input
        placeholder="enter a value..."
        onChange={e => {
          Fbs.db
            .collection("test")
            .doc("primaryKey")
            .set({ value: e.target.value });
        }}
        type="text"
      />
      ;
    </div>
  );
}

function Todos() {}

storiesOf("Firestore", module).add("simple listener and set", () => <SimpleListenAndSet />);
