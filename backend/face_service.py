
from flask import Flask, jsonify, request
from deepface import DeepFace
from pathlib import Path
import tempfile
import os

app = Flask(__name__)

@app.get("/health")
def health():
    return jsonify({
        "success": True,
        "service": "StudentAI Face Recognition",
        "status": "running"
    }), 200


@app.post("/verify")
def verify_faces():
    image1_path = None
    image2_path = None

    try:
        image1 = request.files.get("image1")
        image2 = request.files.get("image2")

        if image1 is None or image2 is None:
            return jsonify({
                "success": False,
                "message": "Both image1 and image2 are required"
            }), 400

        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as file1:
            image1_path = file1.name
            image1.save(image1_path)

        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as file2:
            image2_path = file2.name
            image2.save(image2_path)

        result = DeepFace.verify(
            img1_path=image1_path,
            img2_path=image2_path,
            model_name="Facenet512",
            detector_backend="opencv",
            enforce_detection=True
        )

        return jsonify({
            "success": True,
            "verified": bool(result["verified"]),
            "distance": float(result["distance"]),
            "threshold": float(result["threshold"]),
            "model": result["model"]
        }), 200

    except Exception as error:
        app.logger.exception("Face verification failed")

        return jsonify({
            "success": False,
            "message": "Face verification failed. Check the images and service logs."
        }), 400

    finally:
        for path in (image1_path, image2_path):
            if path and os.path.exists(path):
                os.remove(path)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=False)
