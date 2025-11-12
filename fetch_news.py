#!/usr/bin/env python3
"""
Fetch top news articles for Spanish-speaking countries using DDGS.
Uses ue-es (Spanish European Union) locale for Spanish language news.
"""

import json
from ddgs import DDGS
from datetime import datetime

COUNTRIES = [
    {'name': 'Argentina', 'flag': '🇦🇷'},
    {'name': 'Chile', 'flag': '🇨🇱'},
    {'name': 'Colombia', 'flag': '🇨🇴'},
    {'name': 'Costa Rica', 'flag': '🇨🇷'},
    {'name': 'Dominican Republic', 'flag': '🇩🇴'},
    {'name': 'Ecuador', 'flag': '🇪🇨'},
    {'name': 'Mexico', 'flag': '🇲🇽'},
    {'name': 'Panama', 'flag': '🇵🇦'},
    {'name': 'Paraguay', 'flag': '🇵🇾'},
    {'name': 'Peru', 'flag': '🇵🇪'},
]

def fetch_country_news(country_name, max_results=10):
    """
    Fetch news articles for a specific country using DDGS.
    Try multiple search strategies to get Spanish content.
    
    Args:
        country_name: Name of the country
        max_results: Maximum number of news articles to fetch
    
    Returns:
        List of news article dictionaries
    """
    articles = []
    
    # Multiple search strategies for Spanish content about the specific country
    search_queries = [
        f'noticias de {country_name}',
        f'{country_name} actualidad',
        f'últimas noticias {country_name}',
        f'política {country_name}',
        f'economía {country_name}',
    ]
    
    # Try different Spanish-speaking regions
    regions = ['es-es', 'es-mx', 'es-ar', 'wt-wt']
    
    try:
        with DDGS() as ddgs:
            for query in search_queries:
                if len(articles) >= max_results:
                    break
                    
                for region in regions:
                    if len(articles) >= max_results:
                        break
                    
                    try:
                        results = ddgs.news(
                            query,
                            region=region,
                            safesearch='moderate',
                            max_results=5
                        )
                        
                        for result in results:
                            # Check if title or body contains Spanish indicators
                            title = result.get('title', '')
                            body = result.get('body', '')
                            
                            # Simple Spanish detection
                            spanish_words = ['el', 'la', 'de', 'en', 'que', 'los', 'las', 'un', 'una', 'por', 'para', 'con', 'su', 'al']
                            text = (title + ' ' + body).lower()
                            spanish_count = sum(1 for word in spanish_words if f' {word} ' in f' {text} ')
                            
                            # Only include if it has significant Spanish content (at least 3 Spanish indicators)
                            if spanish_count >= 3:
                                article = {
                                    'title': title,
                                    'url': result.get('url', ''),
                                    'body': body,
                                    'date': result.get('date', ''),
                                    'source': result.get('source', ''),
                                }
                                
                                # Avoid duplicates
                                if not any(a['title'] == article['title'] for a in articles):
                                    articles.append(article)
                                    
                                if len(articles) >= max_results:
                                    break
                    except Exception as e:
                        continue  # Try next region/query
            
            return articles[:max_results]
            
    except Exception as e:
        print(f"Error fetching news for {country_name}: {str(e)}")
        return []

def main():
    """Fetch news for all countries and save to JSON file."""
    print("Fetching news articles for Spanish-speaking countries...")
    print(f"Using locale: ue-es (Spanish European Union)")
    print(f"Timestamp: {datetime.now().isoformat()}\n")
    
    all_news = {}
    
    for country in COUNTRIES:
        country_name = country['name']
        print(f"Fetching news for {country['flag']} {country_name}...")
        
        articles = fetch_country_news(country_name, max_results=5)
        
        if articles:
            all_news[country_name] = {
                'flag': country['flag'],
                'articles': articles,
                'count': len(articles)
            }
            print(f"  ✓ Found {len(articles)} articles\n")
        else:
            print(f"  ✗ No articles found\n")
    
    # Save to JSON file
    output_file = 'news_articles.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'locale': 'ue-es',
            'countries': all_news
        }, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Results saved to {output_file}")
    print(f"Total countries: {len(all_news)}")
    print(f"Total articles: {sum(data['count'] for data in all_news.values())}")

if __name__ == '__main__':
    main()
