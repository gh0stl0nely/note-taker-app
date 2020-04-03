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
app.get('/', (req, res) => {
    res.sendFile('index.html')
})

//NOT DONE
app.get('/notes', (req, res) => {
    // WHEN GO HERE, we will read the file, use it in a template, and THEN serve it to them
    res.sendFile(path.join(__dirname, '/public', '/notes.html'))
})

app.get('/api/notes/:id', findData , (req,res) => {
    if(!res.locals.requestedContent){
        res.json({
            'message': 'Data not found'
        })
    } else {
        res.json(res.locals.requestedContent)
    }
})

async function findData(req,res,next){
    try{
        const id = req.params.id
        const database = await readFilePromise('./db/db.json')
        const parsedDatabase = JSON.parse(database)

        const requestedContent = parsedDatabase[id]

        res.locals.requestedContent = requestedContent; // topic and note
        next()
    }catch(e){
        throw e
    }
}

// Get all notes
app.get('/api/notes', readDataForDisplay, (req, res) => {
    res.json(res.locals.allNotes)
})

async function readDataForDisplay(req, res, next) {
    const data = await readFilePromise('./db/db.json')
    const parsedData = JSON.parse(data)
    res.locals.allNotes = parsedData
    next()
}

app.post('/api/notes', processRequest, (req, res) => {
    res.json({
        'status': 200,
        'message': 'Success'
    })
})

async function processRequest(req, res, next) {

    try {
        const incomingData = req.body
        const id = incomingData.selectedID
        const topic = incomingData.topic
        const note = incomingData.userNote

        let database = await readFilePromise('./db/db.json')
        let updatedDatabase = JSON.parse(database)
        console.log(updatedDatabase)
        updatedDatabase[id] = {
            topic,
            note
        }
        console.log(updatedDatabase)
        await writeFilePromise('./db/db.json', JSON.stringify(updatedDatabase))
        next()

    } catch (e) {
        throw e
    }

}

app.delete('/api/notes/:id', deleteItem, (req, res) => {
    res.json({
        'status': 200,
        'message': 'Delete Successfully'
    })
})

async function deleteItem(req,res,next) {
    try {
        const id = req.params.id
        const database = await readFilePromise('./db/db.json')
        let updatedDatabase = JSON.parse(database)
        delete updatedDatabase[id]
        await writeFilePromise('./db/db.json', JSON.stringify(updatedDatabase))
        next()
    } catch (e) {
        throw e
    }
}

app.listen(app.get('port'))