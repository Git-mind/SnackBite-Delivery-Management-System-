FROM python:3-slim
WORKDIR /usr/src/app
COPY http.reqs.txt ./
RUN pip install --no-cache-dir -r http.reqs.txt
COPY ./order_management.py ./invokes.py ./ amqp_setup.py ./
CMD [ "python", "./order_management.py" ]