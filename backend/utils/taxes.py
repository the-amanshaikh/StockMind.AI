from pydantic import BaseModel
from datetime import datetime

class TaxBreakdown(BaseModel):
    brokerage: float
    stt: float
    exchange_charges: float
    gst: float
    sebi_charges: float
    stamp_duty: float
    stcg: float
    ltcg: float
    total_taxes: float

def calculate_indian_taxes(buy_value: float, sell_value: float, buy_date_str: str = None, sell_date_str: str = None) -> TaxBreakdown:
    # Indian Equity Delivery Taxes & Charges (Approximate Standards)
    turnover = buy_value + sell_value
    brokerage = 0.0 # 0 for equity delivery (e.g. Zerodha)
    stt = round(turnover * 0.001, 2) # 0.1% on buy and sell
    exchange_charges = round(turnover * 0.0000297, 2) # NSE 0.00297% (revised Oct 2024)
    sebi_charges = round(turnover * 0.000001, 2) # Rs 10 / Crore
    gst = round((brokerage + exchange_charges + sebi_charges) * 0.18, 2) # 18% GST
    stamp_duty = round(buy_value * 0.00015, 2) # 0.015% on Buy Side ONLY
    
    transaction_charges = brokerage + stt + exchange_charges + gst + sebi_charges + stamp_duty
    
    gross_profit = sell_value - buy_value - transaction_charges
    stcg = 0.0
    ltcg = 0.0
    
    if buy_date_str and sell_date_str and gross_profit > 0:
        buy_date = datetime.strptime(buy_date_str, '%Y-%m-%d')
        sell_date = datetime.strptime(sell_date_str, '%Y-%m-%d')
        days_held = (sell_date - buy_date).days
        
        if days_held < 365:
            stcg = round(gross_profit * 0.20, 2) # Increased to 20% in Budget 2024
        else:
            ltcg = round(gross_profit * 0.125, 2) # Increased to 12.5% in Budget 2024
            
    total_taxes = round(transaction_charges + stcg + ltcg, 2)
    return TaxBreakdown(
        brokerage=brokerage, stt=stt, exchange_charges=exchange_charges,
        gst=gst, sebi_charges=sebi_charges, stamp_duty=stamp_duty, 
        stcg=stcg, ltcg=ltcg, total_taxes=total_taxes
    )
