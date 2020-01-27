'use strict'
const Hashids = require('hashids/cjs')
const hashids = new Hashids("one-time-secret", 2, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");
const Encryption = use('Encryption')
const Redis = use('Redis')

class SecretController {
    async PostSecret({ request, response, session }) {
        const host = request.headers().origin
        const { secret } = request.all()
        const id = await Redis.get('hits')
        const urlStr = hashids.encode(Number(id))
        const secMesg = Encryption.encrypt(secret)
        await Redis.set(urlStr, secMesg)
        console.log(urlStr)
        session.flash({ success: `${host}/l/${urlStr}` })
        return response.redirect('back')
    }

    async GetSecret({ view, params }) {
        const id = params.id
        // Get our secret message
        let mesg = await Redis.get(id)
        // Immediately delete our secret  message
        await Redis.del(id)
        mesg = Encryption.decrypt(mesg)
        if (mesg != null){
            return view.render('secret', {mesg, valid: 1})
        } else {
            return view.render('secret', { valid: 0})
        }
    }
}

module.exports = SecretController
