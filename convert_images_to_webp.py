import os
from PIL import Image

# Ścieżka do folderu z oryginalnymi obrazami
input_directory = 'public/images_cloudinary'

# Ścieżka do folderu z przekonwertowanymi obrazami WebP
output_directory = 'public/webp_images'

# Tworzenie katalogu, jeśli nie istnieje
if not os.path.exists(output_directory):
    os.makedirs(output_directory)

# Liczniki
total_images = 0
converted_images = 0
ignored_images = 0

# Funkcja sprawdzająca, czy plik już istnieje w formacie WebP
def is_image_converted(image_name):
    webp_image_name = os.path.splitext(image_name)[0] + '.webp'
    return os.path.exists(os.path.join(output_directory, webp_image_name))

# Funkcja konwertująca obraz na WebP
def convert_image_to_webp(image_path, image_name):
    global converted_images, ignored_images

    if is_image_converted(image_name):
        print(f"Ignoruję obraz: {image_name}, ponieważ został już przekonwertowany.")
        ignored_images += 1
        return

    try:
        with Image.open(image_path) as img:
            webp_image_name = os.path.splitext(image_name)[0] + '.webp'
            img.save(os.path.join(output_directory, webp_image_name), 'webp')
            print(f"Przekonwertowano obraz: {image_name} na {webp_image_name}")
            converted_images += 1
    except Exception as e:
        print(f"Błąd podczas konwersji obrazu {image_name}: {str(e)}")

# Funkcja pobierająca wszystkie pliki JPG i PNG i konwertująca je na WebP
def convert_images_in_folder():
    global total_images
    for image_name in os.listdir(input_directory):
        if image_name.lower().endswith(('.jpg', '.jpeg', '.png')):
            total_images += 1
            image_path = os.path.join(input_directory, image_name)
            convert_image_to_webp(image_path, image_name)

# Uruchomienie skryptu
if __name__ == "__main__":
    convert_images_in_folder()

    # Podsumowanie po zakończeniu procesu
    print(f"\nProces zakończony!\nPrzekonwertowano {converted_images} z {total_images} obrazów.")
    print(f"Ignorowano {ignored_images} obrazów, które zostały już przekonwertowane.")
