'use strict'
const Redis = use('Redis')

class ConvertEmptyStringsToNull {
  async handle ({ request }, next) {
    const { tool } = request.all()
    let hits = await Redis.get("hits")
    if(tool){
      let toolHits = await Redis.get(tool)
      if(toolHits){
        Number(toolHits++)
        Redis.set(tool, toolHits)
        request.secrets = toolHits
      } else {
        Redis.set(tool, 1)
      }
    }
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
