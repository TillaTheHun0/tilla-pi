import { exec, spawn as nodeSpawn } from 'child_process'

function parseCommand (params, base) {
  if (!params && base) {
    return base
  }

  if (!Array.isArray(params)) {
    throw new Error('params must be an array')
  }

  return `${base} ${params.join(' ')}`
}

export async function execute (command, args = []) {
  return new Promise((resolve, reject) =>
    exec(parseCommand(args, command), (err, stdout, stderr) => {
      if (stderr || err) {
        return reject(stderr || err)
      }
      return resolve(stdout)
    })
  )
}

export async function spawn (command, args = []) {
  return Promise.resolve(nodeSpawn(command, args))
}
