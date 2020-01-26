'use strict'
const Hashids = require('hashids/cjs')
const hashids = new Hashids('one-time-secret', 10)
const Encryption = use('Encryption')
const Redis = use('Redis')

class SecretController {
    async PostSecret({ request, response, session }) {

        const host = request.headers().host
        const { secret } = request.all()
        const id = await hashids.encode(Math.round((new Date()).getTime() / 1000))
        const secMesg = Encryption.encrypt(secret)
        await Redis.set(id, secMesg)
        session.flash({ success: `${host}/secret/${id}` })
        return response.redirect('back')
    }

    async GetSecret({ view, params }) {
        const id = params.secret
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
