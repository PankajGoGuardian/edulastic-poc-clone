/**
 * A small helper utility to create an csv from the Issue Navigator screen in jira.
 *
 * Author: Prithvi Raju M (prithvi.raju@snapwiz.com)
 * Note 🚨: You need to have a these columns enabled and seen in the page
 *           ASSIGNEE, STATUS, DEVOWNER, DEVELOPMENT
 *
 *
 * To Run:
 *  Go to Issue Navigator -> Open console -> Copy/Paste & Run the code -> Content Copied to clipboard.
 *
 */
;(async (cp, onlyToday) => {
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
  const issueKeys = $('[data-issuekey]')
    .map((_, a) => a.getAttribute('data-issuekey'))
    .toArray()

  const promises = issueKeys
    .map((key) => {
      const fusionId = $(`.fusion-widget[data-issue-key=${key}]`).attr(
        'data-issue-id'
      )
      if (!fusionId) return null
      return [
        `https://snapwiz.atlassian.net/rest/dev-status/1.0/issue/detail?issueId=${fusionId}&applicationType=GitHub&dataType=pullrequest&_=1597158970586`,
        `https://snapwiz.atlassian.net/rest/dev-status/1.0/issue/detail?issueId=${fusionId}&applicationType=GitHub&dataType=repository&_=1597158970586`,
      ]
    })
    .filter((a) => a)

  const responses = await throttledPromises(
    (a) => Promise.all(a.map((_a) => fetch(_a).then((__a) => __a.json()))),
    promises
  )
  const rows = issueKeys
    .reduce((agg, current, index) => {
      const resp = responses[index]

      const pullRequests = resp?.[0]?.detail?.[0]?.pullRequests || []
      const repos = resp?.[1]?.detail?.[0]?.repositories || []
      // accumulate each
      return agg.concat(
        pullRequests
          .filter((a) => {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const lastUpdate = new Date(a.lastUpdate)
            return onlyToday ? lastUpdate.getTime() > today.getTime() : true
          })
          .map((req) =>
            [
              req.lastUpdate,
              req.author.name,
              req.destination.branch,
              req.status,
              req.url,
              //   ,
              //   repos.reduce((_prev, repo) => {
              //     const commitStr = (repo.commits || []).map(r => `${r.author.name} => ${r.url}`).join(" | ");
              //     return _prev ? `${_prev} | ${commitStr}` : commitStr;
              //   }, "")
            ].map((k) => k || '---')
          )
      )
    }, [])
    .map((a) => a.join(';'))

  const title = [
    'Last Update',
    'Author',
    'Branch',
    'Status',
    'Url' /* , "Commits" */,
  ].join(';')

  cp(`${title}\n${rows.join('\n')}`)
  // cp(`${rows}`); // comment prev line & uncomment if you don't want header

  console.log('==========================')
  console.log('YaY! Ran successfully. 🏃‍♂️🤓')
  console.log('==========================')
})(window.copy, true)
