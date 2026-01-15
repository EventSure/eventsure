# EventSure

**EventSure** is an episode-based, rule-driven insurance platform that resolves real-world event risk on-chain by rules, not trust.

It is designed to reduce uncertainty around everyday events such as flight delays, weather disruptions, and trip cancellations.

---

## 🧩 Problem

Everyday risks like flight delays, weather disruptions, or trip cancellations affect millions of people,  
yet existing insurance systems are poorly designed to handle these **small, one-off real-world events**.

Traditional insurance relies on:
- Trust in opaque institutions  
- Complex policies that users rarely understand  
- Manual claims and post-event disputes  

As a result, insurance remains something users argue about *after* the event,  
instead of something they can clearly understand and decide on *before* it happens.

---

## 💡 Solution

**EventSure** introduces an **episode-based, rule-driven insurance model**.

Instead of long-term policies, EventSure creates **Episodes**:
- Each Episode represents a single real-world event  
  (e.g. a specific flight on a specific date)
- All rules are fixed upfront:
  - Coverage conditions  
  - Oracle data source  
  - Settlement logic  
  - Maximum possible loss  
- Users do not buy insurance.  
  They **join an episode**, becoming temporary members of a shared risk pool.

When the event ends, oracle data deterministically resolves the outcome on-chain.  
There are **no claims, no interpretation, and no manual intervention**.  
Each episode settles transparently and closes permanently.

EventSure shifts insurance from **trust-based promises**  
to **rule-based financial systems**.

---

## 🏗 How It Works

1. **Explore Episodes**  
   Browse real-world event episodes with fixed duration and conditions.

2. **Review the Rules**  
   Understand exactly what is covered, how outcomes are determined,  
   and what your maximum loss is before joining.

3. **Join the Episode**  
   You don’t buy insurance.  
   You join a shared risk pool with capped risk and no additional contributions.

4. **Automatic Resolution**  
   When the event ends, oracle data resolves the outcome automatically on-chain.

---

## 💰 Business Model

EventSure is designed as a **protocol-level platform**, not a traditional insurer.

**Planned revenue streams:**
- Protocol fees at episode creation or settlement  
- Infrastructure fees for oracle resolution and execution  
- Future fees from composability of episode positions  
  (e.g. DeFi integrations, collateral usage)

**Key characteristics:**
- No balance sheet risk  
- No underwriting discretion  
- No incentive misalignment with users  
- Member-aligned pools with transparent surplus handling  

---

## 🗺 Roadmap

### Phase 1 — Hackathon MVP (Current)
- Flight delay episodes  
- Wallet-based participation  
- Rule Review → Join Episode → Automatic Resolution flow  
- Oracle-based settlement  
- Episode-level closure and transparency  

### Phase 2 — Expanded Event Coverage
- Weather-related disruptions  
- Trip cancellations  
- Additional parametric, one-off real-world events  

### Phase 3 — RealFi & Composability
- Episode positions as on-chain financial primitives  
- Integration with DeFi protocols  
- Advanced RealFi use cases around real-world risk  

---

## 🔑 One-line Takeaway

**EventSure resolves real-world event risk on-chain by rules, not trust.**

---

## 🧪 Demo

The demo video walks through the full user flow:
- Wallet connection  
- Episode exploration  
- Rule review  
- Joining an episode  
- Automatic oracle-based resolution  

Demo file:  
[`EventSure_Demo_FlightDelay.mp4`](https://www.youtube.com/watch?v=mvhhXObFt3o)

---

## 📦 Deployment

This project is deployed on **Mantle**.

> Contract address:  
> 0xc3f1030491964136a466c699a96395d4B931a2E1

---

## ⚠️ Disclaimer

EventSure is a hackathon prototype and not a licensed insurance product.  
It is intended for demonstration and educational purposes only.
