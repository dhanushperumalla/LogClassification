import pandas as pd
from fastapi import FastAPI, UploadFile, HTTPException, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import aiofiles
from classify import classify
import logging

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Updated to match your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.post("/classify/")
async def classify_logs(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV.")
    
    output_file = "resources/output.csv"
    input_file = "resources/uploaded_file.csv"
    
    try:
        # Ensure resources directory exists
        os.makedirs("resources", exist_ok=True)
        
        # Save the uploaded file
        async with aiofiles.open(input_file, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)
        
        # Read the saved CSV
        df = pd.read_csv(input_file)
        
        # Validate required columns
        if "source" not in df.columns or "log_message" not in df.columns:
            raise HTTPException(
                status_code=400, 
                detail="CSV must contain 'source' and 'log_message' columns."
            )

        # Perform classification
        df["target_label"] = classify(list(zip(df["source"], df["log_message"])))

        logger.info("Dataframe: %s", df.to_dict())

        # Save the modified file
        df.to_csv(output_file, index=False)
        logger.info("File saved to output.csv")
        
        response = FileResponse(
            output_file, 
            media_type='text/csv',
            filename="classified_logs.csv"
        )
        
    except pd.errors.EmptyDataError:
        raise HTTPException(status_code=400, detail="The uploaded CSV file is empty.")
    except pd.errors.ParserError:
        raise HTTPException(status_code=400, detail="Invalid CSV format.")
    except Exception as e:
        logger.error("An error occurred: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e))
    
    # Clean up the input and output files after sending the response
    finally:
        if os.path.exists(input_file):
            try:
                os.remove(input_file)
            except Exception as e:
                logger.error("Failed to remove input file: %s", str(e))
    
    return response