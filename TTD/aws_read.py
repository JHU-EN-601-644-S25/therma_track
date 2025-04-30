from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
from w1thermsensor import W1ThermSensor
import time
import json

# AWS IoT Core settings
client_id = "data_getter_1"
endpoint = "a2dx7s2s5ep17h-ats.iot.us-east-2.amazonaws.com"
port = 8883
topic = "bodytemp/data"

# Certificate paths
root_ca_path = "aws-iot/AmazonRootCA1.pem"
private_key_path = "aws-iot/f404df321c4478779accec5887c50e2205039f169f17b34634ec625fe21f46c5-private.pem.key"
certificate_path = "aws-iot/f404df321c4478779accec5887c50e2205039f169f17b34634ec625fe21f46c5-certificate.pem.crt"

# MQTT client config
mqtt_client = AWSIoTMQTTClient(client_id)
mqtt_client.configureEndpoint(endpoint, port)
mqtt_client.configureCredentials(root_ca_path, private_key_path, certificate_path)

mqtt_client.configureOfflinePublishQueueing(-1)  # Infinite queue
mqtt_client.configureDrainingFrequency(2)
mqtt_client.configureConnectDisconnectTimeout(10)
mqtt_client.configureMQTTOperationTimeout(5)

# Connect to AWS
mqtt_client.connect()
print("Connected to AWS IoT Core!")

# Temperature sensor
sensor = W1ThermSensor()

while True:
    temperature = sensor.get_temperature()
    payload = {
        "patient_id": "2",
        "device_id": "1",  # IMPORTANT: now included
        "temperature": round(temperature, 2),
        "timestamp": int(time.time())
    }
    print("Publishing:", payload)
    mqtt_client.publish(topic, json.dumps(payload), 1)
    time.sleep(5)
