def compute_score(page_views: int, form_submits: int, repeat_visits: int) -> int:
    raw = page_views * 5 + form_submits * 25 + repeat_visits * 10
    return min(raw, 100)


def get_band(score: int) -> str:
    if score >= 80:
        return "hot"
    if score >= 50:
        return "warm"
    if score >= 20:
        return "interested"
    return "cold"
