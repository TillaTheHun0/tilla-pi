
import { spawn } from 'child_process'

export const spawnPromise = (command, args = [], options = undefined) =>
  new Promise((resolve, reject) => {
    const childProcess = spawn(command, args, options)

    let stdoutData = Buffer.alloc(0)
    let stderrData = Buffer.alloc(0)

    // stdout
    childProcess.stdout.on('data', data => {
      stdoutData = Buffer.concat([stdoutData, data])
    })

    // stderr
    childProcess.stderr.on('data', data => {
      stderrData = Buffer.concat([stderrData, data])
    })

    // immediatley reject Promise if any stream emits an error event
    childProcess.once('error', err => reject(err))
    childProcess.stdout.once('error', err => reject(err))
    childProcess.stderr.once('error', err => reject(err))

    // on process complete, Resolve/Reject the promise with the respective Buffer
    childProcess.stdout.on('close', () => {
      if (stderrData.length > 0) {
        return reject(new Error(stderrData.toString()))
      }

      return resolve(stdoutData)
    })
  })
