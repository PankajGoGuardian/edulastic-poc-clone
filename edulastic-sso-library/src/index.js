class EdulasticLogin {
  constructor({ tokenProvider, getSignedData, redirectUrl }) {
    this.getSignedData = getSignedData
    this.tokenProvider = tokenProvider
    this.edulasticHeaders = {
      'Content-Type': 'application/json',
    }
    this.redirectUrlBase = redirectUrl
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
}

export { EdulasticLogin }
