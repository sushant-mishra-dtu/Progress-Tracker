import bcrypt
import getpass

print("🔒 Hardware AI Roadmap Tracker - Secure Hash Generator")
password = getpass.getpass("Enter your desired Master Password: ")

# Generate salt and hash
salt = bcrypt.gensalt()
hashed = bcrypt.hashpw(password.encode('utf-8'), salt)

print("\nSuccess! Here is your MASTER_PASSWORD_HASH:")
print("-" * 50)
print(hashed.decode('utf-8'))
print("-" * 50)
print("Copy the string above and save it as your MASTER_PASSWORD_HASH environment variable in Render.")
