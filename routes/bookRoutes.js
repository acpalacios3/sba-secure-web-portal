import express from 'express'

const router = express.Router()

import Bookmark from '../models/Bookmark.js'
import { authMiddleware } from '../utils/auth.js'

// Apply authMiddleware to all routes in this file
router.use(authMiddleware);


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

        if (bookMark.user != req.user._id) {
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


export default router;
