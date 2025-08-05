# Use the official Rust image as a base
FROM rust:1.74 as builder

WORKDIR /app
COPY . .

# Build release binary
RUN cargo build --release

# Use a small image to run the binary
FROM debian:bookworm-slim

COPY --from=builder /app/target/release/scanner_backend /scanner_backend
EXPOSE 4000
CMD ["/scanner_backend"]
