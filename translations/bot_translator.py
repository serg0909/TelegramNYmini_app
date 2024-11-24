import json
import os

class BotTranslator:
    def __init__(self):
        self.translations = {}
        self._load_translations()

    def _load_translations(self):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        bot_translations_dir = os.path.join(current_dir, 'bot')
        
        for filename in os.listdir(bot_translations_dir):
            if filename.endswith('.json'):
                language = filename.split('.')[0]
                with open(os.path.join(bot_translations_dir, filename), 'r', encoding='utf-8') as f:
                    self.translations[language] = json.load(f)

    def get_text(self, key: str, language_code: str = 'en') -> str:
        """Get translated text for the given key and language."""
        # Default to English if language not supported
        if language_code.startswith('ru'):
            lang = 'ru'
        else:
            lang = 'en'
            
        return self.translations.get(lang, self.translations['en']).get(key, f"Missing translation: {key}")

# Create a global instance
translator = BotTranslator()
