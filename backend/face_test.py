
from pathlib import Path
from deepface import DeepFace

image1 = Path("face-test-images/person1.jpg")
image2 = Path("face-test-images/person2.jpg")

if not image1.is_file() or not image2.is_file():
    raise FileNotFoundError(
        "Place person1.jpg and person2.jpg inside the face-test-images folder."
    )

print("Comparing the two images locally...")

result = DeepFace.verify(
    img1_path=str(image1),
    img2_path=str(image2),
    model_name="Facenet512",
    detector_backend="opencv",
    enforce_detection=True,
)

print("\nVerification result:")
print("Same person:", result["verified"])
print("Distance:", result["distance"])
print("Model:", result["model"])
print("\nLocal face-verification test completed.")
