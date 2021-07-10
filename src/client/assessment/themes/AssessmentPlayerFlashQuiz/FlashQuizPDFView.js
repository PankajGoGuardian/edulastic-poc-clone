import React from 'react'
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'
import { lightGrey3, lightGrey4, white } from '@edulastic/colors'

const styles = StyleSheet.create({
  page: {
    backgroundColor: lightGrey3,
  },
  card: {
    margin: 20,
    padding: 20,
    height: '170px',
    backgroundColor: white,
    border: `2px dashed ${lightGrey4}`,
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export function PdfDocument({ data = [] }) {
  return (
    <Document>
      <Page style={styles.page}>
        {data.map((card) => {
          return (
            <>
              <View key={`${card.id}-f`} style={styles.card}>
                <Text>{card.frontStimulus}</Text>
              </View>
              <View key={`${card.id}-b`} style={styles.card}>
                <Text>{card.backStimulus}</Text>
              </View>
            </>
          )
        })}
      </Page>
    </Document>
  )
}
