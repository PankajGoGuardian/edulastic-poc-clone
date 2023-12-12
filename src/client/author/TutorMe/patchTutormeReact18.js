import ReactDOM from 'react-dom'

function execPatch() {
  if (ReactDOM.createRoot) {
    return
  }
  ReactDOM.createRoot = function (root) {
    return {
      render: (component) => {
        ReactDOM.render(component, root)
      },
    }
  }
}
execPatch()
