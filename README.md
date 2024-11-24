# Telegram Mini App - Winter Time Race Game 🎮 ❄️

A multilingual Telegram Mini App featuring a winter-themed racing game where players control a sleigh to avoid falling snowflakes. Built with Python, JavaScript, and MySQL.

## Features 🌟

### Game Features
- Interactive sleigh racing game with smooth controls
- Progressive difficulty system
- Real-time score tracking
- Responsive canvas-based graphics
- Winter-themed visual elements
- Multi-language support (English and Russian)

### Technical Features
- Telegram Bot integration
- User data tracking and analytics
- Secure database storage
- Responsive design for all devices
- Theme-aware UI (follows Telegram theme)

## Technology Stack 🛠

### Backend
- Python 3.8+
- Flask (Web Server)
- python-telegram-bot
- SQLAlchemy (ORM)
- MySQL (Database)

### Frontend
- HTML5 Canvas
- JavaScript (ES6+)
- CSS3
- Telegram Web App API

## Project Structure 📁

```
TelegramNYmini_app/
├── .env                    # Environment configuration
├── bot.py                  # Telegram bot handler
├── database.py            # Database models and interactions
├── server.py              # Flask web server
├── requirements.txt       # Project dependencies
├── translations/          # Localization files
│   ├── bot/              # Bot translations
│   │   ├── en.json
│   │   └── ru.json
│   └── webapp/           # Web app translations
│       ├── en.json
│       └── ru.json
└── webapp/               # Mini App frontend
    ├── index.html
    ├── game.js
    ├── gameEngine.js
    ├── translations.js
    └── styles.css
```

## Setup Instructions 🚀

### Prerequisites
1. Python 3.8 or higher
2. MySQL Server
3. Telegram Bot Token (from @BotFather)
4. HTTPS-enabled domain for hosting (required for Telegram Mini Apps)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/TelegramNYmini_app.git
cd TelegramNYmini_app
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Create a MySQL database

4. Configure environment variables in `.env`:
```env
BOT_TOKEN=your_bot_token_here
WEBAPP_URL=your_webapp_url_here
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=telegram_miniapp
```

5. Initialize the database:
```bash
python database.py
```

6. Start the Flask server:
```bash
python server.py
```

7. In a separate terminal, start the Telegram bot:
```bash
python bot.py
```

## Game Controls 🎮

- Use LEFT and RIGHT arrow keys to control the sleigh
- Avoid colliding with falling snowflakes
- Score points by surviving longer
- Game ends on collision with a snowflake

## Localization Support 🌍

The app automatically detects the user's language from their Telegram settings and displays content in either English or Russian. To add a new language:

1. Create new translation files in:
   - `translations/bot/[language_code].json`
   - `translations/webapp/[language_code].json`
2. Follow the existing translation file structure
3. Add the language code handling in `translations/bot_translator.py`

## Development 👨‍💻

### Running in Development Mode

1. Set up a local development environment:
```bash
python server.py --debug
```

2. For hot-reloading of frontend changes:
```bash
# If using a development server like live-server
live-server webapp
```

### Code Style
- Python: Follow PEP 8 guidelines
- JavaScript: ES6+ standards
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Security Considerations 🔒

- Never commit sensitive data (tokens, passwords)
- Use environment variables for configuration
- Implement rate limiting for API endpoints
- Validate all user input
- Keep dependencies updated

### Important Security Notes ⚠️

1. The repository includes a `.gitignore` file that prevents sensitive data from being committed. Never manually override these settings.
2. Sensitive files that should NEVER be committed:
   - `.env` files with environment variables
   - Configuration files with secrets
   - API tokens or credentials
   - Database credentials
   - Private keys or certificates
3. Always use environment variables for sensitive data
4. Review your commits before pushing to ensure no sensitive data is included
5. If you accidentally commit sensitive data:
   - Change all exposed credentials immediately
   - Contact repository maintainers
   - Consider using git-filter-branch to remove sensitive data from history

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 👏

- Telegram Team for the Mini Apps platform
- Python Telegram Bot community
- All contributors and testers

## Contact 📧

For questions and support, please open an issue in the GitHub repository or contact the maintainers directly.

---
Made with ❤️ for Telegram Mini Apps
