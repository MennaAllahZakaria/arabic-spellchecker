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


exports.getAllWords = asyncHandler(async(req,res ,next) => {
    try {
        // Pagination and Search Query
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const query = search ? { word: { $regex: search, $options: 'i' } } : {};

        // Count total documents
        const totalWords = await Word.countDocuments(query);

        // Fetch words with pagination and search
        const words = await Word.find(query)
        .skip((page - 1) * limit)
        .limit(limit);

        res.status(200).json({
        totalWords,
        currentPage: page,
        totalPages: Math.ceil(totalWords / limit),
        words,
        });
    } catch (err) {
        next(err);
    }
});


exports.getSpellcheckerStats = asyncHandler(async(req,res ,next) => {
    // Execute all queries in parallel
    const [totalWords, lastAddedWordDoc, mostSuggestedDoc] = await Promise.all([
        Word.countDocuments(),
        Word.findOne().sort({ _id: -1 }).limit(1),
        Word.findOne().sort({ suggestionCount: -1 }).limit(1),
    ]);

    // Extract data
    const lastAddedWord = lastAddedWordDoc ? lastAddedWordDoc.word : null;
    const mostSuggestedWord = mostSuggestedDoc ? mostSuggestedDoc.word : null;
    const suggestionCount = mostSuggestedDoc ? mostSuggestedDoc.suggestionCount : 0;

    return {
        totalWords,
        lastAddedWord,
        mostSuggestedWord,
        suggestionCount,
    };
})
exports.deleteWordService = asyncHandler(async (req, res) => {
    const { word } = req.params;

    if (!word) {
        return res.status(400).json({ error: 'Word is required' });
    }

    const normalized = normalizeArabic(word);

    const result = await Word.deleteOne({ word: normalized });

    if (result.deletedCount === 0) {
        return res.status(404).json({ error: `Word "${word}" not found` });
    }

    res.status(200).json({ message: `Word "${word}" deleted successfully` });
});