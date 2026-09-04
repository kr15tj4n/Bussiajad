#!/usr/bin/env bash
.venv/bin/gunicorn -b 127.0.0.1:5000 --reload app:app

