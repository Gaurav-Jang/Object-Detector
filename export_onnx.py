# from ultralytics import YOLO

# models = ['yolov8n', 'yolov8s','yolov8m', 'yolov8l']  # Add more if needed

# for model_name in models:
#     model = YOLO(f'{model_name}.pt')         # Download pretrained
#     model.export(format='onnx')              # Export as ONNX


from ultralytics import YOLO

# Load a pretrained segmentation model
model = YOLO("yolov8s-seg.pt")

# Export to ONNX
model.export(format="onnx")
