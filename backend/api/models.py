from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    text: str

class StrategyParams(BaseModel):
    strategy_type: Optional[str] = None
    ticker: Optional[str] = None
    buy_day: Optional[str] = None
    sell_day: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    target_date: Optional[str] = None
    capital: Optional[float] = None
    error: Optional[str] = None
    message: Optional[str] = None

class Transaction(BaseModel):
    date: str
    action: str
    price: float
    shares: float
    value: float

class NewsArticle(BaseModel):
    title: str
    publisher: str
    link: str
    published_date: str

class BacktestResult(BaseModel):
    text_response: str
    win_rate: float
    buys: int
    sells: int
    total_invested: float
    final_value: float
    profit: float
    return_percentage: float
    transactions: List[Transaction]
    equity_curve_dates: List[str]
    equity_curve_values: List[float]
    news_articles: Optional[List[NewsArticle]] = None

class TaxCalcRequest(BaseModel):
    ticker: str
    buy_date: str
    sell_date: str
    shares: float
