'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// L for one time secret routes
Route.get('/l/:id', 'SecretController.GetSecret')
Route.post('/l', 'SecretController.PostSecret')
Route.get('/l', 'SecretController.GetForm')
Route.get('/captcha/:ts', 'SecretController.GetCaptcha')
// S for link shortener routes
Route.get('/s/:id', 'UrlController.GetShort')
Route.post('/s', 'UrlController.PostShort')
Route.on('/s').render('shortener')

// Wildcard route for everything else.
Route.get('/', 'SecretController.GetForm')
Route.get('/:url', 'SecretController.GetForm')