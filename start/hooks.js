const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
  const View = use('View')
  View.global('time', () => new Date().getTime())

  View.global('secret_string', function (str) {
    let secret = str.replace(/\n/g, '<br/>')

    return this.safe(`${secret}`)
  })
})