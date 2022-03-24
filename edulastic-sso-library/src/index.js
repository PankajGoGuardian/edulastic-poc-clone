class EdulasticLogin {
  constructor({ tokenProvider, getSignedData, redirectUrl, element }) {
    this.getSignedData = getSignedData
    this.tokenProvider = tokenProvider
    this.edulasticHeaders = {
      'Content-Type': 'application/json',
    }
    this.redirectUrlBase = redirectUrl
    if (element) {
      /**
       * @type {HTMLElement}
       */
      let btnElement = element
      if (typeof element === 'string') {
        btnElement = document.querySelector(element)
      }
      const listener = () => {
        this.loginToEdulastic()
      }
      btnElement.addEventListener('click', listener)
      return () => btnElement.removeEventListener('click', listener)
    }
  }

  loginToEdulastic() {
    this.getSignedData.then(
      function (response) {
        fetch(this.tokenProvider, {
          method: 'POST',
          headers: { ...this.edulasticHeaders },
          body: JSON.stringify(response),
        })
          .then((res) => res.body)
          .then((data) => {
            const result = data.result
            if (result && result.authToken) {
              const url = `${this.redirectUrlBase}?token=${result.authToken}?userId=${result.id}?role=${result.role}`
              window.location.href = url
            }
          })
      },
      function (error) {
        console.log(error.message)
      }
    )
  }

  createButton(element, styles = {}) {
    const btn = document.createElement('button')
    btn.innerHTML = 'Login to Edulastic'
    btn.type = 'submit'
    btn.name = 'edulasticLoginBtn'
    btn.onclick = this.loginToEdulastic()
    for (const property in styles) {
      if (property) {
        btn.style[property] = styles[property]
      }
    }
    element.appendChild(btn)
    return {
      unmountEdulasticLoginButton() {
        btn.remove()
      },
    }
  }
}

export { EdulasticLogin }
