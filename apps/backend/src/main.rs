use axum::{routing::get, Router};
use axum_server::Server;
use std::net::SocketAddr;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/ping", get(ping))
        .route("/health", get(health))
        .route("/version", get(version));

    let addr = SocketAddr::from(([0, 0, 0, 0], 4000));
    println!("🚀 Listening on http://{}", addr);
    Server::bind(addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn ping() -> &'static str {
    "pong"
}

async fn health() -> &'static str {
    "OK"
}

async fn version() -> &'static str {
    "v0.1.0"
}