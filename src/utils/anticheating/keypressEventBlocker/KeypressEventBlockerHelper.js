export const appendOverlayToBody = () => {
  const overlay = document.createElement('div')
  overlay.style.position = 'fixed'
  overlay.style.top = '0'
  overlay.style.left = '0'
  overlay.style.width = '100%'
  overlay.style.height = '100%'
  overlay.style.backgroundColor = 'white'
  overlay.style.display = 'none'
  overlay.style.zIndex = '1999'
  overlay.innerHTML = `
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
            <h1 style="text-align: center;color:black;font-family: Open Sans;">Your instructor will be notified if you take a screenshot during this assessment.</h1>
            <button 
            class="ant-btn ant-btn-primary" type="primary" 
            style="max-width: 300px;
            width: 150px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            text-transform: uppercase;
            background: #1AB394;
            border: solid 1px #1AB394;
            color: #fff;
            padding: 5px 20px;
            cursor: pointer;
            height: 40px;
            margin: auto;
            font-family: Open Sans;">
            I understand
            </button>
          </div>
        `
  document.body.appendChild(overlay)
  return overlay
}
