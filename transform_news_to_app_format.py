#!/usr/bin/env python3
"""
Transform DDGS news articles into the format expected by the NewsReader component.
The app expects AI-generated bilingual content, but we have real news in Spanish/mixed languages.
"""

import json
import re
from datetime import datetime

def split_into_sentences(text):
    """Split text into sentences, handling Spanish punctuation."""
    # Simple sentence splitter for Spanish
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    return [s.strip() for s in sentences if s.strip() and len(s.strip()) > 10]

def simple_translate_to_english(spanish_text):
    """
    Provide a simple English translation hint.
    Since we don't have a translation API, we provide context clues.
    """
    # Common Spanish phrases and words to English
    common_translations = {
        'últimas noticias': 'latest news',
        'noticias': 'news',
        'actualidad': 'current events',
        'política': 'politics',
        'economía': 'economy',
        'gobierno': 'government',
        'presidente': 'president',
        'país': 'country',
        'desarrollo': 'development',
        'seguridad': 'security',
        'ciudadanos': 'citizens',
        'elecciones': 'elections',
        'ley': 'law',
        'reforma': 'reform',
        'crisis': 'crisis',
        'pobreza': 'poverty',
        'hoy': 'today',
        'ayer': 'yesterday',
        'según': 'according to',
        'durante': 'during',
        'después': 'after',
        'antes': 'before',
        'más alta': 'highest',
        'cifra': 'figure/number',
        'alarmante': 'alarming',
        'supera': 'exceeds',
        'décadas': 'decades',
        'últimas': 'latest/recent',
    }
    
    # Create a hint by translating known words
    lower_text = spanish_text.lower()
    hints = []
    
    # Try to match longer phrases first
    sorted_translations = sorted(common_translations.items(), key=lambda x: len(x[0]), reverse=True)
    
    for spanish, english in sorted_translations:
        if spanish in lower_text and spanish not in ' '.join(hints):
            hints.append(f'"{spanish}" = {english}')
            if len(hints) >= 3:
                break
    
    if hints:
        return f"{'; '.join(hints)}"
    else:
        return "Practice reading this Spanish text"

def is_spanish(text):
    """Simple check if text is likely Spanish based on common Spanish words."""
    spanish_indicators = ['el', 'la', 'de', 'en', 'que', 'los', 'las', 'del', 'un', 'una', 'por', 'para', 'con']
    text_lower = text.lower()
    # Count Spanish indicators
    spanish_count = sum(1 for word in spanish_indicators if f' {word} ' in f' {text_lower} ')
    return spanish_count >= 2

def extract_vocabulary(text):
    """Extract some vocabulary words from the text."""
    # Common important words for immigrants
    vocab_candidates = {
        'gobierno': 'government',
        'presidente': 'president',
        'economía': 'economy',
        'política': 'politics',
        'ciudadanos': 'citizens',
        'país': 'country',
        'desarrollo': 'development',
        'seguridad': 'security',
        'elecciones': 'elections',
        'proyecto': 'project',
        'ley': 'law',
        'reforma': 'reform',
        'inversión': 'investment',
        'crecimiento': 'growth',
        'migración': 'migration',
        'inmigración': 'immigration'
    }
    
    found_vocab = []
    text_lower = text.lower()
    
    for spanish_word, english_word in vocab_candidates.items():
        if spanish_word in text_lower:
            found_vocab.append({
                "spanish": spanish_word,
                "english": english_word,
                "context": f"Word used in context of the article"
            })
            if len(found_vocab) >= 5:
                break
    
    # Add default vocab if not enough found
    while len(found_vocab) < 3:
        found_vocab.append({
            "spanish": "noticias",
            "english": "news",
            "context": "Current events and news articles"
        })
    
    return found_vocab[:5]

