/* eslint no-console: "off" -- CLI app that gives users feedback */

const path = require('node:path')
const configChecker = require('..')
const assert = require('node:assert').strict

const configs = configChecker('test', path.join(__dirname, 'fixtures'))

/**
 * Checks if an array contains a file.
 * @param {string[]} c The array of configs to check.
 * @param {string} file The file to check for.
 * @returns {boolean} - True if the array contains the file.
 */
const arrayContains = (c = [], file = '') => c.includes(file)

assert.ok(arrayContains(configs, '.testrc'))
assert.ok(arrayContains(configs, '.config/testrc.ts'))

console.info('configChecker tests passed')
