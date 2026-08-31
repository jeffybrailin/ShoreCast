from config import get_settings


def calculate_suitability_score(
    wave_height: float,
    uv_index: float,
    tide_level: float = 0.5,
    alert_severity: str = "LOW",
    wind_speed: float = 0.0,
) -> dict:
    """
    Multi-variable coastal suitability score (0-100).
    100 = perfectly safe, 0 = extremely dangerous.
    """
    settings = get_settings()

    # Normalize wave height (0=calm, 1=dangerous; threshold 4m)
    wave_norm = min(wave_height / 4.0, 1.0)
    wave_score = 1.0 - wave_norm

    # Normalize UV index (0=safe, 1=extreme; threshold 11)
    uv_norm = min(uv_index / 11.0, 1.0)
    uv_score = 1.0 - uv_norm

    # Normalize tide (0=low safe, 1=high dangerous; 0-5m range)
    tide_norm = min(tide_level / 5.0, 1.0)
    tide_score = 1.0 - tide_norm

    # Alert penalty
    alert_penalties = {"LOW": 0.0, "MEDIUM": 0.15, "HIGH": 0.35, "CRITICAL": 0.60}
    alert_penalty = alert_penalties.get(alert_severity, 0.0)

    # Weighted composite
    raw_score = (
        settings.suitability_wave_weight * wave_score +
        settings.suitability_uv_weight   * uv_score   +
        settings.suitability_tide_weight * tide_score  +
        settings.suitability_alert_weight * (1.0 - alert_penalty)
    )

    final_score = max(0.0, min(100.0, raw_score * 100))

    if final_score >= 75:
        category = "SAFE"
        color = "#0ea5e9"
    elif final_score >= 50:
        category = "CAUTION"
        color = "#f97316"
    elif final_score >= 25:
        category = "DANGER"
        color = "#dc2626"
    else:
        category = "CRITICAL"
        color = "#7c3aed"

    return {
        "score": round(final_score, 1),
        "category": category,
        "color": color,
        "components": {
            "wave_height_m": wave_height,
            "uv_index": uv_index,
            "tide_level_m": tide_level,
            "alert_severity": alert_severity,
            "wind_speed_kmh": wind_speed,
        },
    }


def classify_anomaly(
    current_wave: float,
    baseline_wave: float,
    threshold_multiplier: float = 2.0
) -> bool:
    """Detect sudden wave surge anomaly for Sentinel Agent."""
    return current_wave > (baseline_wave * threshold_multiplier) or current_wave > 4.0
