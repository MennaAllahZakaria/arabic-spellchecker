
const express = require('express');
const router = express.Router();
const { correctTextService } = require('../services/spellchecker.service');

router.post('/correct', correctTextService);

module.exports = router;
