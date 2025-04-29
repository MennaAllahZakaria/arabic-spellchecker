# Arabic Spellchecker

This project is an Arabic spellchecker designed to identify and correct spelling errors in Arabic text. It aims to provide accurate and efficient spellchecking functionality for Arabic language applications.

## Features

- Detects and corrects spelling errors in Arabic text.
- Supports diacritics and non-diacritics.
- Customizable dictionary for specific use cases.
- Lightweight and easy to integrate into existing projects.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/MennaAllahZakaria/arabic-spellchecker.git
    ```
2. Navigate to the project directory:
    ```bash
    cd arabic-spellchecker
    ```
3. Install dependencies:
    ```bash
    npm install 
    ```


## 📡 API Endpoint

- #### Correct the text
  POST https://arabic-spellchecker.vercel.app/spellcheck/correct
  ###### Request Body (JSON):
  ```json
  {
    "text": "ادخا الكلمه هنا"
  }

  ```

  ###### Response:
  ```json
  {
    "correctedText": "ادخل الكلمه هنا",
    "details": [
      {
        "original": "ادخا",
        "correct": "ادخل",
        "suggestions": ["ادخل", "ادها", "ادعا"]
      },
      ...
    ]
  }

  ```

- #### Validate the word
    POST https://arabic-spellchecker.vercel.app/spellcheck/validate
  ###### Request Body (JSON):
  ```json
  {
    "word": "كلمت"
  }
  ```

  ###### Response:
  ```json
      {
      "word": "كلمت",
      "isCorrect": false,
      "suggestions": ["كلمة", "كلمات", "كلم"]
    }

  ```

-------
## Usage

Import the spellchecker module and use it in your Python project:

```python
from arabic_spellchecker import SpellChecker

checker = SpellChecker()
text = "ادخل النص هنا"
corrected_text = checker.correct(text)
print(corrected_text)
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push the branch.
4. Open a pull request.
🧪 Development
Nodemon is configured for development

Errors are handled using a custom ApiError and global middleware


## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For questions or feedback, please contact [your-email@example.com].