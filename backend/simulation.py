"""
Lightweight agent-based simulation for the impact timeline.

This is intentionally simple (no Mesa dependency) so it's easy to explain
and defend: each stakeholder group named in the analysis is treated as an
"agent" with an adaptability trait (how quickly that kind of group typically
adjusts to policy change, e.g. exporters/urban workers adapt faster than
smallholder farmers). The simulated system's overall impact score starts at
the computed base risk score and decays toward an equilibrium value over
time, at a rate driven by the weighted-average adaptability of the named
stakeholder agents.

This replaces letting the LLM freely invent five timeline numbers — the
trajectory is now a deterministic function of (a) the rule-based risk score
and (b) which stakeholder groups are involved, so re-running it on the same
inputs gives the same curve.
"""

import math

ADAPTABILITY_PRIORS = {
    "farmer": 0.25,
    "rural": 0.30,
    "urban worker": 0.55,
    "worker": 0.50,
    "exporter": 0.75,
    "business": 0.70,
    "industry": 0.70,
    "state government": 0.45,
    "government": 0.45,
    "student": 0.60,
    "consumer": 0.55,
    "healthcare": 0.40,
    "patient": 0.35,
}

DEFAULT_ADAPTABILITY = 0.5

SEVERITY_WEIGHT = {"high": 1.0, "medium": 0.6, "low": 0.3}

PERIODS = [
    ("6 months", 0.5),
    ("1 year", 1.0),
    ("2 years", 2.0),
    ("3 years", 3.0),
    ("5 years", 5.0),
]


def _agent_adaptability(group_name: str) -> float:
    name = group_name.lower()
    for key, val in ADAPTABILITY_PRIORS.items():
        if key in name:
            return val
    return DEFAULT_ADAPTABILITY


def _weighted_adaptability(stakeholders: list) -> float:
    if not stakeholders:
        return DEFAULT_ADAPTABILITY

    total_weight = 0.0
    weighted_sum = 0.0
    for s in stakeholders:
        w = SEVERITY_WEIGHT.get(str(s.get("severity", "medium")).lower(), 0.6)
        a = _agent_adaptability(str(s.get("group", "")))
        weighted_sum += a * w
        total_weight += w

    if total_weight == 0:
        return DEFAULT_ADAPTABILITY
    return weighted_sum / total_weight


def simulate_timeline(base_risk_score: float, stakeholders: list) -> list:
    """
    Returns a list of {period, impact_score, description} dicts, computed
    (not LLM-generated), representing how the overall friction/impact score
    is expected to evolve as stakeholder agents adapt.
    """
    adaptability = _weighted_adaptability(stakeholders)

    equilibrium = base_risk_score * (1 - 0.55 * adaptability)
    decay_rate = 0.15 + 0.5 * adaptability  # per-year

    timeline = []
    for period_label, t in PERIODS:
        score = equilibrium + (base_risk_score - equilibrium) * math.exp(-decay_rate * t)
        score = round(max(0, min(100, score)))

        pct_resolved = round(100 * (1 - (score - equilibrium) / (base_risk_score - equilibrium))) \
            if base_risk_score != equilibrium else 100

        description = (
            f"Projected impact score ~{score}/100. Based on stakeholder adaptability "
            f"(avg. {round(adaptability * 100)}%), roughly {max(0, min(100, pct_resolved))}% "
            f"of initial friction is expected to have resolved by this point."
        )

        timeline.append({
            "period": period_label,
            "impact_score": score,
            "description": description,
        })

    return timeline