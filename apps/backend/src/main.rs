use axum::{
    routing::{get},
    Router,
    extract::Path,
    Json,
};
use axum_server::Server;
use serde_json::Value;
use serde::Serialize;
use std::net::SocketAddr;

#[derive(Serialize)]
struct SupplyResponse {
    token: String,
    total_supply: Option<f64>,
    circulating_supply: Option<f64>,
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/ping", get(ping))
        .route("/health", get(health))
        .route("/version", get(version))
        .route("/supply/:token", get(get_supply));

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

async fn get_supply(Path(token): Path<String>) -> Json<SupplyResponse> {
    let url = format!("https://api.coingecko.com/api/v3/coins/{}", token);

    let resp = reqwest::get(&url)
        .await
        .expect("Failed to fetch data")
        .json::<Value>()
        .await
        .expect("Invalid JSON");

    let total_supply = resp["market_data"]["total_supply"].as_f64();
    let circulating_supply = resp["market_data"]["circulating_supply"].as_f64();

    Json(SupplyResponse {
        token,
        total_supply,
        circulating_supply,
    })
}