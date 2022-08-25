var http = require('http')
var fs = require('fs')
var url = require('url')
let util = require('../util')

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
        let templateTitle = queryData.id
        fs.readFile(`./description/${templateTitle}.txt`, 'utf8', (err, templateDesciption) => {
          let template = util.getTemplate(templateTitle, templateDesciption, descriptionList)
          response.writeHead(200)
          response.end(template)
        })
      })
    }
  } else {
    response.writeHead(404)
    response.end('Not found')
  }
})
app.listen(3000)
