import pandas as pd
from api.models import Transaction, BacktestResult, StrategyParams

def run_backtest(df: pd.DataFrame, strategy: StrategyParams) -> BacktestResult:
    """
    Simulates trading strictly in-memory using Pandas.
    Handles both 'recurring' and 'one_time' strategies.
    """
    capital = strategy.capital or 10000.0
    initial_capital = capital
    
    transactions = []
    equity_curve_dates = []
    equity_curve_values = []
    
    time_col = 'Datetime' if 'Datetime' in df.columns else 'Date'
    df['DateString'] = df[time_col].dt.strftime('%Y-%m-%d')
    
    total_trades = 0
    winning_trades = 0
    
    # ---------------------------------------------------------
    # ONE-TIME STRATEGY LOGIC
    # ---------------------------------------------------------
    if strategy.strategy_type == "one_time":
        start_date = strategy.start_date
        end_date = strategy.end_date
        
        # Filter for dates strictly inside the requested bound
        valid_buy = df[df['DateString'] >= start_date]
        valid_sell = df[df['DateString'] <= end_date]
        
        if not valid_buy.empty and not valid_sell.empty:
            first_buy = valid_buy.iloc[0]
            last_sell = valid_sell.iloc[-1]
            
            if first_buy[time_col] < last_sell[time_col]:
                buy_price = first_buy['Open']
                sell_price = last_sell['Close']
                
                shares = capital / buy_price
                capital_before = capital
                capital = shares * sell_price
                profit = (sell_price - buy_price) * shares
                
                total_trades += 1
                if profit > 0:
                    winning_trades += 1
                
                transactions.append(Transaction(
                    date=first_buy[time_col].strftime('%Y-%m-%d %H:%M'),
                    action="BUY", price=round(buy_price, 2), shares=round(shares, 4), value=round(capital_before, 2)
                ))
                transactions.append(Transaction(
                    date=last_sell[time_col].strftime('%Y-%m-%d %H:%M'),
                    action="SELL", price=round(sell_price, 2), shares=round(shares, 4), value=round(capital, 2)
                ))
                
                # Equity Curve
                equity_curve_dates.append(first_buy[time_col].strftime('%Y-%m-%d'))
                equity_curve_values.append(round(capital_before, 2))
                equity_curve_dates.append(last_sell[time_col].strftime('%Y-%m-%d'))
                equity_curve_values.append(round(capital, 2))

    # ---------------------------------------------------------
    # RECURRING STRATEGY LOGIC
    # ---------------------------------------------------------
    elif strategy.strategy_type == "recurring":
        if strategy.start_date:
            df = df[df['DateString'] >= strategy.start_date]
        if strategy.end_date:
            df = df[df['DateString'] <= strategy.end_date]
            
        buy_day = strategy.buy_day.lower() if strategy.buy_day else "monday"
        sell_day = strategy.sell_day.lower() if strategy.sell_day else "friday"
        
        df['DayOfWeek'] = df[time_col].dt.day_name().str.lower()
        df['YearWeek'] = df[time_col].dt.isocalendar().year.astype(str) + '-' + df[time_col].dt.isocalendar().week.astype(str)
        
        weeks = df['YearWeek'].unique()
        for week in weeks:
            week_df = df[df['YearWeek'] == week]
            buy_df = week_df[week_df['DayOfWeek'] == buy_day]
            sell_df = week_df[week_df['DayOfWeek'] == sell_day]
            
            if not buy_df.empty and not sell_df.empty:
                first_buy = buy_df.iloc[0]
                last_sell = sell_df.iloc[-1]
                
                if first_buy[time_col] < last_sell[time_col]:
                    buy_price = first_buy['Open']
                    sell_price = last_sell['Close']
                    
                    if pd.isna(buy_price) or pd.isna(sell_price):
                        continue
                        
                    shares = capital / buy_price
                    capital_before = capital
                    capital = shares * sell_price
                    profit = (sell_price - buy_price) * shares
                    
                    total_trades += 1
                    if profit > 0:
                        winning_trades += 1
                        
                    transactions.append(Transaction(
                        date=first_buy[time_col].strftime('%Y-%m-%d %H:%M'),
                        action="BUY", price=round(buy_price, 2), shares=round(shares, 4), value=round(capital_before, 2)
                    ))
                    transactions.append(Transaction(
                        date=last_sell[time_col].strftime('%Y-%m-%d %H:%M'),
                        action="SELL", price=round(sell_price, 2), shares=round(shares, 4), value=round(capital, 2)
                    ))
                    
                    equity_curve_dates.append(last_sell[time_col].strftime('%Y-%m-%d'))
                    equity_curve_values.append(round(capital, 2))

    # ---------------------------------------------------------
    # PERCENTAGE SWING STRATEGY LOGIC
    # ---------------------------------------------------------
    elif strategy.strategy_type == "percentage_swing":
        if strategy.start_date:
            df = df[df['DateString'] >= strategy.start_date]
        if strategy.end_date:
            df = df[df['DateString'] <= strategy.end_date]
            
        buy_drop = (strategy.buy_drop_pct or 5.0) / 100.0
        sell_rise = (strategy.sell_rise_pct or 5.0) / 100.0
        
        holding = False
        running_high = df.iloc[0]['Close'] if not df.empty else 0
        buy_price = 0.0
        shares = 0.0
        
        for idx, row in df.iterrows():
            current_price = row['Close']
            current_date = row[time_col]
            
            if not holding:
                if current_price > running_high:
                    running_high = current_price
                    
                if current_price <= running_high * (1.0 - buy_drop):
                    # Trigger Buy
                    buy_price = current_price
                    shares = capital / buy_price
                    capital_before = capital
                    capital = 0  # In assets
                    holding = True
                    running_high = current_price  # reset peak tracker
                    
                    transactions.append(Transaction(
                        date=current_date.strftime('%Y-%m-%d %H:%M'),
                        action="BUY", price=round(buy_price, 2), shares=round(shares, 4), value=round(capital_before, 2)
                    ))
                    equity_curve_dates.append(current_date.strftime('%Y-%m-%d'))
                    equity_curve_values.append(round(capital_before, 2))
            else:
                if current_price >= buy_price * (1.0 + sell_rise):
                    # Trigger Sell
                    sell_price = current_price
                    capital = shares * sell_price
                    profit = (sell_price - buy_price) * shares
                    
                    total_trades += 1
                    if profit > 0:
                        winning_trades += 1
                        
                    transactions.append(Transaction(
                        date=current_date.strftime('%Y-%m-%d %H:%M'),
                        action="SELL", price=round(sell_price, 2), shares=round(shares, 4), value=round(capital, 2)
                    ))
                    equity_curve_dates.append(current_date.strftime('%Y-%m-%d'))
                    equity_curve_values.append(round(capital, 2))
                    
                    holding = False
                    running_high = current_price
    # ---------------------------------------------------------
    # OUTPUT COMPILATION
    # ---------------------------------------------------------
    win_rate = (winning_trades / total_trades * 100) if total_trades > 0 else 0.0
    net_profit = capital - initial_capital
    return_percentage = (net_profit / initial_capital * 100) if initial_capital > 0 else 0.0
    
    ticker_name = strategy.ticker or "the selected stock"
    if total_trades == 0:
        text_resp = f"No trades were executed for {ticker_name} under these conditions in the fetched data."
        
        # Check if the user accidentally selected a weekend
        weekend_days = ["Saturday", "Sunday", "saturday", "sunday"]
        buy_day_str = str(strategy.buy_day).lower() if strategy.buy_day else ""
        sell_day_str = str(strategy.sell_day).lower() if strategy.sell_day else ""
        
        if buy_day_str in weekend_days or sell_day_str in weekend_days:
            text_resp += " This is because you selected a weekend (Saturday/Sunday). The Indian Stock Market (NSE/BSE) is closed on weekends, so no official historical trades could be executed! Try changing the day to Friday or Monday."
    else:
        if strategy.strategy_type == "percentage_swing":
            strat_type_name = "percentage swing"
        elif strategy.strategy_type == "one_time":
            strat_type_name = "historical single"
        else:
            strat_type_name = "recurring weekly"
            
        text_resp = f"Executed {total_trades} {strat_type_name} trades on {ticker_name}. " \
                    f"Turned an initial investment of ₹{initial_capital:,.2f} into ₹{capital:,.2f} " \
                    f"with a win rate of {win_rate:.1f}%."

    return BacktestResult(
        text_response=text_resp,
        win_rate=round(win_rate, 2),
        buys=total_trades,
        sells=total_trades,
        total_invested=initial_capital,
        final_value=round(capital, 2),
        profit=round(net_profit, 2),
        return_percentage=round(return_percentage, 2),
        transactions=transactions,
        equity_curve_dates=equity_curve_dates,
        equity_curve_values=equity_curve_values
    )
