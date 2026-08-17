<div align="center">

# 🚀 StockMind.AI

### *Natural Language-Driven Algorithmic Trading Simulator & Financial Intelligence Suite*

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Groq AI](https://img.shields.io/badge/Groq_LLM-GPT_OSS_120B-f05023?style=for-the-badge&logo=openai&logoColor=white)](https://groq.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**[Explore Features](#-key-features) • [System Architecture](#-system-architecture) • [Quick Start](#-quick-start) • [API Specs](#-api-specifications) • [Strategy Schemas](#-supported-strategy-schemas)**

---

</div>

## 📌 Overview

**StockMind.AI** is a state-of-the-art, full-stack quantitative financial intelligence application that turns plain, natural language trading ideas into executable algorithmic backtests in seconds.

By pairing **Large Language Models (LLMs)** with high-resolution historical stock market data, StockMind.AI eliminates the need to write complex Python backtesting scripts manually. Simply ask the AI to backtest a strategy in natural language—such as *"Buy Reliance every Monday and sell on Friday over the last year"* or *"Buy Tata Motors when it drops 5% and sell when it rises 5%"*—and receive instant performance analytics, trade transaction logs, win rates, and interactive equity curves.

In addition to strategy execution, StockMind.AI incorporates side-by-side strategy comparison, historical stock news searching, and a comprehensive Indian Stock Market Tax & Fee Calculator adjusted for the latest tax regimes (STCG 20%, LTCG 12.5%, STT, GST, and broker charges).

---

## 🔥 Key Features

### 1. 🤖 Natural Language AI Backtesting Router
* **Zero-Shot Parameter Extraction**: Powered by **Groq (`openai/gpt-oss-120b` & `openai/gpt-oss-20b`)** and **Google Gemini API**, converting conversational queries into strict JSON trading configurations.
* **Intelligent Clarification Prompts**: Automatically prompts users if key inputs (like stock ticker, timeframe, or capital) are missing or ambiguous.
* **Weekend & Market Schedule Aware**: Detects invalid trading inputs (e.g. attempting to execute trades on Saturdays or Sundays) and provides contextual guidance for NSE/BSE market schedules.

### 2. 📈 Multi-Schema Backtesting Engine
Supports three core quantitative strategy paradigms:
* **Recurring Weekly Strategies**: Test systematic weekly rebalancing (e.g. Buy on Monday, Sell on Friday).
* **One-Time Historical Execution**: Test single-period buy-and-hold returns between exact historical calendar dates.
* **Percentage Swing / Buy-the-Dip**: Dynamic drop & rise triggers (e.g., Buy on 5% pullbacks from peaks, Sell on 5% profit targets).

### 3. ⚔️ Strategy Comparison Studio
* Compare two distinct trading strategies side-by-side in real time.
* Contrast key metrics: Total Returns, Win Rate %, Executed Trades, Final Portfolio Value, and Equity Curve progression.

### 4. 📰 Historical Stock News Search
* Retrieve contextual financial headlines and press releases around specific historical trade dates.
* Search powered by key-less Google News RSS integration to correlate price swings with real-world catalysts.

### 5. 💰 Indian Stock Market Tax & Charge Calculator
* Calculates exact gross vs net profits for Indian equities (NSE/BSE Delivery).
* Includes automatic deductions based on updated Budget tax guidelines:
  * **STCG (Short Term Capital Gains)**: 20% (< 365 days)
  * **LTCG (Long Term Capital Gains)**: 12.5% (>= 365 days)
  * **STT (Securities Transaction Tax)**: 0.1% on buy & sell turnover
  * **Exchange Charges (NSE)**: 0.00297%
  * **SEBI Charges**: ₹10 per Crore
  * **GST**: 18% on fees & exchange charges
  * **Stamp Duty**: 0.015% on buy side

### 6. 🛡️ Prompt Logging & Admin Dashboard
* Embedded SQLite logging tracks incoming natural language queries for model performance audit and strategy analysis.

---

## 🏗️ System Architecture

```
                       ┌───────────────────────────────────────┐
                       │           User Interface              │
                       │   Next.js 16 (React 19, Tailwind)    │
                       └──────────────────┬────────────────────┘
                                          │  REST API Calls (JSON)
                                          ▼
                       ┌───────────────────────────────────────┐
                       │           FastAPI Backend             │
                       │           (Python Uvicorn)            │
                       └──────┬───────────────────┬────────────┘
                              │                   │
      Natural Language Query  │                   │ Market Data Requests
                              ▼                   ▼
           ┌───────────────────────┐         ┌───────────────────────┐
           │ Groq AI / Gemini LLM  │         │ Yahoo Finance Engine  │
           │ (Llama-3.3-70b Engine)│         │ (yfinance 730d 1h OHLC│
           └──────────┬────────────┘         └──────────┬────────────┘
                      │                                 │
                      │ Structured Strategy JSON        │ Clean Market DataFrame
                      └─────────────────┬───────────────┘
                                        │
                                        ▼
                       ┌───────────────────────────────────────┐
                       │     Pandas In-Memory Engine           │
                       │ (Backtesting & Vectorized Simulation) │
                       └──────────────────┬────────────────────┘
                                          │
                                          ▼
                       ┌───────────────────────────────────────┐
                       │ Backtest Result / Equity Curve Output │
                       │    (SQLite Audit Logging via DB)      │
                       └───────────────────────────────────────┘
```

---

## ⚡ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend Core** | Next.js 16 (App Router), React 19, TypeScript |
| **UI & Styling** | Tailwind CSS v4, Framer Motion, Lucide Icons |
| **Data Visualization** | Chart.js, react-chartjs-2, Recharts |
| **Backend Framework** | Python 3.10+, FastAPI, Uvicorn, Pydantic v2 |
| **AI / LLM Layer** | Groq API (`openai/gpt-oss-120b`, `openai/gpt-oss-20b`), Google Gemini AI |
| **Financial Engine** | Pandas, NumPy, `yfinance` (High-resolution 1h OHLC data) |
| **Database** | SQLite3 (Prompt audit & logging) |

---

## 🚀 Quick Start

### Prerequisites
* **Node.js**: v18.x or higher
* **Python**: v3.10 or higher
* **Groq API Key**: Get a free API key from [Groq Console](https://console.groq.com/)

---

### 1. Clone the Repository
```bash
git clone https://github.com/the-amanshaikh/StockMind.AI.git
cd StockMind.AI
```

---

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Create .env file
echo GROQ_API_KEY=your_groq_api_key_here > .env

# Start FastAPI dev server
python main.py
```
The FastAPI server will launch at `http://localhost:8000`. You can test the interactive API docs at `http://localhost:8000/docs`.

---

### 3. Frontend Setup
```bash
# In a new terminal tab, navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Next.js development server
npm run dev
```
The Web Application will launch at `http://localhost:3000`.

---

## 💡 Supported Strategy Schemas & Prompts

Try entering these natural language prompts in the chat interface:

| Strategy Type | Sample Natural Language Prompt |
| :--- | :--- |
| **Recurring Weekly** | *"Buy Reliance every Monday and sell on Friday from Jan 2025 to March 2026 with 50,000 capital."* |
| **Historical Single Trade** | *"Invest 100,000 in Sun Pharma on Jan 10 2025 and sell on March 20 2026."* |
| **Percentage Swing** | *"Buy Tata Motors when it drops 5% and sell when it rises 5% with 100,000 capital."* |
| **Historical Stock News** | *"Get me news headlines for Tata Motors on Jan 15 2026."* |

---

## 📡 API Specifications

### `POST /api/chat`
Translates user natural language query into strategy parameters and returns backtest results.

**Request Payload:**
```json
{
  "text": "Buy RELIANCE.NS every Monday and sell on Friday from 2025-01-01 to 2026-03-20 with 100000 capital"
}
```

**Response Payload:**
```json
{
  "text_response": "Executed 52 recurring weekly trades on RELIANCE.NS. Turned an initial investment of ₹100,000.00 into ₹118,450.00 with a win rate of 61.5%.",
  "win_rate": 61.5,
  "buys": 52,
  "sells": 52,
  "total_invested": 100000.0,
  "final_value": 118450.0,
  "profit": 18450.0,
  "return_percentage": 18.45,
  "transactions": [
    {
      "date": "2025-01-06 09:15",
      "action": "BUY",
      "price": 1240.50,
      "shares": 80.6126,
      "value": 100000.0
    }
  ],
  "equity_curve_dates": ["2025-01-10", "2025-01-17"],
  "equity_curve_values": [101200.0, 102500.0]
}
```

### `POST /api/calculator`
Calculates stock tax and fee breakdowns for Indian trades.

**Request Payload:**
```json
{
  "ticker": "TATAMOTORS.NS",
  "buy_date": "2024-01-15",
  "sell_date": "2025-02-20",
  "shares": 100
}
```

### `GET /api/prompts`
Retrieves logged history of natural language prompts.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve StockMind.AI, please follow these steps:
1. Fork the Repository.
2. Create a Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/the-amanshaikh">Aman Shaikh</a></sub>
</div>
