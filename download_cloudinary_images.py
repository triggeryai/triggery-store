import os
import requests
import time
from pymongo import MongoClient
from dotenv import load_dotenv

# Ładujemy zmienne środowiskowe
load_dotenv()

# Połączenie z bazą danych MongoDB
client = MongoClient(os.getenv('MONGODB_URI'))
db = client['travilabs']
products_collection = db['products']

# Ścieżka do katalogu, gdzie będą zapisywane obrazy
output_directory = 'public/images_cloudinary'

# Utworzenie katalogu, jeśli nie istnieje
if not os.path.exists(output_directory):
    os.makedirs(output_directory)

# Liczniki
total_images = 0
downloaded_images = 0
ignored_images = 0

# Funkcja sprawdzająca, czy plik już istnieje
def is_image_downloaded(image_name):
    return os.path.exists(os.path.join(output_directory, image_name))

# Funkcja do pobierania obrazów
def download_image(image_url, image_name):
    global downloaded_images, ignored_images

    # Sprawdzamy, czy obraz już został pobrany
    if is_image_downloaded(image_name):
        print(f"Ignoruje obraz: {image_name}, ponieważ został już pobrany.")
        ignored_images += 1
        return

    # Sprawdź, czy URL jest lokalny (np. zaczyna się od '/images/')
    if image_url.startswith('/images/'):
        local_image_path = f'public{image_url}'
        if os.path.exists(local_image_path):
            # Skopiuj obraz z lokalnej ścieżki do folderu docelowego
            with open(local_image_path, 'rb') as src_file:
                with open(f"{output_directory}/{image_name}", 'wb') as dst_file:
                    dst_file.write(src_file.read())
            print(f"Skopiowano lokalny obraz: {image_name}")
            downloaded_images += 1
        else:
            print(f"Lokalny obraz nie istnieje: {local_image_path}")
        return

    # Pobieranie obrazów z Cloudinary (lub innego zewnętrznego URL-a)
    if image_url.startswith("http://") or image_url.startswith("https://"):
        try:
            response = requests.get(image_url)
            if response.status_code == 200:
                with open(f"{output_directory}/{image_name}", 'wb') as f:
                    f.write(response.content)
                print(f"Pobrano obraz: {image_name}")
                downloaded_images += 1
            else:
                print(f"Nie udało się pobrać obrazu: {image_name}")
        except requests.ConnectionError:
            print("Brak połączenia z internetem. Ponowne połączenie za chwilę...")
            time.sleep(10)  # Poczekaj 10 sekund przed ponowną próbą
            download_image(image_url, image_name)  # Ponów próbę pobrania
    else:
        print(f"Pominięto nieprawidłowy URL: {image_url}")

# Funkcja pobierająca obrazy z produktów
def fetch_and_save_images():
    global total_images

    products = products_collection.find()
    for product in products:
        product_id = str(product['_id'])

        # Pobieramy wszystkie obrazy z tablicy 'images'
        if 'images' in product:
            for index, image_url in enumerate(product['images']):
                total_images += 1
                image_name = f"{product_id}_image_{index}.jpg"
                download_image(image_url, image_name)

        # Pobieramy obraz główny 'mainImage'
        if 'mainImage' in product and product['mainImage']:
            total_images += 1
            image_name = f"{product_id}_main.jpg"
            download_image(product['mainImage'], image_name)

# Uruchamiamy skrypt pobierający obrazy
if __name__ == "__main__":
    fetch_and_save_images()

    # Podsumowanie po zakończeniu pobierania
    print(f"\nProces zakończony!\nPobrano {downloaded_images} z {total_images} obrazów.")
    print(f"Ignorowano {ignored_images} obrazów, które zostały już pobrane.")
