
# # emotion_detector.py
# import os
# import numpy as np
# import cv2
# import time
# import base64
# import pandas as pd
# import keras
# from tensorflow.keras.applications.resnet_v2 import preprocess_input


# class EmotionDetector:
#     def __init__(self):
#         print("Loading TensorFlow model and data...")
#         start_time = time.time()

#         # Disable OpenCL and OpenCV optimizations
#         cv2.ocl.setUseOpenCL(False)  # Ensure OpenCL is disabled
#         cv2.setUseOptimized(False)  # Disable OpenCV optimizations

#         # Build absolute path for the model checkpoint
#         model_path = os.path.join(os.path.dirname(__file__), 'ResNet50V2_Model_Checkpoint', 'resnet50v2_best.keras')
#         self.model = keras.models.load_model(model_path)

#         # Build absolute path for Haar Cascade file
#         cascade_path = os.path.join(os.path.dirname(__file__), 'emotion_detector', 'haarcascade_frontalface_default.xml')
#         self.face_cascade = cv2.CascadeClassifier(cascade_path)
#         if self.face_cascade.empty():
#             raise FileNotFoundError("Haar Cascade file not found. Please check your path: " + cascade_path)

#         # Build absolute path for the CSV file with music data
#         csv_path = os.path.join(os.path.dirname(__file__), 'emotion_detector', 'data_moods.csv')
#         self.music_player = pd.read_csv(csv_path)
#         self.music_player = self.music_player[['name', 'artist', 'mood', 'popularity']]

#         # Define emotion classes
#         self.emotion_classes = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']
#         print(f"Models loaded in {time.time()-start_time:.2f}s.")

#     def process_base64_image(self, image_data: str):
#         """Process a base64-encoded image, detect emotion, and (optionally) recommend songs."""
#         start_time = time.time()
#         try:
#             # Expect image_data to be in the format "data:image/jpeg;base64,..."
#             encoded_data = image_data.split(',')[1]
#             nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
#             img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
#         except Exception as e:
#             return {"error": f"Image decoding error: {str(e)}"}

#         # Resize for face detection
#         img_resized = cv2.resize(img, (320, 240), interpolation=cv2.INTER_AREA)  # Reduced size
#         gray = cv2.cvtColor(img_resized, cv2.COLOR_BGR2GRAY)

#         # Detect faces using Haar Cascade
#         faces = self.face_cascade.detectMultiScale(
#             gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
#         )
#         if len(faces) == 0:
#             return {"error": "No face detected"}



#         # Choose the largest face detected
#         faces = sorted(faces, key=lambda x: x[2] * x[3], reverse=True)
#         x, y, w, h = faces[0]

#         # Scale back to original image coordinates
#         scale_x = img.shape[1] / 320
#         scale_y = img.shape[0] / 240
#         x_orig = int(x * scale_x)
#         y_orig = int(y * scale_y)
#         w_orig = int(w * scale_x)
#         h_orig = int(h * scale_y)
#         face_img = img[y_orig:y_orig + h_orig, x_orig:x_orig + w_orig]

#         # Resize to the model input size 224x224
#         face_img = cv2.resize(face_img, (224, 224), interpolation=cv2.INTER_AREA)
#         face_img = cv2.cvtColor(face_img, cv2.COLOR_BGR2RGB)
#         face_img = preprocess_input(face_img)
#         face_img = np.expand_dims(face_img, axis=0)

#         # Predict emotion
#         try:
#             pred = self.model.predict(face_img)
#             emotion_idx = int(np.argmax(pred))
#             emotion = self.emotion_classes[emotion_idx]
#             return {"emotion": emotion}
#         except Exception as e:
#             return {"error": f"Error during emotion prediction: {str(e)}"}



# emotion_detector.py
import os
import numpy as np
import cv2
import time
import base64
import pandas as pd
import keras
from tensorflow.keras.applications.resnet_v2 import preprocess_input


class EmotionDetector:
    def __init__(self):
        print("Loading TensorFlow model and data...")
        start_time = time.time()

        # Disable OpenCL and OpenCV optimizations
        cv2.ocl.setUseOpenCL(False)  # Ensure OpenCL is disabled
        cv2.setUseOptimized(False)  # Disable OpenCV optimizations

        # Build absolute path for the model checkpoint
        model_path = os.path.join(os.path.dirname(__file__), 'ResNet50V2_Model_Checkpoint', 'resnet50v2_best.keras')
        self.model = keras.models.load_model(model_path)

        # Build absolute path for Haar Cascade file
        cascade_path = os.path.join(os.path.dirname(__file__), 'emotion_detector', 'haarcascade_frontalface_default.xml')
        self.face_cascade = cv2.CascadeClassifier(cascade_path)
        if self.face_cascade.empty():
            raise FileNotFoundError("Haar Cascade file not found. Please check your path: " + cascade_path)

        # Build absolute path for the CSV file with music data
        csv_path = os.path.join(os.path.dirname(__file__), 'emotion_detector', 'data_moods.csv')
        self.music_player = pd.read_csv(csv_path)
        self.music_player = self.music_player[['name', 'artist', 'mood', 'popularity']]

        # Define emotion classes
        self.emotion_classes = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']
        print(f"Models loaded in {time.time()-start_time:.2f}s.")

def process_base64_image(self, image_data: str):
    """Process a base64-encoded image, detect emotion, and (optionally) recommend songs."""
    start_time = time.time()
    try:
        # Expect image_data to be in the format "data:image/jpeg;base64,..."
        encoded_data = image_data.split(',')[1]
        nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    except Exception as e:
        return {"error": f"Image decoding error: {str(e)}"}

    # Resize for face detection
    img_resized = cv2.resize(img, (320, 240), interpolation=cv2.INTER_AREA)  # Reduced size
    gray = cv2.cvtColor(img_resized, cv2.COLOR_BGR2GRAY)

    # Detect faces using Haar Cascade
    faces = self.face_cascade.detectMultiScale(
        gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
    )
    if len(faces) == 0:
        return {"error": "No face detected"}

    # Draw rectangles around all detected faces
    for (x, y, w, h) in faces:
        cv2.rectangle(img_resized, (x, y), (x + w, y + h), (255, 0, 0), 2)  # Blue rectangle

    # Choose the largest face detected
    faces = sorted(faces, key=lambda x: x[2] * x[3], reverse=True)
    x, y, w, h = faces[0]

    # Scale back to original image coordinates
    scale_x = img.shape[1] / 320
    scale_y = img.shape[0] / 240
    x_orig = int(x * scale_x)
    y_orig = int(y * scale_y)
    w_orig = int(w * scale_x)
    h_orig = int(h * scale_y)
    face_img = img[y_orig:y_orig + h_orig, x_orig:x_orig + w_orig]

    # Resize to the model input size 224x224
    face_img = cv2.resize(face_img, (224, 224), interpolation=cv2.INTER_AREA)
    face_img = cv2.cvtColor(face_img, cv2.COLOR_BGR2RGB)
    face_img = preprocess_input(face_img)
    face_img = np.expand_dims(face_img, axis=0)

    # Predict emotion
    try:
        pred = self.model.predict(face_img)
        emotion_idx = int(np.argmax(pred))
        emotion = self.emotion_classes[emotion_idx]

        # Encode the image with rectangles back to base64 for visualization
        _, buffer = cv2.imencode('.jpg', img_resized)
        img_base64 = base64.b64encode(buffer).decode('utf-8')

        return {"emotion": emotion, "image_with_faces": f"data:image/jpeg;base64,{img_base64}"}
    except Exception as e:
        return {"error": f"Error during emotion prediction: {str(e)}"}