# ⏱️ On-chain Stopwatch

A lightweight, blockchain-backed stopwatch with a minimal UI and React hook.  
Interact with an on-chain stopwatch smart contract that provides verifiable, decentralized timing using the Flare Coston2 network.

---

## 📍 Contract Address

<img width="1877" height="857" alt="image" src="https://github.com/user-attachments/assets/8ee685a0-435d-409d-a885-278dd48ce1b7" />
**Address:** `0xE6e88A039449918a1E617a7Ec190E5C681a4Ab83`  
**Explorer:** https://coston2-explorer.flare.network/address/0xE6e88A039449918a1E617a7Ec190E5C681a4Ab83

---

## 📝 Overview

This project includes a basic frontend and a React hook for interacting with a deployed on-chain stopwatch smart contract.  
It demonstrates how to:

- Connect a wallet using **Wagmi**
- Read on-chain stopwatch state
- Start, stop, and reset the stopwatch
- Handle transactions and real-time updates

It is ideal for:
- Developer demos  
- Learning on-chain time concepts  
- Integrating decentralized time tracking  
- Demonstrating contract → UI interactions  

---

## 📂 Codebase Structure

| File | Purpose |
|------|---------|
| `lib/contract.ts` | Contract address + ABI (viem/wagmi compatible) |
| `hooks/useContract.ts` | React hook that wraps reads & writes |
| `components/sample.tsx` | Minimal UI demonstrating functionality |

---

## 🚀 Features

### 🔐 Wallet Gated UI
- Requires wallet connection  
- Seamlessly uses Wagmi connectors  

### 👁️ Read-Only Views
- `elapsedTime` — total elapsed seconds (formatted in UI)
- `isRunning` — current running/stopped state
- `startTime` — timestamp the stopwatch last started
- `getCurrentTime()` — latest chain timestamp

### ✏️ Write Actions
- `start()` — starts the stopwatch
- `stop()` — stops and records elapsed time
- `reset()` — clears stopwatch values

### 🔄 Transaction & State Handling
- Displays pending → confirming → confirmed states
- Shows transaction hash
- Handles errors gracefully
- Auto-refresh and manual refresh support

### 🧼 Simple & Clean UI
- Minimal design
- Clear button states
- Great for demos and prototyping

---

## 🧠 Why On-Chain Timing?

Most apps rely on centralized clocks that can’t be independently verified.  
This stopwatch uses **on-chain timestamps**, enabling:

- **Decentralized timing** — trustless and validated by blockchain consensus  
- **Auditability** — every action is on the public ledger  
- **Verifiability** — elapsed time is provable  
- **Stateless frontend** — all real data lives on-chain  

### Use Cases
- On-chain contests or games  
- Timed auctions  
- Educational Web3 demos  
- Immutable time-based logging  
- Process tracking  
- Smart contract time experiments  

---

## ⚙️ Technical Notes

- Built using **Wagmi + viem** for contract communication
- Uses:
  - `useReadContract`
  - `useWriteContract`
  - `useWaitForTransactionReceipt`
- UI formats timestamps to:
  - `HH:MM:SS`  
  - ISO date formats  
- No application-level state — blockchain is the source of truth  

---

## ▶️ How to Run

1. Set up a React project (Vite, Next.js, or CRA).
2. Install and configure **Wagmi** + **Viem**.
3. Add the following files to your project:
   - `lib/contract.ts`
   - `hooks/useContract.ts`
   - `components/sample.tsx`
4. Import and render the component:

```tsx
<StopwatchSample />
