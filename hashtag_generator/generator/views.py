from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import spacy
import itertools
import tweepy

# Load spaCy model by name
nlp = spacy.load("en_core_web_sm")

# Set up Twitter API credentials
CONSUMER_KEY = 'GiJgQLsfByXT0ORAONDczzT1C'
CONSUMER_SECRET = 'NGn9b468N83E5xZ65RZK95ifjF2vfDd7h3sIMjdhm8fn7VxmDv'
ACCESS_TOKEN = '2858977239-5dZ9y2oYf5QvSqpFIDqmOdfcEwHxOJpK7Cz8JlZ'
ACCESS_TOKEN_SECRET = 'DBhNo4mCY8tJVh9I60CP2c5cWpmMLWGjAU4JsPf53yKfN'

# Authenticate with Twitter API
auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
twitter_api = tweepy.API(auth)


@csrf_exempt
def generate_hashtags(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            text = data.get('text', '')
            selected_number = data.get('selectedNumber', 5)
            min_hashtag_length = data.get('minHashtagLength',5 )
            max_hashtag_length = data.get('maxHashtagLength',15)

            # Use spaCy for keyword extraction
            keywords = extract_keywords(text)

            # Generate hashtags using GenAI-powered logic with new parameters
            hashtags = generate_hashtags_from_keywords(keywords, min_hashtag_length, max_hashtag_length)

            # Get frequency for each hashtag from Twitter API
            hashtag_frequencies = get_hashtag_frequencies(hashtags)

            return JsonResponse({'hashtags': hashtags[:selected_number], 'frequencies': hashtag_frequencies})
        except Exception as e:
            print(f'Unexpected error: {str(e)}')
            return JsonResponse({'error': 'Internal Server Error'}, status=500)


def extract_keywords(text):
    # Use spaCy to extract keywords
    doc = nlp(text)
    # Extract nouns and proper nouns as keywords
    keywords = [token.text for token in doc if token.pos_ in ('NOUN', 'PROPN')]
    return keywords


def generate_hashtags_from_keywords(keywords, min_length, max_length):
    try:
        # GenAI-powered logic for dynamic hashtag generation
        # Customize this function based on your requirements

        # Placeholder for your custom GenAI algorithm
        # Let's combine words in different ways for hashtags
        suggested_hashtags = suggest_dynamic_hashtags(keywords)

        # Combine with keywords converted to hashtags
        keyword_hashtags = ['#' + keyword.lower() for keyword in keywords]

        # Combine all hashtag groups
        all_hashtags = suggested_hashtags + keyword_hashtags

        # Ensure uniqueness by converting to set and back to list
        unique_hashtags = list(set(all_hashtags))

        # Apply length filter to hashtags
        filtered_hashtags = [hashtag for hashtag in unique_hashtags if min_length <= len(hashtag) <= max_length]

        # Limit the number of hashtags to, for example, the top 10
        return filtered_hashtags[:20]
    except Exception as e:
        return ['#ErrorInGeneratingHashtags']


def suggest_dynamic_hashtags(keywords):
    # Combine words in different ways for hashtags
    # For simplicity, let's create hashtags by combining pairs of words
    combined_hashtags = ['#' + ''.join(pair) for pair in itertools.combinations(keywords, 2)]

    # Add some longer hashtags
    longer_hashtags = []

    # Combine combined and longer hashtags
    dynamic_hashtags = combined_hashtags + longer_hashtags

    return dynamic_hashtags


def get_hashtag_frequencies(hashtags):
    hashtag_frequencies = {}
    for hashtag in hashtags:
        try:
            result = twitter_api.get_status(f'#{hashtag}', tweet_mode='extended')
            frequency = result.favorite_count + result.retweet_count
            hashtag_frequencies[hashtag] = frequency
        except Exception as e:
            print(f"Unexpected error fetching frequency for {hashtag}: {e}")
            hashtag_frequencies[hashtag] = 0

    return hashtag_frequencies
