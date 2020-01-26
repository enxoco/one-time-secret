'use strict'
const Redis = use('Redis')

class ConvertEmptyStringsToNull {
  async handle ({ request }, next) {
    const { tool } = request.all()
    if(tool){
      Redis.incr(tool)
    }

    Redis.incr('hits')
    if (Object.keys(request.body).length) {
      request.body = Object.assign(
        ...Object.keys(request.body).map(key => ({
          [key]: request.body[key] !== '' ? request.body[key] : null
        }))
      )
    }

    await next()
  }
}

module.exports = ConvertEmptyStringsToNull
