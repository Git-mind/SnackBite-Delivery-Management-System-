FROM python:3-slim
WORKDIR /usr/src/app
COPY http.reqs.txt ./
RUN pip install --no-cache-dir -r http.reqs.txt 
COPY ./activity_log.py ./amqp_setup.py 
CMD [ "python", "./activity_log.py" ] 