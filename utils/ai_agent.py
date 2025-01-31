from ico_data import get_best_ico;
from yield_data import get_best_yield;
from flask import Flask, Blueprint, request, jsonify
from flask_cors import CORS
from openai import AsyncOpenAI
import asyncio
from dotenv import load_dotenv
import os

# Loading environment variables from the .env file
load_dotenv()

openai = os.getenv('OPENAI_KEY')

# Initialize Blueprint
ai_bp = Blueprint("ai", __name__)

async def generate_text(prompt):
    try:
        client = AsyncOpenAI(api_key=openai)
        completion = await client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "developer", "content": "You are a helpful assistant who analyzes given Icos and yield farming options and recommends the best"},
            {"role": "user", "content": prompt},
        ],
        )
        return completion.choices[0].message.content.strip()

    except Exception as e:
        print(f"OpenAI API Error: {e}")
        return None

async def generate_response(messages):
    try:
        client = AsyncOpenAI(api_key=openai)
        completion = await client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        )
        return completion.choices[0].message.content.strip()

    except Exception as e:
        print(f"OpenAI API Error: {e}")
        return None

@ai_bp.route("/ask-question", methods=["POST"])
def ask_question():
    prompt = request.json.get("messages")
    try:
        text = asyncio.run(generate_response(prompt))

        if text:
            return jsonify({"text": text})
        else:
            return jsonify({"error": "Failed to generate text"}), 500

    except Exception as e:
        print(f"Route Error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@ai_bp.route("/get-ico-data", methods=["GET"])
def get_best_ico_data():
    try:
        data = get_best_ico()

        if data:
            return jsonify({"data": data})
        else:
            return jsonify({"error": "Failed to get data"}), 500

    except Exception as e:
        print(f"Route Error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@ai_bp.route("/get-yield-data", methods=["GET"])
def get_best_yield_data():
    try:
        data = get_best_yield()
        
        if data:
            return jsonify({"data": data})
        else:
            return jsonify({"error": "Failed to get data"}), 500

    except Exception as e:
        print(f"Route Error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@ai_bp.route("/get-details", methods=["POST"])
def get_more_details():
    data_type = request.json.get("type")
    data_index = request.json.get("index")

    try:
        if data_type == 'ico':
            ico_data = get_best_ico()
            prompt = f"Analyze the following ICO: {ico_data[data_index]} and provide detailed information on why you'd recommend it."
            text = asyncio.run(generate_text(prompt))
            if text:
                return jsonify({"text": text})
            else:
                return jsonify({"error": "Failed to generate text"}), 500 

        elif data_type == 'yield':
            yield_data = get_best_yield()
            prompt = f"Analyze the following Yield farm option: {yield_data[data_index]} and provide detailed information on why you'd recommend it."
            text = asyncio.run(generate_text(prompt))
            if text:
                return jsonify({"text": text})
            else:
                return jsonify({"error": "Failed to generate text"}), 500 

    except Exception as e:
        print(f"Route Error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500