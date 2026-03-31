import yfinance as yf
import pandas as pd

def fetch_data(symbol: str) -> pd.DataFrame:
    """
    Fetches historical stock data from Yahoo Finance.
    Pulls 730d of 1h interval data for high resolution.
    """
    if "." not in symbol:
        # Default to NSE if no exchange provided
        symbol = f"{symbol}.NS"
        
    ticker = yf.Ticker(symbol)
    
    # 730d is the maximum lookback for 1h intervals in yfinance
    df = ticker.history(period="730d", interval="1h")
    
    if df.empty:
        raise ValueError(f"No market data found for symbol {symbol}. The stock may be delisted, the symbol may be incorrect, or Yahoo Finance is experiencing a data outage for this ticker.")
        
    df.reset_index(inplace=True)
    
    # The datetime column from yfinance might be 'Datetime'
    time_col = 'Datetime' if 'Datetime' in df.columns else 'Date'
    if time_col in df.columns:
        df[time_col] = df[time_col].dt.tz_localize(None)
    
    return df
