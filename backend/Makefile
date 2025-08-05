run:
	docker build -t scanner-backend . && docker run -p 4000:4000 scanner-backend

build:
	docker build -t scanner-backend .

start:
	docker run -p 4000:4000 scanner-backend

stop:
	docker stop $$(docker ps -q --filter ancestor=scanner-backend)

restart:
	make stop && make start

logs:
	docker logs $$(docker ps -lq)
