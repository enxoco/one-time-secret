'use strict'
const Redis = use('Redis')
const Hashids = require('hashids/cjs')
const hashids = new Hashids("one-time-secret", 2, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
const Encryption = use('Encryption')
const captcha = require('trek-captcha')


class UrlController {
    


    async PostShort({ request, response, session }) {
        // Get message from form submission
        const { short, captcha, ts } = request.all()
        let hash = await Redis.get(ts)
        let solution = Encryption.decrypt(hash)

        if (captcha && ts) {
            if (captcha != solution) {
                session.flash({ short: short})
                session.flash({ error: 'Captcha does not match.  Please Try Again'})
                return response.redirect('back')
            } 
        }

        Redis.del(ts)
        // Get number of site hits from Redis store and use it as an id.
        const id = await Redis.get('hits')

        // Use hashids to convert number of hits into a unique id
        const urlStr = hashids.encode(Number(id))

        // Store the original url using our unique id as the key
        await Redis.set(urlStr, short)

        // Build a unique url with our unique url
        session.flash({ linkUrl: `${request.headers().origin}/s/${urlStr}` })

        if (!captcha && !ts) {
            return response.json({'url': urlStr})
        }
        // Refresh the page so we can show our flash message.
        return response.redirect('back')
    }

    async GetShort({ response, view, params }) {

        // Get our unique id from the request url
        const id = params.id

        // Pull the original url from Redis using our unique id
        let url = await Redis.get(id)

        if (url === null) {// If this key no longer exists in Redis, send an error.
            return view.render('shortener', { error: 'Sorry this link has expired.' })
        } else {// If it does exists, redirect the user to the original url.
            return response.redirect(url)
        }
    }
}

module.exports = UrlController