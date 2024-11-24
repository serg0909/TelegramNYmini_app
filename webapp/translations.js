class Translator {
    constructor() {
        this.translations = {};
        this.currentLanguage = 'en';
    }

    async loadTranslations(language) {
        try {
            const response = await fetch(`/translations/webapp/${language}.json`);
            this.translations[language] = await response.json();
        } catch (error) {
            console.error(`Error loading translations for ${language}:`, error);
            // Fallback to English if loading fails
            if (language !== 'en') {
                await this.loadTranslations('en');
            }
        }
    }

    async setLanguage(language) {
        // Default to English for unsupported languages
        this.currentLanguage = language.startsWith('ru') ? 'ru' : 'en';
        
        if (!this.translations[this.currentLanguage]) {
            await this.loadTranslations(this.currentLanguage);
        }
    }

    getText(key, replacements = {}) {
        const text = this.translations[this.currentLanguage]?.[key] || 
                    this.translations['en']?.[key] || 
                    `Missing translation: ${key}`;
        
        return Object.entries(replacements).reduce(
            (str, [key, value]) => str.replace(`%${key}%`, value),
            text
        );
    }
}

// Create global translator instance
const translator = new Translator();
