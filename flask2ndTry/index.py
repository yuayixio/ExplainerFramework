from flask import Flask, render_template, request, redirect, flash, url_for
import main
import urllib.request
from app import app
from werkzeug.utils import secure_filename
from main import getPrediction
import os


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/', methods=['POST'])
def submit_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            flash('No file selected for uploading')
            return redirect(request.url)
        if file:
            model = request.form['model']
            filename = secure_filename(file.filename)
            full_filename = os.path.join(app.config['UPLOAD_FOLDER'],filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))
            label, acc = getPrediction(filename, model)
            flash(label)
            flash(acc)
            flash(model)
            flash(filename)
            return render_template('index.html', full_filename=full_filename)


if __name__ == "__main__":
    app.run()
