/* eslint no-console: "off" -- This is a cli app that generates cli output */

const configurationPaths = require('../lib/configuration-paths')

const configItems = configurationPaths('`[module name]`')
const longestLine = configItems.reduce((a, b) => (a.length > b.length ? a : b), 0).length

const mdTable = configItems.map(file => {
  const diff = longestLine - file.length
  return `| ${file}${' '.repeat(diff)} |`
})

console.log('# Configuration files\n')

const header = 'Searched configuration files'
console.log(`| ${header}${' '.repeat(longestLine - header.length)} |`)
console.log(`| ${'-'.repeat(longestLine)} |`)

mdTable.forEach(line => console.log(line))
