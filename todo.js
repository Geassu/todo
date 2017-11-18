var fs = require('fs')

var express = require('express')
var bodyParser = require('body-parser')
var app = express()


var todoList = []

app.use(express.static('static_files'))

app.use(bodyParser.json())

var log = console.log.bind(console)

var sendHtml = (path, response) => {
    var options = {
        encoding: 'utf-8',
    }
    fs.readFile(path, options, (error, data) => {
        console.log(`读取的 html 文件 ${path} 内容是`, data)
        response.send(data)
    })
}

var sendJSON = (response, data) => {
    var r = JSON.stringify(data, null, 2)
    response.send(r)
}

app.get('/', (request, response) => {
    var path = 'index.html'
    var options = {
        encoding: 'utf-8',
    }
    fs.readFile(path, options, (error, data) => {
        response.send(data)
    })
})

app.get('/todo/all', (requrest, response) => {
    sendJSON(response, todoList)
})

var todoAdd = (form) => {
    log('form', form)
    if (todoList.length == 0) {
        form.id = 1
    } else {
        var lastTodo = todoList[todoList.length - 1]
        form.id = lastTodo.id + 1
    }
    todoList.push(form)
    return form
}

app.post('/todo/add', (request, response) => {
    var form = request.body
    var todo = todoAdd(form)
    sendJSON(response, todo)
})

var todoDelete = (id) => {
    id = Number(id)
    var index = -1
    for (var i = 0; i < todoList.length; i++) {
        var t = todoList[i]
        if (t.id == id) {
            index = i
            break
        }
    }
    if (index > -1) {
        var t = todoList.splice(index, 1)[0]
        return t
    } else {

        return {}
    }
}

app.get('/todo/delete/:id', (request, response) => {
    var id = request.params.id
    var todo = todoDelete(id)
    sendJSON(response, todo)
})

var server = app.listen(8080, (...args) => {
    var host = server.address().address
    var port = server.address().port
    console.log(`应用实例，访问地址为 http://${host}:${port}`)
})
