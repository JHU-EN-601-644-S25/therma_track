import random
from twilio.rest import Client


def generate_sms_code():
    return str(random.randint(100000, 999999))


def send_sms(user_phone, code):
    # Initialize Twilio client
    client = Client(app.config["TWILIO_ACCOUNT_SID"], app.config["TWILIO_AUTH_TOKEN"])

    # Send the SMS
    message = client.messages.create(
        body=f"Your 2FA code is: {code}",
        from_=app.config["TWILIO_PHONE_NUMBER"],
        to=user_phone,
    )

    return message.sid
