'use strict'
const Redis = use('Redis')

class ConvertEmptyStringsToNull {
  async handle ({ request }, next) {
    let hits = await Redis.get("hits")
    console.log(hits)
    if (hits) {
      Number(hits++)
      Redis.set("hits", hits)
    } else {
      Redis.set("hits", 1)
    }
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
