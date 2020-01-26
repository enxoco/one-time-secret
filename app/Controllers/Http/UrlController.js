'use strict'
const Redis = use('Redis')
const Hashids = require('hashids/cjs')
const hashids = new Hashids()
class UrlController {

    async PostShort({ request, response, session }) {
        const { short } = request.all()
        const id = Date.now()
        const urlStr = hashids.encode(id)
        const status = await Redis.set(urlStr, short)
        const host = request.headers().origin
        session.flash({ linkUrl: `${host}/s/${urlStr}` })
        return response.redirect('back')
    }

    async GetShort({ request, response, view, params, session }) {
        const id = params.id
        let message = await Redis.get(id)
        if (message === null) {
            return view.render('shortener', { error: 'Sorry this link has expired.' })
        } else {
            return response.redirect(message)
        } 
    }
}

module.exports = UrlController