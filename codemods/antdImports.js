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
      const importedValues = path.value.specifiers.map(x => [x.local.name,x.imported.name]);
      j(path).replaceWith(
        importedValues.map(([localName,name]) =>
          j.importDeclaration(
            [j.importDefaultSpecifier(j.identifier(localName))],
            j.literal(`antd/es/${name.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').replace(/^-/,'').toLowerCase()}`)
          )
        )
      )
    })
    .toSource()
}
module.exports.parser = 'babel'
