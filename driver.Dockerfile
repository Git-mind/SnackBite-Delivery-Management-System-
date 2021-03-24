FROM python:3-slim
WORKDIR /usr/src/app
COPY http.reqs.txt ./
RUN pip install --no-cache-dir -r http.reqs.txt
COPY ./driver.py ./
CMD [ "python", "./driver.py" ]

#docker build -t feelg8d/driver:1.0 ./
#docker images  
#docker run -p 5001:5001 -e 
#docker ps
#If you need to remove an image, enter docker rmi <image id>
#docker stop <containerid>
#docker start <containerid>
#docker logs <containerid>
