
import fs from 'fs'

export class Capture {
  constructor ({ data, path }) {
    if (!data) {
      if (!path) {
        throw new Error('No data specified')
      }
    }

    this.data = Promise.resolve(data)

    // read the data from the provided path
    if (path) {
      this.data = this.data.then(() =>
        new Promise((resolve, reject) => {
          fs.readFile(path, (err, data) => {
            if (err) {
              return reject(err)
            }
            return resolve(data)
          })
        }).catch(err => {
          throw new Error(`Could not obtain video data due to err ${err.message}`)
        })
      )
    }
  }
}
