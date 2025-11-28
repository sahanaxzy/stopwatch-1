// components/sample.tsx
"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { useStopwatchContract } from "@/hooks/useContract"

const StopwatchSample = () => {
  const { isConnected } = useAccount()
  const { data, actions, state, refetch } = useStopwatchContract()
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    let id: number | undefined
    if (autoRefresh) {
      // poll every 2 seconds for live updates
      id = window.setInterval(() => {
        actions.refresh().catch(() => {
          /* ignore refresh errors */
        })
      }, 2000)
    }
    return () => {
      if (id) window.clearInterval(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh])

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold text-foreground mb-3">Stopwatch Contract</h2>
          <p className="text-muted-foreground">Please connect your wallet to interact with the stopwatch contract.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">On-chain Stopwatch</h1>
          <p className="text-muted-foreground text-sm mt-1">Start, stop and reset a simple on-chain stopwatch.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">Elapsed Time</p>
            <p className="text-2xl font-semibold text-foreground">{data.elapsedTime}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">Status</p>
            <p className="text-2xl font-semibold text-foreground">{data.isRunning ? "Running" : "Stopped"}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Start Time</p>
              <p className="text-sm text-foreground">{data.startTime}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Current Chain Time</p>
              <p className="text-sm text-foreground">{data.currentTime}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => actions.start().catch((e) => console.error(e))}
              disabled={state.isLoading || data.isRunning}
              className="flex-1 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {state.isLoading ? "Processing..." : "Start"}
            </button>
            <button
              onClick={() => actions.stop().catch((e) => console.error(e))}
              disabled={state.isLoading || !data.isRunning}
              className="flex-1 px-6 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {state.isLoading ? "Processing..." : "Stop"}
            </button>
            <button
              onClick={() => actions.reset().catch((e) => console.error(e))}
              disabled={state.isLoading}
              className="px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              Reset
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-muted-foreground">Auto-refresh</label>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="h-4 w-4"
            />
            <button
              onClick={() => refetch.refetchElapsedTime().catch(() => {})}
              className="ml-auto px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:opacity-90 transition-opacity"
            >
              Refresh Now
            </button>
          </div>

          {state.hash && (
            <div className="mt-2 p-4 bg-card border border-border rounded-lg">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Transaction Hash</p>
              <p className="text-sm font-mono text-foreground break-all mb-3">{state.hash}</p>
              {state.isConfirming && <p className="text-sm text-primary">Waiting for confirmation...</p>}
              {state.isConfirmed && <p className="text-sm text-green-500">Transaction confirmed!</p>}
            </div>
          )}

          {state.error && (
            <div className="mt-2 p-4 bg-card border border-destructive rounded-lg">
              <p className="text-sm text-destructive-foreground">Error: {state.error.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StopwatchSample
