from inference_sdk import InferenceHTTPClient

# create an inference client
CLIENT = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key="vfmIKPYkwWrkEqO56fHP"
)

# run inference on a local image
print(CLIENT.infer(
    "your_image.jpg", 
    model_id="basketball-1zhpe-ylcag/1"
))
