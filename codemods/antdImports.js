/**
 * Tranforms antd imports
 * from
 * `import {Row,Col} from 'antd'`
 *  to
 * `import Row from 'antd/es/row'
 * 	import Col from 'antd/es/col'`
 *
 * primarily to benefit from tree shaking
 *
 */
module.exports = function transformer(file, api) {
  const j = api.jscodeshift

  return j(file.source)
    .find(j.ImportDeclaration, { source: { value: 'antd' } })
    .forEach((path) => {
      const importedValues = path.value.specifiers.map((x) => x.imported.name)
      j(path).replaceWith(
        importedValues.map((x) =>
          j.importDeclaration(
            [j.importDefaultSpecifier(j.identifier(x))],
            j.literal(`antd/es/${x}`)
          )
        )
      )
    })
    .toSource()
}
module.exports.parser = 'babel'
