const express = require('express')
const app = express()
const util = require('util')
const ejs = require('ejs')
const fs = require('fs')
const path = require('path')


const readFilePromise = util.promisify(fs.readFile)
const writeFilePromise = util.promisify(fs.writeFile)

app.use(express.static('public'))
app.use(express.json()) // Parse any incoming data

app.set('view engine', 'ejs')
app.set('port', process.env.PORT || 3000)

// Done
app.get('/', (req,res) => {
    res.sendFile('index.html')
})

//Done
app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, '/public', '/notes.html'))
})

//Done
app.get('/api/notes', readDataForDisplay ,(req,res) => {
    res.json(res.locals.allNotes)
})

async function readDataForDisplay(req,res,next){
    const data = await readFilePromise('./db/db.json')
    const parsedData = JSON.parse(data)
    res.locals.allNotes = parsedData
    next()
}

app.post('/api/notes', (req,res)=> {
    // This is when user uses the 
})

app.delete('/api/notes/:id', (req,res)=> {

})


app.listen(app.get('port'))