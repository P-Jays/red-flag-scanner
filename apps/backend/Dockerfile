# Latest Rust with lockfile v4 support
FROM rust:latest AS builder

RUN apt-get update && apt-get install -y pkg-config libssl-dev

WORKDIR /app

COPY Cargo.toml Cargo.lock ./
COPY src ./src

RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y libssl3 ca-certificates && apt-get clean

COPY --from=builder /app/target/release/scanner_backend /scanner_backend

EXPOSE 4000
CMD ["/scanner_backend"]
