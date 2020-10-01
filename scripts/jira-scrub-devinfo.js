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

;(async (cp, needCSVFormat) => {
  const issueKeys = $('[data-issuekey]')
    .map((_, a) => a.getAttribute('data-issuekey'))
    .toArray()
  const branchMap = {
    'No-Branches': [],
  }

  const csvAgg = {}

  const OwnersMap = issueKeys.reduce((prev, key) => {
    prev[key] = {
      assignee: $(`tr[data-issuekey=${key}] .assignee a`).html(),
      devOwner: $(`tr[data-issuekey=${key}] .customfield_10202 a`).html(),
      issueStatus: $(`tr[data-issuekey=${key}] .status span`).html(),
      issueUrl: `https://snapwiz.atlassian.net/browse/${key}`,
    }
    csvAgg[key] = {
      ...prev[key],
    }
    return prev
  }, {})

  const promises = issueKeys.map((key) => {
    const fusionId = $(`.fusion-widget[data-issue-key=${key}]`).attr(
      'data-issue-id'
    )
    if (!fusionId) return Promise.resolve('NA')
    return Promise.all([
      fetch(
        `https://snapwiz.atlassian.net/rest/dev-status/1.0/issue/detail?issueId=${fusionId}&applicationType=GitHub&dataType=pullrequest&_=1597158970586`
      ).then((a) => a.json()),
      fetch(
        `https://snapwiz.atlassian.net/rest/dev-status/1.0/issue/detail?issueId=${fusionId}&applicationType=GitHub&dataType=repository&_=1597158970586`
      ).then((a) => a.json()),
    ])
  })

  const responses = await Promise.all(promises)

  const finalOutput = issueKeys.reduce((prev, current, index) => {
    const _branchMap = { ...prev }
    const resp = responses[index]
    csvAgg[current] = csvAgg[current] || {}

    if (!resp || resp === 'NA') {
      _branchMap['No-Branches'].push(current)
      csvAgg[current].branch = 'No Branch'
    } else {
      const pullRequests = resp?.[0]?.detail?.[0]?.pullRequests || []
      const repos = resp?.[1]?.detail?.[0]?.repositories || []
      // accumulate each
      pullRequests.forEach((req) => {
        _branchMap[`${req.destination.branch}-${req.status}`] =
          _branchMap[req.destination.branch] || []
        _branchMap[`${req.destination.branch}-${req.status}`].push(current)
        csvAgg[current] = {
          ...csvAgg[current],
          branch: `${
            csvAgg[current].branch ? `${csvAgg[current].branch}|` : ''
          }${req.destination.branch}`,
          prStatus: `${
            csvAgg[current].prStatus ? `${csvAgg[current].prStatus} | ` : ''
          }${req.status}`,
          prAuthor: `${
            csvAgg[current].prAuthor ? `${csvAgg[current].prAuthor} | ` : ''
          }${req.author.name}`,
          prUrl: `${
            csvAgg[current].prUrl ? `${csvAgg[current].prUrl} | ` : ''
          }${req.url}`,
          commits: repos.reduce((_prev, repo) => {
            const commitStr = (repo.commits || [])
              .map((r) => `${r.author.name} => ${r.url}`)
              .join(' | ')
            return _prev ? `${_prev}|${commitStr}` : commitStr
          }, ''),
        }
      })
    }

    return _branchMap
  }, branchMap)

  if (needCSVFormat) {
    const title = [
      ...new Set(
        Object.keys(csvAgg)
          .slice(0, 3)
          .reduce((prev, curr) => prev.concat(Object.keys(csvAgg[curr])), [])
      ),
    ].join(',')

    const rows = Object.keys(csvAgg)
      .map((key) => Object.values(csvAgg[key]).join(','))
      .join('\n')
    cp(`${title}\n${rows}`)
    // cp(`${rows}`); // comment prev line & uncomment if you don't want header
  } else {
    cp({ OwnersMap, BranchReference: finalOutput })
  }
  console.log('==========================')
  console.log('YaY! Ran successfully. 🏃‍♂️🤓')
  console.log('==========================')
})(window.copy, true)
