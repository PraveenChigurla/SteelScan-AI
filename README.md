# Steel Plate Fault Prediction

This project is a machine learning web application for predicting steel plate faults using a trained LightGBM model. It includes a FastAPI backend, a simple web interface, and APIs for single and batch predictions.

## Features

- Predict steel plate faults from input features
- Batch prediction from uploaded CSV files
- Metrics endpoint for model evaluation details
- Simple frontend UI served from the static folder
- Ready for deployment on free hosting platforms

## Project Structure

- app.py - FastAPI application and prediction endpoints
- train_and_serialize.py - Trains the model and creates serialized artifacts
- static/index.html - Frontend interface
- model.pkl - Serialized trained model
- label_encoder.pkl - Serialized label encoder
- metrics.json - Evaluation metrics and feature metadata
- stell-faults.csv - Training dataset

## Requirements

Install the required Python packages:

```bash
pip install fastapi uvicorn pandas numpy scikit-learn lightgbm
```

## Train the Model

If the model artifacts are missing, train and serialize them:

```bash
python train_and_serialize.py
```

## Run the Application Locally

Start the FastAPI app:

```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Then open:

```text
http://127.0.0.1:8000
```

## API Endpoints

- GET / - Main web UI
- GET /api/metrics - Returns model metrics
- POST /api/predict - Predicts a single record
- POST /api/predict-batch - Predicts from an uploaded CSV file

## Deployment

This project can be deployed on free platforms such as:

- Render
- Hugging Face Spaces
- Railway

For deployment, make sure the following files are included in the project:

- app.py
- model.pkl
- label_encoder.pkl
- metrics.json
- static/

## Notes

The application expects the model and metadata files to be present in the project root when it starts.
