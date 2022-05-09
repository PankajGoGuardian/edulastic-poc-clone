/**
 * A small helper utility to print a list of users by their issues.
 *
 * Author: Prithvi Raju M (prithvi.raju@snapwiz.com)
 * Note 🚨: You need to have a these columns enabled and seen in the page
 *           ASSIGNEE, STATUS
 *
 *
 * To Run:
 *  Go to Issue Navigator -> Open console -> Copy/Paste & Run the code -> Content Copied to clipboard.
 *
 */

;(async () => {
  $('.issuerow')
    .map(() => {
      const url = `snapwiz.atlassian.net${$(this)
        .find('[data-issue-key]')
        .attr('href')}`
      const assignee = $(this).find('[data-user]').html()
      return `${url}|${assignee}`
    })
    .toArray()
    .reduce((agg, curr, i, arr) => {
      if (typeof curr !== 'string') alert('No')
      const split = curr.split('|')
      agg[split[1]] = agg[split[1]] || []
      agg[split[1]].push(split[0])

      if (i === arr.length - 1) {
        return Object.keys(agg).reduce(
          (_agg, key) => `${_agg}\n\n${key}\n${(agg[key] || []).join('\n')}`,
          ''
        )
      }
      return agg
    }, {})
  console.log('==========================')
  console.log('YaY! Ran successfully. 🏃‍♂️🤓')
  console.log('==========================')
})(window.copy, true)
