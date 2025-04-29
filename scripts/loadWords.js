const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Word = require('../models/word.model');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, "../config.env") });
const dbConnection = require("../config/database");

dbConnection(); 

async function loadWords() {
  const filePath = './scripts/arabic-words.txt'; 
  const content = fs.readFileSync(filePath, 'utf-8');
  const words = content.split('\n').map(w => w.trim()).filter(Boolean);

  let inserted = 0;
  for (let word of words) {
    try {
      await Word.updateOne({ word }, { word }, { upsert: true });
      inserted++;
    } catch (e) {
      console.error(`خطأ في إدخال الكلمة "${word}"`);
    }
  }

  console.log(`✅ تم تحميل ${inserted} كلمة`);
  mongoose.disconnect();
}

loadWords();
