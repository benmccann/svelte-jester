const fs = require('fs')
const path = require('path')

const configFilename = 'svelte.config.js'

exports.getSvelteConfig = (rootMode, filename, preprocess) => {
  let configFile = null

  if (typeof preprocess === 'boolean') {
    configFile = rootMode === 'upward'
      ? findConfigFile(path.dirname(filename))
      : getConfigFile(process.cwd())
  } else if (typeof preprocess === 'string') {
    configFile = preprocess
  }

  if (configFile === null || !fs.existsSync(configFile)) {
    throw Error(`Could not find ${configFilename}`)
  }

  return configFile
}

const getConfigFile = (searchDir) => {
  const filePath = path.resolve(searchDir, configFilename)
  if (fs.existsSync(filePath)) {
    return filePath
  }

  return null
}

const findConfigFile = (searchDir) => {
  const filePath = getConfigFile(searchDir)
  if (filePath !== null) {
    return filePath
  }

  const parentDir = path.resolve(searchDir, '..')
  return parentDir !== searchDir
    ? findConfigFile(parentDir)
    : null // Stop walking at filesystem root
}
