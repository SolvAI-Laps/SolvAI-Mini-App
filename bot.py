from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, CallbackContext

from config import TELEGRAM_BOT_TOKEN

async def start(update: Update, context: CallbackContext):
    chat_id = update.effective_chat.id
    keyboard = [
        [InlineKeyboardButton("Launch Mini-App", web_app=WebAppInfo(url="https://profaibot.com"))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text("Welcome to the AI Mini App! Click below to launch.", reply_markup=reply_markup)

if __name__ == "__main__":
    app = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.run_polling()
