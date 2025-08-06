# ===================================
# 🚀 LOCAL DEV (no Docker)
# ===================================

run-frontend:
	cd apps/frontend && npm run dev

run-backend:
	cd apps/backend && cargo run

# ===================================
# 🐳 DOCKERIZED BACKEND
# ===================================

build-backend:
	cd apps/backend && docker build -t scanner-backend .

start-backend:
	docker run -p 4000:4000 scanner-backend

stop-backend:
	docker stop $$(docker ps -q --filter ancestor=scanner-backend)

restart-backend:
	make stop-backend && make start-backend

logs-backend:
	docker logs $$(docker ps -lq)

# ===================================
# 🔁 COMBINED SHORTCUTS
# ===================================

run-all:
	make run-backend & make run-frontend

docker-all:
	make build-backend && make start-backend
