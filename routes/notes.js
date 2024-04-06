const express = require('express');
const router = express.Router()
const fetchuser = require('../middleware/fetchuser')
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator');

//Route 1: get all the notes: GET "/api/notes" and login require
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: "some error occured" })
    }
})

//Route 2: get all the notes: GET "/api/notes" and login require
router.post('/addnotes', fetchuser, [
    body('title', 'enter a valid title').isLength({ min: 3 }),
    body('description', 'desc must be atleast 4 char').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { title, description, tag } = req.body
        const note = new Notes({ title, description, tag, user: req.user.id })
        const savedNotes = await note.save()
        res.json(savedNotes)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: "some error occured" })
    }
})

//Route 3: update notes: PUT "/api/notes" and login require
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const {title, description, tag}= req.body;
    const newNote = {};
    if (title) {
        newNote.title = title
    }
    if (description) {
        newNote.description = description
    }
    if (tag) {
        newNote.tag = tag
    }
    // finding the note to be updated and updating it
    let note = await Notes.findById(req.params.id)
    if(!note){
        return res.status(404).send("not found")
    }
    if(note.user.toString() !== req.user.id){
        return res.status(404).send("not allowed")
    }

    note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
    res.json({note})

})

//Route 3: delete an existing notes: DELETE "/api/notes" and login require
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    const {title, description, tag}= req.body;
    try {
        let note = await Notes.findById(req.params.id)
            // finding the note to be deleted and delete it
        if(!note){
            return res.status(404).send("not found")
        }
        // authenting the correct user or else do not allow them 
        if(note.user.toString() !== req.user.id){
            return res.status(404).send("not allowed")
        }
    
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({success:"deleted successfully"})
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: "some error occured" })
    }

})
module.exports = router