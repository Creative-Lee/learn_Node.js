const express = require('express')
const app = express()
const PORT = 3000
const fs = require('fs')
const template = require('./lib/template.js')
const path = require('path')
const qs = require('querystring')
const sanitizeHtml = require('sanitize-html')

app.get('/', (req, res) => {
  fs.readdir('./data', (error, filelist) => {
    var title = 'Welcome'
    var description = 'Hello, Node.js'
    var list = template.list(filelist)
    var html = template.HTML(
      title,
      list,
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>`
    )
    res.send(html)
  })
})

app.get('/page/:id', (req, res) => {
  fs.readdir('./data', function (error, filelist) {
    var filteredId = path.parse(req.params.id).base

    fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
      var title = req.params.id
      var sanitizedTitle = sanitizeHtml(title)
      var sanitizedDescription = sanitizeHtml(description, {
        allowedTags: ['h1'],
      })
      var list = template.list(filelist)
      var html = template.HTML(
        sanitizedTitle,
        list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        `<a href="/create">create</a>
          <a href="/update/${sanitizedTitle}">update</a>
          <form action="/delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
          </form>`
      )

      res.send(html)
    })
  })
})

app.get('/create', (req, res) => {
  fs.readdir('./data', (error, filelist) => {
    var title = 'WEB - create'
    var list = template.list(filelist)
    var html = template.HTML(
      title,
      list,
      `<form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
        <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
        <input type="submit">
        </p>
        </form>
        `,
      ''
    )
    res.send(html)
  })
})

app.post('/create_process', (req, res) => {
  console.log('post signal')
  var body = ''
  req.on('data', (data) => {
    body = body + data
  })
  req.on('end', () => {
    req.query
    var { title, description } = qs.parse(body)
    console.log(title, description)

    fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
      res.writeHead(302, { Location: `/page/${title}` })
      res.send()
    })
  })
})

app.get('/update/:id', (req, res) => {
  fs.readdir('./data', function (error, filelist) {
    var filteredId = req.params.id

    fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
      var title = filteredId
      var list = template.list(filelist)
      var html = template.HTML(
        title,
        list,
        `
          <form action="/update_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
            <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
            <input type="submit">
            </p>
          </form>
        `,
        `<a href="/create">create</a>`
      )

      res.send(html)
    })
  })
})

app.post('/update_process', (req, res) => {
  var body = ''
  req.on('data', function (data) {
    body = body + data
  })
  req.on('end', function () {
    var { id, title, description } = qs.parse(body)

    fs.rename(`data/${id}`, `data/${title}`, function (error) {
      fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
        res.redirect(`/page/${encodeURI(title)}`)
      })
    })
  })
})

app.post('/delete_process', (req, res) => {
  var body = ''
  req.on('data', function (data) {
    body = body + data
  })
  req.on('end', function () {
    var { id } = qs.parse(body)
    console.log(id)
    fs.unlink(`data/${id}`, function (error) {
      res.redirect('/')
    })
  })
})

app.listen(PORT, () => console.log(`It's running now - port: ${PORT}`))
