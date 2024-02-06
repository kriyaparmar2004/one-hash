import spacy

# Load spaCy model by name
nlp = spacy.load("en_core_web_sm")

def extract_keywords(text):
    # Use spaCy to extract keywords
    doc = nlp(text)
    # Extract nouns and proper nouns as keywords
    keywords = [token.text for token in doc if token.pos_ in ('NOUN', 'PROPN')]
    return keywords
