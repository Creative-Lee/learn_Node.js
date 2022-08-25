let getTemplate = (templateTitle, templateDesciption, descriptionList) => {
  let template = `
<!doctype html>
    <html>
    <head>
      <title>WEB1 - ${templateTitle}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <ul>
      ${descriptionList
        .map((e, idx) => {
          let splited = e.split('')
          splited.splice(-4, 4)
          let descriptionName = splited.join('')
          return `<li><a href='/?id=${descriptionName}'>${descriptionName}</a></li>`
        })
        .join('')}
      </ul>
      <h2>${templateTitle}</h2>
      <p>${templateDesciption}<p>
    </body>
  </html>
`
  return template
}

exports.getTemplate = getTemplate
