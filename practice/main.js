var http = require('http')
var fs = require('fs')
var url = require('url')
var qs = require('querystring')
let util = require('../util')
let path = require('path')
let sanitizeHtml = require('sanitize-html')

var app = http.createServer((request, response) => {
  var _url = request.url
  var queryData = url.parse(_url, true).query
  let pathName = url.parse(_url, true).pathname
  if (pathName === '/') {
    if (queryData.id === undefined) {
      let templateTitle = 'Hello WEB'
      let templateDesciption = 'wellcome to my page!'

      fs.readdir('./description', (err, descriptionList) => {
        let template = util.getTemplate(templateTitle, templateDesciption, descriptionList)

        response.writeHead(200)
        response.end(template)
      })
    } else {
      fs.readdir('./description', (err, descriptionList) => {
        let filterdTemplateTitle = path.parse(queryData.id).base
        let sanitizedTitle = sanitizeHtml(filterdTemplateTitle)
        fs.readFile(`./description/${sanitizedTitle}.txt`, 'utf8', (err, templateDesciption) => {
          let sanitizedDescription = sanitizeHtml(templateDesciption)
          let template = util.getTemplate(sanitizedTitle, sanitizedDescription, descriptionList)
          response.writeHead(200)
          response.end(template)
        })
      })
    }
  } else if (pathName === '/create') {
    let templateTitle = 'create page'
    let templateDesciption = `let's make page!`

    fs.readdir('./description', (err, descriptionList) => {
      let template = util.getTemplate(templateTitle, templateDesciption, descriptionList, 'create')

      response.writeHead(200)
      response.end(template)
    })
  } else if (pathName === `/edit`) {
    fs.readdir('./description', (err, descriptionList) => {
      let filterdTemplateTitle = path.parse(queryData.id).base
      let sanitizedTitle = sanitizeHtml(filterdTemplateTitle)
      fs.readFile(`./description/${sanitizedTitle}.txt`, 'utf8', (err, templateDesciption) => {
        let sanitizedDescription = sanitizeHtml(templateDesciption)

        let template = util.getTemplate(
          sanitizedTitle,
          sanitizedDescription,
          descriptionList,
          'edit'
        )

        response.writeHead(200)
        response.end(template)
      })
    })
  } else if (pathName === '/create_process') {
    let body = ''
    request.on('data', (data) => {
      body += data
      if (body.length > 1e6) {
        request.socket._destroy()
      }
    })
    request.on('end', () => {
      let createPost = new URLSearchParams(body)
      let title = createPost.get('title')
      let description = createPost.get('description')

      fs.writeFile(`description/${title}.txt`, description, 'utf8', (err) => {
        if (err) throw err
        response.writeHead(302, { location: encodeURI(`/?id=${title}`) })
        response.end(`success`)
      })
    })
  } else if (pathName === '/edit_process') {
    let body = ''
    request.on('data', (data) => {
      body += data
      if (body.length > 1e6) {
        request.socket._destroy()
      }
    })

    request.on('end', () => {
      let editPost = new URLSearchParams(body)
      let prevTitle = editPost.get('prevTitle')
      let title = editPost.get('title')
      let description = editPost.get('description')

      if (prevTitle === title) {
        fs.writeFile(`description/${title}.txt`, description, 'utf8', (err) => {
          if (err) throw err
          response.writeHead(302, { location: encodeURI(`/?id=${title}`) })
          response.end(`edit success`)
        })
      } else {
        fs.rename(`description/${prevTitle}.txt`, `description/${title}.txt`, (err) => {
          if (err) throw err
          fs.writeFile(`description/${title}.txt`, description, 'utf8', (err) => {
            if (err) throw err
            response.writeHead(302, { location: encodeURI(`/?id=${title}`) })
            response.end(`edit success`)
          })
        })
      }
    })
  } else if (pathName === '/delete_process') {
    let body = ''
    request.on('data', (data) => {
      body += data
    })

    request.on('end', () => {
      let deletePost = new URLSearchParams(body)
      let targetTitle = deletePost.get('deleteTitle')

      fs.rm(`./description/${targetTitle}.txt`, (err) => {
        if (err) throw err
        response.writeHead(302, { location: encodeURI(`/`) })
        response.end('remove success')
      })
    })
  } else {
    response.writeHead(404)
    response.end('Not found')
  }
})
app.listen(3000)
