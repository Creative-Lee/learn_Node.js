let getTemplate = (templateTitle, templateDesciption, descriptionList, option) => {
  let getForm = (title, description, actionPath) =>
    `<form action="${actionPath}" method="post">
  <input type="hidden" name='prevTitle' value='${title}'/>
  <input type="text" name="title" value='${title}' placeholder='title'/>
  <textarea name="description" placeholder='description'>${description}</textarea>
  <input type="submit"/>
  </form>`

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
      <div>
      ${option === 'create' ? '' : `<a href="/create">create</a>`}    
      ${
        option === 'edit' || option === 'create'
          ? ''
          : `<a href='/edit?id=${templateTitle}'>edit</a>`
      }  
      ${
        option === 'delete'
          ? ''
          : `
          <form action='/delete_process' method='post'> 
          <input type='hidden' name='deleteTitle' value='${templateTitle}'>
          <input type='submit' value='delete'>
          </form>`
      }
      
      ${option === 'edit' ? '' : `<h2>${templateTitle}</h2><p>${templateDesciption}<p>`}   
      </div>
      <div> 
      ${option === 'create' ? getForm('', '', `/create_process`) : ''}
      ${option === 'edit' ? getForm(templateTitle, templateDesciption, '/edit_process') : ''}
      </div>
    </body>
  </html>
`
  return template
}

exports.getTemplate = getTemplate
