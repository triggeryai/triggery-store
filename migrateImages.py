import pymongo
from bson.objectid import ObjectId

# Połączenie z MongoDB
mongo_uri = "mongodb+srv://travilabs:kurwa1212@cluster0.oe5gy1v.mongodb.net/travilabs?retryWrites=true&w=majority"
client = pymongo.MongoClient(mongo_uri)
db = client.get_database("travilabs")
products = db.products

# Rozpoczęcie sesji
session = client.start_session()
session.start_transaction()

try:
    # Znalezienie produktów z polem image
    for product in products.find({"image": {"$exists": True}}):
        image_url = product["image"]
        products.update_one(
            {"_id": product["_id"]},
            {"$set": {"images": [image_url]}, "$unset": {"image": ""}},
            session=session,
        )

    # Zatwierdzenie transakcji
    session.commit_transaction()
    print("Migration completed successfully.")
except Exception as e:
    # Wycofanie transakcji w przypadku błędu
    session.abort_transaction()
    print("Migration failed:", e)
finally:
    # Zakończenie sesji
    session.end_session()
    client.close()
