#!/usr/bin/env bash

# .venv/bin/gunicorn -b 127.0.0.1:5000 --reload app:app
# The first app is the filename (app.py)
# The second app is the Flask object inside it (app = Flask(__name__))

.venv/bin/gunicorn -b 127.0.0.1:5000 --reload app:app
