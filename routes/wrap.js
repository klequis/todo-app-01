// https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/#cleaner-code-with-generators

const wrap = fn => (...args) => fn(...args).catch(args[2])

/* istanbul ignore next */
const w1 = fn => (...args) => {
  // yellow('wrap called with args', args)
  yellow('fn', fn)
  // yellow('args[0]', args[0]) // response 'IncomingMessage'
  // yellow('args[1]', args[1]) // response 'ServerResponse'
  // yellow('args[2]', args[2]) // next()
  fn.catch(e => {
    yellow('wrap: e', e)
  })
}

/* istanbul ignore next */
const w2 = fn => (...args) =>
  fn(...args).catch(() => {
    green('length', args.length)
    // green('args[0]', args[0])
    // green('args[1]', args[1]) // response
    // green('args[2]', args[2]) // next()
    args[2](args[0])
  })

export default wrap
