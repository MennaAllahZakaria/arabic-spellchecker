
const express = require('express');
const router = express.Router();
const { 
    correctTextService,
    validateWordService,
    addWordService
 } = require('../services/spellchecker.service');

router.post('/correct', correctTextService);
router.post('/validate', validateWordService);
router.post('/add', addWordService);

module.exports = router;
