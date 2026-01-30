# Simple BookmarkWebApp

With backend written in C# ASP.NET with MongoDB, Backend is a RESTFUL API. FrontEnd is written using React + Typescript.


To Test WebApp, install docker, go to root of this project using a terminal

```
docker compose up
```

Frontend will run on port 5173, so visit:

```
http://localhost:5173
```

Backend will run on port 5225, so it will send HTTP requests too:

```
http://localhost:5225
```
You can also change the ports, using compose.yaml file, exposing [your port] : [containers port]

When you're done testing run each of these lines, make sure to change the IMAGEID:

```
docker compose down
docker image ls
docker rmi -f [IMAGEID] <= Run for each image
```

This is a project, I wanted to do to get used to writing api's in ASP.NET using minimal api.
