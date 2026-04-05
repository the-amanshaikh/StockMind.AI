from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from api.models import ChatRequest, BacktestResult, TaxCalcRequest
from strategy_parser.parser import parse_chat_message
from data_fetcher.fetcher import fetch_data
from backtest_engine.engine import run_backtest
from data_fetcher.news import fetch_historical_news
from utils.taxes import calculate_indian_taxes
from database import init_db, log_prompt, get_all_prompts, SavedPrompt
from typing import List

app = FastAPI(title="Stock Mindfull AI API")

# Add CORS middleware for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Expand this if deploying to un-trusted domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

@app.post("/api/chat", response_model=BacktestResult)
async def chat_endpoint(req: ChatRequest):
    try:
        # LOG INCOMING PROMPT
        log_prompt(req.text)
        
        # 1. Parse Strategy intent from text
        strategy = parse_chat_message(req.text)
        
        # If the AI requires clarification (missing stock, etc), return it immediately
        if strategy.error or not strategy.strategy_type:
            safe_message = strategy.message or strategy.error or "Could you please tell me which stock you'd like to backtest?"
            return BacktestResult(
                text_response=safe_message,
                win_rate=0.0,
                buys=0,
                sells=0,
                total_invested=0.0,
                final_value=0.0,
                profit=0.0,
                return_percentage=0.0,
                transactions=[],
                equity_curve_dates=[],
                equity_curve_values=[],
                news_articles=[]
            )
            
        # 2a. Intercept News Request
        if strategy.strategy_type == "news":
            ticker = strategy.ticker or "Unknown"
            date = strategy.target_date or "Today"
            articles = fetch_historical_news(ticker, date)
            return BacktestResult(
                text_response=f"Here are the top headlines for {ticker} around {date}.",
                win_rate=0.0, buys=0, sells=0, total_invested=0.0, final_value=0.0, profit=0.0, return_percentage=0.0, transactions=[], equity_curve_dates=[], equity_curve_values=[],
                news_articles=articles
            )
            
        # 2b. Fetch Data
        if not strategy.ticker:
            raise ValueError("Ticker missing despite no clarification requested.")
            
        df = fetch_data(strategy.ticker)
        
        # 3. Process strictly in-memory using Pandas
        results = run_backtest(df, strategy)
        
        return results
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.post("/api/calculator")
async def calculate_tax_endpoint(req: TaxCalcRequest):
    try:
        df = fetch_data(req.ticker)
        time_col = 'Datetime' if 'Datetime' in df.columns else 'Date'
        df['DateString'] = df[time_col].dt.strftime('%Y-%m-%d')
        
        buy_df = df[df['DateString'] >= req.buy_date]
        sell_df = df[df['DateString'] <= req.sell_date]
        
        if buy_df.empty or sell_df.empty:
            raise ValueError(f"No matching historical data found for {req.ticker} on those dates.")
            
        buy_price = round(buy_df.iloc[0]['Open'], 2)
        sell_price = round(sell_df.iloc[-1]['Close'], 2)
        
        total_buy_value = buy_price * req.shares
        total_sell_value = sell_price * req.shares
        gross_profit = total_sell_value - total_buy_value
        
        taxes = calculate_indian_taxes(
            total_buy_value, 
            total_sell_value, 
            buy_df.iloc[0]['DateString'], 
            sell_df.iloc[-1]['DateString']
        )
        net_profit = gross_profit - taxes.total_taxes
        
        return {
            "ticker": req.ticker,
            "shares": req.shares,
            "buy_date": buy_df.iloc[0]['DateString'],
            "sell_date": sell_df.iloc[-1]['DateString'],
            "buy_price": buy_price,
            "sell_price": sell_price,
            "total_buy_value": round(total_buy_value, 2),
            "total_sell_value": round(total_sell_value, 2),
            "gross_profit": round(gross_profit, 2),
            "net_profit": round(net_profit, 2),
            "taxes": taxes.model_dump()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/prompts", response_model=List[SavedPrompt])
def fetch_prompts():
    try:
        return get_all_prompts()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")

@app.get("/")
def read_root():
    return {"message": "Welcome to Stock Mindfull AI Backend!"}

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
