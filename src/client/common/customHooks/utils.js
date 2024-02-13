export const removePartialText = ({ EditorRef, stopSpeechToTextAndReset }) => {
  try {
    if (EditorRef?.current) {
      EditorRef.current?.selection?.save()
      const editorContent = EditorRef.current.html.get(true)
      const tempContainer = document.createElement('span')
      tempContainer.innerHTML = editorContent
      const spanToRemove = tempContainer.querySelector('#partial-stt')
      if (spanToRemove) {
        spanToRemove.parentNode.removeChild(spanToRemove)
        EditorRef.current.html.set(tempContainer.innerHTML)
      }
    }
  } catch (error) {
    console.log('error removePartialText', error)
    stopSpeechToTextAndReset(true)
  }
}
