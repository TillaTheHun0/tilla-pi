
import chalk from 'chalk'
import prettyjson from 'prettyjson'

import { execute, spawn, SpawnedProcess } from '@tilla-safe/utils'

import OPTS from './options.json'
import FLAGS from './flags.json'

const RASPI_VID = 'raspivid'
const RASPI_STILL = 'raspistill'

const STDOUT_OUTPUT = '-'

const DEFAULT_OPTS = {
  output: STDOUT_OUTPUT, // If the filename is '-', then all output is sent to stdout.
  height: 1024,
  width: 1024
}

const DEFAULT_VID_OPTS = {
  timeout: 0, // Will run until manually stopped with CTRL-C,
  framerate: 30
}

function toArray (config) {
  return Object.keys(config).reduce((acc, key) => {
    // Only include flags if they're set to true
    if (FLAGS.includes(key) && config[key]) {
      acc.push(`--${key}`)
    } else if (OPTS.includes(key)) {
      acc.push(`--${key}`, config[key])
    }

    return acc
  }, [])
}

/**
 * Capture an image
 *
 * the stdout of the process is resolved from the promise which resolves
 * when the image capture is complete
 *
 * @param {Object} options - options for configuring the image capture
 */
export async function snap (options) {
  options = Object.assign({}, DEFAULT_OPTS, options)

  try {
    console.log(`${chalk.blue(`Capturing image with options: `)} ${prettyjson.render(options)}`)
    let res = await execute(RASPI_STILL, toArray(options))
    console.log(`${chalk.green(`Successfully captured image`)}`)
    return res
  } catch (err) {
    console.log(`${chalk.red(`Failed to capture image`)}`)
    throw err
  }
}

/**
 * Captures a video
 *
 * An instance of SpawnProcess is resolved from the promise returned
 *
 * @param {Object} options - options for configuring the video capture
 */
export async function record (options) {
  options = Object.assign({}, DEFAULT_OPTS, DEFAULT_VID_OPTS, options)
  console.log(`${chalk.blue(`Capturing video with options: `)} ${prettyjson.render(options)}`)

  return new SpawnedProcess(await spawn(RASPI_VID, toArray(options)))
}
