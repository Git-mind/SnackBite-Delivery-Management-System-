FROM python:3-slim
WORKDIR /usr/src/app
COPY http.reqs.txt ./
RUN pip install --no-cache-dir -r http.reqs.txt
COPY ./review_management.py ./invokes.py ./
CMD [ "python", "./review_management.py" ]