from flask import Flask, request, jsonify
from deepface import DeepFace
import numpy as np
import base64
import io
import cv2
from PIL import Image
import os
import traceback

app = Flask(__name__)

# ------------------------------------------------------------
# 🧠 Model Initialization
# ------------------------------------------------------------
print("🚀 Starting Face Embedding Service...")
try:
    print("Loading FaceNet model...")
    model = DeepFace.build_model("Facenet")
    print("✅ Model loaded successfully")
except Exception as e:
    print("❌ Error loading FaceNet model:", str(e))
    traceback.print_exc()
    model = None


# ------------------------------------------------------------
# 🧩 Helper: Decode Base64 to OpenCV image
# ------------------------------------------------------------
def decode_base64_image(base64_string):
    try:
        image_data = base64_string.split(",")[1] if "," in base64_string else base64_string
        img_bytes = base64.b64decode(image_data)
        img = Image.open(io.BytesIO(img_bytes))
        return cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
    except Exception as e:
        raise ValueError(f"Failed to decode base64 image: {e}")


# ------------------------------------------------------------
# 🧠 Route 1️⃣: Generate Embedding (for registration/upload)
# ------------------------------------------------------------
@app.route("/generate-embedding", methods=["POST"])
def generate_embedding():
    try:
        data = request.get_json(silent=True)
        image_path = data.get("imagePath") if data else None

        print(f"➡️ Received imagePath: {image_path}")

        if not image_path:
            return jsonify({
                "status": "error",
                "message": "Missing imagePath in request body"
            }), 400

        if not os.path.exists(image_path):
            return jsonify({
                "status": "error",
                "message": f"Image file not found at {image_path}"
            }), 400

        if model is None:
            return jsonify({
                "status": "error",
                "message": "Model not initialized. Restart the service."
            }), 500

        # Generate embedding
        embedding_obj = DeepFace.represent(
            img_path=image_path, model_name="Facenet", enforce_detection=False
        )[0]
        embedding = embedding_obj.get("embedding")

        print(f"✅ Embedding generated successfully for {image_path}")
        return jsonify({
            "status": "success",
            "embedding": embedding
        })

    except ValueError as ve:
        print(f"⚠️ ValueError: {ve}")
        return jsonify({
            "status": "error",
            "message": str(ve)
        }), 400

    except Exception as e:
        print("❌ Exception in /generate-embedding:", traceback.format_exc())
        return jsonify({
            "status": "error",
            "message": "Failed to generate embedding",
            "details": str(e)
        }), 500


# ------------------------------------------------------------
# 🧠 Route 2️⃣: Verify Face (for login)
# ------------------------------------------------------------
@app.route("/verify-face", methods=["POST"])
def verify_face():
    try:
        data = request.get_json(silent=True)
        face_image = data.get("faceImage") if data else None
        stored_embeddings = data.get("storedEmbeddings") if data else None

        if not face_image or not stored_embeddings:
            return jsonify({
                "status": "error",
                "message": "Missing image or stored embeddings"
            }), 400
            
        # Validate stored_embeddings format
        if not isinstance(stored_embeddings, list):
            return jsonify({
                "status": "error",
                "message": "Stored embeddings must be a list"
            }), 400
            
        if len(stored_embeddings) == 0:
            return jsonify({
                "status": "error",
                "message": "No stored embeddings provided"
            }), 400

        if model is None:
            return jsonify({
                "status": "error",
                "message": "Model not initialized. Restart the service."
            }), 500

        # Decode incoming base64 image
        try:
            img = decode_base64_image(face_image)
        except ValueError as ve:
            print(f"⚠️ Decode error: {ve}")
            return jsonify({
                "status": "error",
                "message": str(ve)
            }), 400

        # Generate embedding from captured image
        embedding_obj = DeepFace.represent(
            img_path=img, model_name="Facenet", enforce_detection=False
        )[0]
        embedding = np.array(embedding_obj["embedding"])
        print("Generated embedding shape:", embedding.shape)

        # Compare with stored embeddings
        best_score = 0
        valid_embeddings_found = False
        
        for emb in stored_embeddings:
            emb_np = np.array(emb)
            print("Stored embedding shape:", emb_np.shape)
            
            # Skip empty embeddings
            if emb_np.size == 0 or len(emb_np.shape) == 0:
                print("⚠️ Skipping empty embedding")
                continue
                
            # Ensure embedding has the correct shape (128 dimensions for FaceNet)
            if emb_np.shape != (128,):
                print(f"⚠️ Skipping embedding with incorrect shape: {emb_np.shape}")
                continue
                
            valid_embeddings_found = True
            similarity = np.dot(embedding, emb_np) / (
                np.linalg.norm(embedding) * np.linalg.norm(emb_np)
            )
            best_score = max(best_score, similarity)
        
        # If no valid embeddings were found, return an error
        if not valid_embeddings_found:
            return jsonify({
                "status": "error",
                "message": "No valid stored embeddings found. Please re-register your face."
            }), 400

        threshold = 0.7
        match = best_score >= threshold

        print(f"✅ Verification result: match={match}, confidence={best_score:.3f}")

        return jsonify({
            "status": "success",
            "match": bool(match),
            "confidence": float(best_score)
        })

    except Exception as e:
        print("❌ Exception in /verify-face:", traceback.format_exc())
        return jsonify({
            "status": "error",
            "message": "Face verification failed",
            "details": str(e)
        }), 500


# ------------------------------------------------------------
# 🚀 Run Flask App
# ------------------------------------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
