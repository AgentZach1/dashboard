import paho.mqtt.client as mqtt
import mysql.connector
from datetime import datetime
from dotenv import load_dotenv 
import os

load_dotenv()

# Setup database connection
db = mysql.connector.connect(
  host=os.getenv("DB_HOST"),
  user=os.getenv("DB_USER"),
  password=os.getenv("DB_PASSWORD"),
  database=os.getenv("DB_DATABASE")
)

cursor = db.cursor()

tableName = "readings_tent"

# Create table if it doesn't exist
cursor.execute("""
CREATE TABLE IF NOT EXISTS """ + tableName + """ (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATETIME,
    carbon_dioxide INT,
    temperature INT,
    humidity INT,
    light INT,
    time_stamp INT
)
""")

# Initialize dictionary to store the latest readings
latest_readings = {}

# Value is amount received from broker aka length of 
# latest readings but for each message
just_sent = 0

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT Broker successfully: ")
    else:
        print("Error Connecting. Exit Code: " + str(rc))
    
    client.subscribe("co2") # subscribe to "co2" topic
    client.subscribe("temp")  
    client.subscribe("time_stamp")  

def on_message(client, userdata, msg):
    print("Received update on "+msg.topic+": "+str(msg.payload))
    global just_sent

    # Update latest readings
    latest_readings[msg.topic] = msg.payload

    # Update sent
    just_sent+=1
    
    # Check if we have all readings, and if so, insert into database
    if set(['co2', 'temp', 'time_stamp']).issubset(latest_readings) and just_sent > 2:
        query = "INSERT INTO " + tableName + " (date, carbon_dioxide, temperature, humidity, light, time_stamp) VALUES (%s, %s, %s, %s, %s, %s)"
        values = (datetime.now(), latest_readings['co2'], latest_readings['temp'], 50, 20000, latest_readings['time_stamp'])
        cursor.execute(query, values)
        db.commit()
        just_sent = 0
        print("Just sent a new set of values to " + tableName)


client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

# Connect to MQTT broker
mqtt_ip = os.getenv("DB_HOST")
client.connect(mqtt_ip if mqtt_ip else "localhost", 1883, 60)
client.loop_forever()
