import express from 'express'

const router = express.Router()

import Bookmark from '../models/Bookmark.js'
import { authMiddleware } from '../utils/auth.js'

// Apply authMiddleware to all routes in this file
router.use(authMiddleware);


// GET All – Get all bookmarks
// This endpoint should return all the bookmarks that belong to the logged-in user.
router.get('/', async (req, res) => {
    try {
        const bookmarks = await Bookmark.find({
            user: req.user._id
        });

        res.json(bookmarks);

    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});


//return the bookmarks where the user field matches the _id of the currently authenticated user (req.user._id).
// GET /api/bookmark/id 

router.get('/:id', async (req, res) => {

    try {

        //===========================================================
        // GET /:id route bookmark, apply the same ownership check there as well
        //===========================================================
        const bookMark = await Bookmark.findById(req.params.id);

        if (!bookMark) {
            return res.status(404).json({ message: 'No bookMark found with this id!' });

        }

        if (bookMark.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'User is not authorized to access this BookMark.' });
        }

        res.json(bookMark);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// POST /api/bookmarks - Create a new Bookmark
router.post('/', async (req, res) => {
    try {
        const bookMark = await Bookmark.create({
            ...req.body,
            user: req.user._id,
        });

        res.status(201).json(bookMark);

    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// PUT /api/bookmark/:id - Update a bookmark
router.put('/:id', async (req, res) => {
    try {


        // This needs an authorization check
        // findByIdAndUpdate(): finds the product and updates it.
        // returnDocument: 'after' : returns the document after updating it.
        // { returnDocument: 'after' } is similar to { new: true }. It returns the updated document.
        const bookmark = await Bookmark.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!bookmark) {
            return res.status(404).json({ message: 'No bookmark found with this id!' });
        }

        // ==========================================================================
        // return the bookMark where the user field matches the _id of the currently authenticated user (req.user._id)
        // =============================================================================
        if (bookmark.user != req.user._id) {
            return res.status(403).json({ message: 'User is not authorized to update this bookmark' });
        }

        console.log('successfully updated a bookmark');

        res.json(bookmark)
    } catch (err) {
        res.status(500).json(err);
    }
});

// If the user is the owner, delete the bookmark
// If the user is not the owner, return a 403 Forbidden status with an appropriate error message.
// DELETE /api/notes/:id - Delete a bookmark 
router.delete('/:id', async (req, res) => {
    try {
        // 
        const bookmark = await Bookmark.findById(req.params.id);

        if (!bookmark) {
            return res.status(404).json({ message: 'No bookmark found with this id!' });
        }

        //  This needs an authorization check
        if (bookmark.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'User is not authorized to delete this Bookmark'
            });
        }

        // If the user is the owner, delete the note
        await Bookmark.findByIdAndDelete(req.params.id);

        res.json({ message: 'Bookmark deleted!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
});


export default router;
