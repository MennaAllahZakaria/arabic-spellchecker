const asyncHandler = require("express-async-handler");
const Word = require('../models/word.model');
const { normalizeArabic, getLevenshteinDistance } = require('../utils/textUtils');

async function checkWord(word) {
    const normalized = normalizeArabic(word);
    const isCorrect = await Word.exists({ word: normalized });

    if (isCorrect) return { original: word, correct: word, suggestions: [] };

    const allWords = await Word.find({}, { word: 1 });
    let suggestions = allWords
        .map(({ word: w }) => ({
        word: w,
        distance: getLevenshteinDistance(normalized, w),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3)
        .map(s => s.word);

    return { original: word, correct: suggestions[0], suggestions };
}

async function correctText(text) {
    const words = text.split(/\s+/);
    const correctedWords = await Promise.all(words.map(w => checkWord(w)));
    const correctedText = correctedWords.map(w => w.correct).join(' ');
    return { correctedText, details: correctedWords };
}


exports.correctTextService=asyncHandler(async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    try {
        const result = await correctText(text);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


exports.validateWordService = asyncHandler( async (req, res, next) => {
    try {
        const { word } = req.body;
        if (!word) return res.status(400).json({ message: 'Word is required' });

        const normalized = normalizeArabic(word);
        const isCorrect = await Word.exists({ word: normalized });

        if (isCorrect) {
            return res.status(200).json({
                word,
                isCorrect: true,
                suggestions: [],
            });
        }

        const allWords = await Word.find({}, { word: 1 });
        const suggestions = allWords
            .map(({ word: w }) => ({
            word: w,
            distance: getLevenshteinDistance(normalized, w),
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 3)
            .map(s => s.word);

        res.status(200).json({
            word,
            isCorrect: false,
            suggestions,
    });
    } catch (err) {
    next(err);
    }
});


exports.addWordService = asyncHandler (async (req, res, next) => {
    try {
        const { word } = req.body;
        if (!word) {
            return res.status(400).json({ message: 'Word is required' });
        }
    
        const normalized = normalizeArabic(word);
    
        const existing = await Word.findOne({ word: normalized });
        if (existing) {
            return res.status(409).json({ message: 'Word already exists' });
        }
    
        await Word.create({ word: normalized });
        res.status(201).json({ message: 'Word added successfully', word: normalized });
    } catch (err) {
        next(err);
    }
});