def transform_news_for_app():
    """Transform fetched news into app-compatible format with enhanced content."""
    
    # Load fetched news
    with open('news_articles.json', 'r', encoding='utf-8') as f:
        raw_data = json.load(f)
    
    app_format = {}
    
    for country_name, country_data in raw_data['countries'].items():
        articles = []
        raw_articles = country_data['articles'][:5]  # Get up to 5 articles
        
        # Prioritize Spanish articles
        spanish_articles = [a for a in raw_articles if is_spanish(a['title']) or is_spanish(a['body'])]
        if len(spanish_articles) >= 3:
            selected_articles = spanish_articles[:3]
        else:
            # Use what we have, Spanish first
            selected_articles = (spanish_articles + [a for a in raw_articles if a not in spanish_articles])[:3]
        
        for idx, article in enumerate(selected_articles, 1):
            # Split body into sentences for better display
            body_text = article['body']
            sentences = split_into_sentences(body_text)
            
            # If body is too short or truncated, create a note
            if body_text.endswith('...') or len(sentences) < 2:
                full_text_note = {
                    "spanish": body_text,
                    "english": simple_translate_to_english(body_text)
                }
                if len(sentences) > 0:
                    full_text = [full_text_note]
                else:
                    full_text = [full_text_note]
            else:
                # Create bilingual sentence pairs with translation hints
                full_text = []
                for sentence in sentences[:8]:  # Max 8 sentences
                    full_text.append({
                        "spanish": sentence,
                        "english": simple_translate_to_english(sentence)
                    })
            
            # Format date nicely
            date_str = article['date']
            try:
                date_obj = datetime.fromisoformat(date_str.replace('+00:00', ''))
                formatted_date = date_obj.strftime('%B %d, %Y')
            except:
                formatted_date = date_str
            
            # Transform each article into app format
            title_spanish = article['title']
            summary_spanish = body_text[:250].rsplit('.', 1)[0] + "." if '.' in body_text[:250] else body_text[:250]
            
            transformed = {
                "title": {
                    "spanish": title_spanish,
                    "english": simple_translate_to_english(title_spanish)
                },
                "source": f"{article['source']} - {article['url']}",
                "date": formatted_date,
                "summary": {
                    "spanish": summary_spanish,
                    "english": simple_translate_to_english(summary_spanish)
                },
                "fullText": full_text,
                "keyVocabulary": extract_vocabulary(article['title'] + ' ' + article['body']),
                "comprehensionQuestions": [
                    {
                        "question": {
                            "spanish": "¿Cuál es el tema principal de este artículo?",
                            "english": "What is the main topic of this article?"
                        },
                        "answer": {
                            "spanish": f"El artículo habla sobre: {article['title']}",
                            "english": f"The article discusses: {article['title']}"
                        }
                    },
                    {
                        "question": {
                            "spanish": "¿De qué fuente viene esta noticia?",
                            "english": "What source does this news come from?"
                        },
                        "answer": {
                            "spanish": f"La noticia viene de {article['source']}",
                            "english": f"The news comes from {article['source']}"
                        }
                    },
                    {
                        "question": {
                            "spanish": "¿Dónde puedo leer el artículo completo?",
                            "english": "Where can I read the full article?"
                        },
                        "answer": {
                            "spanish": f"Puedes leer el artículo completo en: {article['url']}",
                            "english": f"You can read the full article at: {article['url']}"
                        }
                    }
                ]
            }
            
            articles.append(transformed)
        
        app_format[country_name] = articles
    
    # Save in app format
    with open('public/data/news_by_country.json', 'w', encoding='utf-8') as f:
        json.dump(app_format, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Transformed news for {len(app_format)} countries")
    print(f"✓ Saved to public/data/news_by_country.json")
    
    # Print sample for verification
    first_country = list(app_format.keys())[0]
    print(f"\n✓ Sample article from {first_country}:")
    print(f"  Title: {app_format[first_country][0]['title']['spanish']}")
    print(f"  Source: {app_format[first_country][0]['source'][:80]}...")
    print(f"  Sentences in article: {len(app_format[first_country][0]['fullText'])}")

if __name__ == '__main__':
    transform_news_for_app()
