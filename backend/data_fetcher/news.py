import urllib.request
import xml.etree.ElementTree as ET
from urllib.parse import quote
from api.models import NewsArticle
from typing import List

def fetch_historical_news(ticker: str, target_date: str) -> List[NewsArticle]:
    """
    Fetches news from Google News RSS by searching for the ticker + date. 
    This provides a highly reliable, free, key-less search mechanism for historical data.
    """
    # Clean up the ticker name for better search results
    search_term = ticker.replace(".NS", "").replace(".BO", "")
    
    query = quote(f'"{search_term}" stock {target_date}')
    url = f"https://news.google.com/rss/search?q={query}&hl=en-IN&gl=IN&ceid=IN:en"
    
    articles = []
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            xml_data = response.read()
            
        root = ET.fromstring(xml_data)
        
        for item in root.findall('./channel/item')[:10]: # Limit to top 10 articles
            title = item.find('title').text if item.find('title') is not None else "No Title"
            link = item.find('link').text if item.find('link') is not None else "#"
            pub_date = item.find('pubDate').text if item.find('pubDate') is not None else target_date
            source = item.find('source').text if item.find('source') is not None else "Google News"
            
            articles.append(NewsArticle(
                title=title,
                publisher=source,
                link=link,
                published_date=pub_date
            ))
            
    except Exception as e:
        print(f"Error fetching news: {e}")
        
    return articles
