import os
from groq import Groq
from api.models import StrategyParams
from dotenv import load_dotenv 

load_dotenv()


def parse_chat_message(strategy_text: str) -> StrategyParams:
    """
    Extracts structured backtesting parameters from a single natural language text input,
    handling both recurring and one-time trade schemas.
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY environment variable is missing.")
        
    client = Groq(api_key=api_key)
    
    prompt = f"""
You are an AI Stock Backtesting Router. Analyze the user's input and determine if they are asking for a "recurring" strategy or a "one_time" historical trade.

User Query: "{strategy_text}"

Return a strict JSON object based on these two schemas:

Schema A (For Recurring Trades):
If the user mentions buying on a specific day of the week repeatedly (e.g., "buy every Monday"). Also extract any specific start or end dates in YYYY-MM-DD format.
Example Format: {{"strategy_type": "recurring", "ticker": "SUNPHARMA.NS", "buy_day": "Monday", "sell_day": "Friday", "start_date": "2025-01-01", "end_date": "2026-03-20", "capital": 10000}}

Schema B (For One-Time Trades):
If the user mentions specific historical dates (e.g., "invest on Jan 10 2025 and sell on March 20 2026"). Ignore any specific times (like 2:34 PM) as we only use End-of-Day data. Convert the dates to YYYY-MM-DD format.
Example Format: {{"strategy_type": "one_time", "ticker": "SUNPHARMA.NS", "start_date": "2025-01-10", "end_date": "2026-03-20", "capital": 10000}}

Schema C (For Stock News):
If the user ONLY asks for news about a stock on a specific date (e.g., "get me the news for Tata Motors on Jan 15 2026").
Example Format: {{"strategy_type": "news", "ticker": "TATAMOTORS.NS", "target_date": "2026-01-15"}}

Schema D (For Percentage Swings / Buy the Dip):
If the user mentions buying when a stock drops/falls by a specific PERCENTAGE (%), and selling when it rises/increases by a PERCENTAGE (%). Extract the percentages as pure integers/floats.
Example Format: {{"strategy_type": "percentage_swing", "ticker": "RELIANCE.NS", "buy_drop_pct": 5.0, "sell_rise_pct": 5.0, "start_date": "2022-01-01", "end_date": "2024-01-01", "capital": 100000}}

Fallbacks:
If the user is missing crucial data for either schema (such as the ticker symbol, capital amount, or the specific start and end dates/timeframe), do NOT proceed with parsing. Instead, trigger the fallback and return EXACTLY:
Example Format: {{"error": "Clarification needed", "message": "Could you please clarify the exact time period (start and end dates) and investment amount you'd like to backtest?"}}

If you encounter the fallback case, ensure the 'error' field is populated and 'message' contains a friendly question for clarification.
Ensure the extracted response strictly follows the StrategyParams JSON object structure for output.
    """
    
    # Support configuring model via env var, with sensible defaults and automatic fallbacks
    primary_model = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
    models_to_try = [primary_model, "openai/gpt-oss-20b", "qwen/qwen3.6-27b", "groq/compound"]
    
    # Remove duplicate model names while preserving order
    seen = set()
    models_to_try = [m for m in models_to_try if not (m in seen or seen.add(m))]
    
    last_exception = None
    for model_name in models_to_try:
        try:
            completion = client.chat.completions.create(
                model=model_name,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                response_format={"type": "json_object"},
                temperature=0.1,
            )
            
            rules = StrategyParams.model_validate_json(completion.choices[0].message.content)
            return rules
        except Exception as e:
            last_exception = e
            continue
            
    raise ValueError(f"Failed to parse strategy with AI using available models: {str(last_exception)}")

