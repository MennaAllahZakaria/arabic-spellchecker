
const express = require('express');
const router = express.Router();
const { 
    correctTextService,
    validateWordService,

 } = require('../services/spellchecker.service');

router.post('/correct', correctTextService);
router.post('/validate', validateWordService);

module.exports = router;
