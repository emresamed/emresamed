import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface RestTimerControls {
  remainingSec: number;
  isRunning: boolean;
  progress: number;
  start: (durationSec?: number) => void;
  pause: () => void;
  reset: (durationSec?: number) => void;
}

export function useRestTimer(initialDurationSec: number): RestTimerControls {
  const [remainingSec, setRemainingSec] = useState(initialDurationSec);
  const [isRunning, setIsRunning] = useState(false);
  const targetDurationRef = useRef(initialDurationSec);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(
    (durationSec?: number) => {
      if (typeof durationSec === "number" && durationSec > 0) {
        targetDurationRef.current = Math.round(durationSec);
        setRemainingSec(Math.round(durationSec));
      }

      setIsRunning(true);
    },
    []
  );

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback((durationSec?: number) => {
    setIsRunning(false);
    const nextDuration = durationSec && durationSec > 0 ? Math.round(durationSec) : targetDurationRef.current;
    targetDurationRef.current = nextDuration;
    setRemainingSec(nextDuration);
  }, []);

  useEffect(() => {
    clearTimer();
    if (!isRunning) {
      return clearTimer;
    }

    timerRef.current = setInterval(() => {
      setRemainingSec((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [clearTimer, isRunning]);

  useEffect(() => clearTimer, [clearTimer]);

  const progress = useMemo(() => {
    if (targetDurationRef.current <= 0) {
      return 0;
    }
    return 1 - remainingSec / targetDurationRef.current;
  }, [remainingSec]);

  return {
    remainingSec,
    isRunning,
    progress: Math.min(Math.max(progress, 0), 1),
    start,
    pause,
    reset
  };
}
