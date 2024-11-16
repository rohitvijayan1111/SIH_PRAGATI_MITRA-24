import React, { useState } from 'react';
import axios from 'axios';

const TranslateComponent = () => {
    const [text, setText] = useState('');
    const [language, setLanguage] = useState('es'); // Default target language: Spanish
    const [translatedText, setTranslatedText] = useState('');

    const handleTranslate = async () => {
        try {
            const response = await axios.post('http://localhost:3000/translate', {
                text,
                targetLanguage: language,
            });
            setTranslatedText(response.data.data.translations[0].translatedText);
        } catch (error) {
            console.error('Error translating text:', error);
        }
    };

    return (
        <div>
            <h1>Google Translate API Integration</h1>
            <textarea
                placeholder="Enter text to translate"
                value={text}
                onChange={(e) => setText(e.target.value)}
            ></textarea>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
                {/* Add more language options as needed */}
            </select>
            <button onClick={handleTranslate}>Translate</button>
            {translatedText && <p>Translated Text: {translatedText}</p>}
        </div>
    );
};

export default TranslateComponent;
