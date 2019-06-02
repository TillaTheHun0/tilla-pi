
const noop = () => {}

export class SpawnedProcess {
  constructor (process, { stdoutListener = noop, stderrListener = noop, complete = Promise.resolve(noop) }) {
    this.process = process // a process created from child_process.spawn()
    this.stdoutListener = stdoutListener
    this.stderrListener = stderrListener
    this.complete = complete

    this.data = []
    this.error = []

    this.setListeners()
  }

  complete () {
    this.process.kill('SIGTERM')
  }

  /**
   * Execute a fn when the process exits
   *
   * @param {Function} fn - the function to invoke when the process exits
   */
  onComplete (fn) {
    return this.complete.then(fn)
  }

  setListeners () {
    this.process.stdout.on('data', data => {
      this.data.push(data)
      this.stdoutListener(data)
    })

    this.process.stderr.on('data', data => {
      this.error.push(data)
      this.stderrListener(data)
    })

    this.complete = this.complete().then(() =>
      new Promise((resolve, reject) => {
        this.process.on('exit', () => {
          if (this.error.length) {
            return reject(this.error.join(''))
          }
          return resolve(this.data.join(''))
        })
      })
    )
  }
}
