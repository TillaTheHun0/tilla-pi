
import { EventEmitter } from 'events'
import { spawn } from 'child_process'
import * as stream from 'stream'

import chalk from 'chalk'
import { render } from 'prettyjson'

import { parseArgs, parseVideoArgs } from './utils/parseArgs'
import { spawnPromise } from './utils/spawnPromise'

import { SensorMode } from './SensorMode'
import { Codec } from './Codec'
import { Flip } from './Flip'
import { Rotation } from './Rotation'

const DEFAULT_OPTS = {
  rotation: Rotation.Rotate0,
  flip: Flip.None,
  fps: 30,
  codec: Codec.H264,
  sensorMode: SensorMode.AutoSelect
}

const noop = () => {}

export class PiCamera extends EventEmitter {
  constructor () {
    super()
    this.streams = []
    this.childProcess = undefined
  }

  // creates a new Readable stream and pushes onto array of streams to manage
  addStream () {
    const newStream = new stream.Readable({ read: noop })
    this.streams.push(newStream)
    return newStream
  }

  /**
   * Start video capture
   * You probably want to pipe the output of the stream returned
   * into another stream ie. into a writeStream to a file
   * or stream data directly to a server
   *
   * @param {Object} options - options object to pass to Camera
   * @returns {Promise<stream.Readable>} - a readable stream that will receive the data
   * emitted by the camera process
   */
  async startCapture (options) {
    return new Promise(async (resolve, reject) => {
      options = Object.assign({}, PiCamera.DEFAULT_OPTS, options)
      console.log(chalk.blue(`Capturing video with options ${render(options)}`))

      let newStream = this.addStream()

      this.childProcess = spawn('raspivid', parseVideoArgs(options))

      // Listen for error event to reject promise
      this.childProcess.once('error', () => {
        this.stopCapture()
        reject(new Error(`Could not start capture with StreamCamera. Are you running on a Raspberry Pi with 'raspivid' installed?`))
      })

      // Wait for first data event to resolve promise
      this.childProcess.stdout.once('data', () => resolve(newStream))

      // Listen for data events and emit onto each Readable stream
      this.childProcess.stdout.on('data', data => this.streams.forEach(stream => stream.push(data)))

      // Listen for error events and emit on root Emitter
      this.childProcess.stdout.on('error', err => this.emit('error', err))
      this.childProcess.stderr.on('data', data => this.emit('error', new Error(data.toString())))
      this.childProcess.stderr.on('error', err => this.emit('error', err))

      // Listen for close events and emit on root Emitter. Usually triggered by stopCapture()
      this.childProcess.stdout.on('close', () => this.emit('close'))
    })
  }

  /**
   * Kills the child process and sends null to all
   * managed streams.
   *
   * The managed streams are dropped
   *
   * @returns {Promise<>} - an empty Promise
   */
  async stopCapture () {
    console.log(chalk.blue(`Stopping video capture...`))
    this.childProcess && this.childProcess.kill()

    // close out each stream
    this.streams.forEach(stream => stream.destroy())
    this.streams = []
  }

  // Resolves to Buffer that contains image bytes
  async snap (options) {
    options = parseArgs(options)
    try {
      console.log(chalk.blue(`Snapping image with options ${render(options)}`))
      return spawnPromise('raspistill', parseArgs(options))
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new Error(`Could not take image. Are you running on a Raspberry Pi with 'raspistill' installed?`)
      }
      throw err
    }
  }

  static get DEFAULT_OPTS () {
    return DEFAULT_OPTS
  }
}
