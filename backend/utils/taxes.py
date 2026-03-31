from pydantic import BaseModel

class TaxBreakdown(BaseModel):
    brokerage: float
    stt: float
    exchange_charges: float
    gst: float
    sebi_charges: float
    stamp_duty: float
    total_taxes: float

def calculate_indian_taxes(buy_value: float, sell_value: float) -> TaxBreakdown:
    # Indian Equity Delivery Taxes & Charges (Approximate Standards)
    turnover = buy_value + sell_value
    brokerage = 0.0 # 0 for equity delivery (e.g. Zerodha)
    stt = round(turnover * 0.001, 2) # 0.1% on buy and sell
    exchange_charges = round(turnover * 0.0000322, 2) # NSE 0.00322%
    sebi_charges = round(turnover * 0.000001, 2) # Rs 10 / Crore
    gst = round((brokerage + exchange_charges + sebi_charges) * 0.18, 2) # 18% GST
    stamp_duty = round(buy_value * 0.00015, 2) # 0.015% on Buy Side ONLY
    
    total_taxes = round(brokerage + stt + exchange_charges + gst + sebi_charges + stamp_duty, 2)
    return TaxBreakdown(
        brokerage=brokerage, stt=stt, exchange_charges=exchange_charges,
        gst=gst, sebi_charges=sebi_charges, stamp_duty=stamp_duty, total_taxes=total_taxes
    )
