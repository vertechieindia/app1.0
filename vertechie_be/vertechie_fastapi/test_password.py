
import bcrypt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)

passwords_to_check = [
    ("TestPass@123", "$2b$12$Hm5z1R9Wdalqhu6.x4BW6eWyRCfTdFAIlttI3jays1DREd75VX0IK"), # John Doe
    ("TestPass@123", "$2b$12$iPupnDKGgfFzHZJwJp.ulu5XBktpWLBNHa6WgOCQD4Q799DiCWnsS")  # Jane Smith
]

for plain, hashed in passwords_to_check:
    print(f"Checking {plain} against {hashed}: {verify_password(plain, hashed)}")
