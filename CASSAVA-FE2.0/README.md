# CASSAVA-FE2.0
## Build images

    docker build -t cassava-app .

## Run images

    docker run -d --name cassava-app-container -p 8001:8001 cassava-app