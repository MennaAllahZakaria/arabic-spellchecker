
const express = require('express');
const router = express.Router();
const { 
    correctTextService,
    validateWordService,
    addWordService,
    getAllWords,
    deleteWordService
} = require('../services/spellchecker.service');

router.post('/correct', correctTextService);
router.post('/validate', validateWordService);
router.post('/add', addWordService);
router.get('/words', getAllWords);
router.delete('/:word', deleteWordService);

module.exports = router;
