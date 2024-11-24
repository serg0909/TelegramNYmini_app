import os
import logging
from dotenv import load_dotenv
from telegram import Update, WebAppInfo, KeyboardButton, ReplyKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes, MessageHandler, filters
from database import init_db, create_or_update_user
from translations.bot_translator import translator

# Load environment variables
load_dotenv()

# Enable logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)

# Initialize database
init_db()

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message with a button that opens the web app."""
    
    # Store user data in database
    user_data = update.effective_user.to_dict()
    create_or_update_user(user_data)
    
    # Get user's language
    language_code = update.effective_user.language_code or 'en'
    
    # Create button with web app
    web_app = WebAppInfo(url=os.getenv('WEBAPP_URL'))
    keyboard = [[KeyboardButton(
        text=translator.get_text('open_app_button', language_code),
        web_app=web_app
    )]]
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    
    await update.message.reply_text(
        translator.get_text('welcome_message', language_code),
        reply_markup=reply_markup
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message when the command /help is issued."""
    # Store user data in database
    user_data = update.effective_user.to_dict()
    create_or_update_user(user_data)
    
    # Get user's language
    language_code = update.effective_user.language_code or 'en'
    
    await update.message.reply_text(
        translator.get_text('help_message', language_code)
    )

def main() -> None:
    """Start the bot."""
    # Create the Application and pass it your bot's token.
    application = Application.builder().token(os.getenv('BOT_TOKEN')).build()

    # Add command handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))

    # Run the bot until the user presses Ctrl-C
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()