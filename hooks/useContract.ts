// hooks/useContract.ts
"use client"

import { useState, useEffect, useCallback } from "react"
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi"
import { contractABI, contractAddress } from "@/lib/contract"

export interface StopwatchData {
  elapsedTime: string
  isRunning: boolean
  startTime: string
  currentTime: string
}

export interface ContractState {
  isLoading: boolean
  isPending: boolean
  isConfirming: boolean
  isConfirmed: boolean
  hash: `0x${string}` | undefined
  error: Error | null
}

export interface ContractActions {
  start: () => Promise<void>
  stop: () => Promise<void>
  reset: () => Promise<void>
  refresh: () => Promise<void>
}

const formatSecondsToHHMMSS = (s: number) => {
  if (!Number.isFinite(s) || s < 0) return "0:00:00"
  const hours = Math.floor(s / 3600)
  const minutes = Math.floor((s % 3600) / 60)
  const seconds = Math.floor(s % 60)
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
  return `${hours}:${pad(minutes)}:${pad(seconds)}`
}

export const useStopwatchContract = () => {
  const { address } = useAccount()
  const [isLoadingLocal, setIsLoadingLocal] = useState(false)

  // Read elapsedTime
  const {
    data: elapsedTimeRaw,
    refetch: refetchElapsedTime,
    isError: isErrorElapsed,
  } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "elapsedTime",
  })

  // Read isRunning
  const {
    data: isRunningRaw,
    refetch: refetchIsRunning,
    isError: isErrorIsRunning,
  } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "isRunning",
  })

  // Read startTime
  const {
    data: startTimeRaw,
    refetch: refetchStartTime,
    isError: isErrorStartTime,
  } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "startTime",
  })

  // Read getCurrentTime
  const {
    data: currentTimeRaw,
    refetch: refetchCurrentTime,
    isError: isErrorCurrentTime,
  } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getCurrentTime",
  })

  const { writeContractAsync, data: hash, error, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (isConfirmed) {
      // refresh reads after confirmed tx
      refetchElapsedTime()
      refetchIsRunning()
      refetchStartTime()
      refetchCurrentTime()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed])

  const createWriteAction = useCallback(
    async (functionName: string) => {
      try {
        setIsLoadingLocal(true)
        await writeContractAsync({
          address: contractAddress,
          abi: contractABI,
          functionName,
        })
      } catch (err) {
        console.error(`Error calling ${functionName}:`, err)
        throw err
      } finally {
        setIsLoadingLocal(false)
      }
    },
    [writeContractAsync],
  )

  const start = async () => {
    await createWriteAction("start")
  }

  const stop = async () => {
    await createWriteAction("stop")
  }

  const reset = async () => {
    await createWriteAction("reset")
  }

  const refresh = async () => {
    // allow manual refresh of on-chain reads
    await Promise.all([
      refetchElapsedTime(),
      refetchIsRunning(),
      refetchStartTime(),
      refetchCurrentTime(),
    ])
  }

  const elapsedSeconds =
    typeof elapsedTimeRaw === "bigint" ? Number(elapsedTimeRaw as bigint) : 0
  const currentTimeSeconds =
    typeof currentTimeRaw === "bigint" ? Number(currentTimeRaw as bigint) : 0
  const startTimeSeconds =
    typeof startTimeRaw === "bigint" ? Number(startTimeRaw as bigint) : 0
  const isRunning = typeof isRunningRaw === "boolean" ? (isRunningRaw as boolean) : false

  const data: StopwatchData = {
    elapsedTime: formatSecondsToHHMMSS(elapsedSeconds),
    isRunning,
    startTime: startTimeSeconds > 0 ? new Date(startTimeSeconds * 1000).toISOString() : "N/A",
    currentTime: currentTimeSeconds > 0 ? new Date(currentTimeSeconds * 1000).toISOString() : "N/A",
  }

  const actions: ContractActions = {
    start,
    stop,
    reset,
    refresh,
  }

  const state: ContractState = {
    isLoading: isLoadingLocal || isPending || isConfirming,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error: error as Error | null,
  }

  return {
    data,
    actions,
    state,
    // also expose raw refetch functions if needed
    refetch: {
      refetchElapsedTime,
      refetchIsRunning,
      refetchStartTime,
      refetchCurrentTime,
    },
    errors: {
      isErrorElapsed,
      isErrorIsRunning,
      isErrorStartTime,
      isErrorCurrentTime,
    },
    address,
  }
}
