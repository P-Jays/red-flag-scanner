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
use std::{collections::HashMap, sync::Arc, time::{SystemTime, Duration}};
use tokio::sync::Mutex;

#[derive(Serialize, Clone, Debug)]
struct SupplyResponse {
    token: String,
    total_supply: Option<f64>,
    circulating_supply: Option<f64>,
}

#[tokio::main]
async fn main() {

    let cache: Arc<Mutex<HashMap<String, (SupplyResponse, SystemTime)>>> =
        Arc::new(Mutex::new(HashMap::new()));

    let app = Router::new()
        .route("/ping", get(ping))
        .route("/health", get(health))
        .route("/version", get(version))
        .route("/supply/:token", get({
            let cache = cache.clone();
            move |path| get_supply(path, cache)
        }));

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

async fn get_supply(
    Path(token): Path<String>,
    cache: Arc<Mutex<HashMap<String, (SupplyResponse, SystemTime)>>>,
) -> Json<SupplyResponse> {
    let now = SystemTime::now();
    let cache_duration = Duration::from_secs(60); // 1 minute cache

    {
        let cache_guard = cache.lock().await;
        if let Some((cached_value, timestamp)) = cache_guard.get(&token) {
            if now.duration_since(*timestamp).unwrap() < cache_duration {
                println!("⚡ [CACHE HIT] Returning cached result for {}", token);
                return Json(cached_value.clone());
            } else {
                println!("⏳ [CACHE EXPIRED] Fetching fresh data for {}", token);
            }
        } else {
            println!("🔍 [CACHE MISS] No cache found for {}, fetching fresh", token);
        }
    }

    let url = format!("https://api.coingecko.com/api/v3/coins/{}", token);
    let resp = reqwest::get(&url)
        .await
        .expect("Failed to fetch data")
        .json::<Value>()
        .await
        .expect("Invalid JSON");

    let total_supply = resp["market_data"]["total_supply"].as_f64();
    let circulating_supply = resp["market_data"]["circulating_supply"].as_f64();

    let result = SupplyResponse {
        token: token.clone(),
        total_supply,
        circulating_supply,
    };

    {
        let mut cache_guard = cache.lock().await;
        cache_guard.insert(token.clone(), (result.clone(), now));
    }

    println!("✅ [CACHE STORE] Saved new data for {}", token);

    Json(result)
}