/**
 * A small helper utility to tag versions visible to ARCHIVED.
 *
 *
 */

;(function () {
  if (window.jQuery) return
  function l(u, i) {
    const d = document
    if (!d.getElementById(i)) {
      const s = d.createElement('script')
      s.src = u
      s.id = i
      d.body.appendChild(s)
    }
  }
  l('//code.jquery.com/jquery-3.2.1.min.js', 'jquery')
})()
;(async ($) => {
  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }

  function split(arr, n) {
    const res = []
    while (arr.length) {
      res.push(arr.splice(0, n))
    }
    return res
  }

  const delayMS = (t = 200) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(t)
      }, t)
    })

  const throttledPromises = (
    asyncFunction,
    items = [],
    batchSize = 5,
    delay = 1000
  ) =>
    new Promise(async (resolve, reject) => {
      const output = []
      const batches = split(items, batchSize)
      await asyncForEach(batches, async (batch) => {
        const promises = batch.map(asyncFunction).map((p) => p.catch(reject))
        const results = await Promise.all(promises)
        output.push(...results)
        await delayMS(delay)
      })
      resolve(output)
    })

  /** Start script */
  const versionNumbers = $('[data-test-id^="project-directories.versions"] > a')
    .map(function () {
      return $(this).attr('href')?.split('/').pop()
    })
    .filter((a) => a)
    .toArray()
  const promises = versionNumbers
    .map((key) => {
      const url = `https://snapwiz.atlassian.net/rest/api/2/version/${key}`

      return fetch(url, {
        headers: { 'content-type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify({ id: key, archived: true }),
      })
    })
    .filter((a) => a)

  await throttledPromises((a) => a, promises)
  // cp(`${rows}`); // comment prev line & uncomment if you don't want header

  console.log('==========================')
  console.log('YaY! Ran successfully. 🏃‍♂️🤓')
  console.log('==========================')
})(window.jQuery)
