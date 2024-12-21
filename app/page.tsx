"use client";

import { getPointsByUserIdAction } from "@/actions/points-actions";
import { getProfileByUserIdAction } from "@/actions/profiles-actions";
import { Progress } from "@/components/ui/progress";
import { SelectProfile } from "@/db/schema/profiles-schema";
import { SelectPoints } from "@/db/schema/points-schema";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export const LEVELS = [
  { threshold: 1000000, label: "Queen Supreme 👑" },
  { threshold: 500000, label: "Queen in Waiting 👸" },
  { threshold: 250000, label: "Princess 💫" },
  { threshold: 100000, label: "Duchess ✨" },
  { threshold: 50000, label: "Countess 🌟" },
  { threshold: 10000, label: "Lady 🎀" },
  { threshold: 5000, label: "Properly Dressed 🌼" },
  { threshold: 1000, label: "Noble Aspirant 🌱" },
  { threshold: 100, label: "Neophyte 🌾" },
  { threshold: 0, label: "Peasant 🌾" },
].reverse();

export default function Home() {
  const { userId, isLoaded } = useAuth();
  const [profile, setProfile] = useState<SelectProfile | null>(null);
  const [points, setPoints] = useState<SelectPoints | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      if (isLoaded && userId) {
        const profile = await getProfileByUserIdAction(userId as string);
        const points = await getPointsByUserIdAction(userId as string);
        setProfile(profile.data);
        setPoints(points.data);
      }
    }

    getProfile();
  }, [isLoaded, userId]);

  const getLogPercentage = (value: number) => {
    if (value <= 0) return 0;
    const logValue = Math.log(value + 1);
    const logMax = Math.log(1000001);
    return (logValue / logMax) * 100;  // Invert the final percentage                                                                                                    
  };

  const percentage = getLogPercentage(points?.points || 0);

  return (
    <div className="max-h-screen flex flex-col items-center justify-start p-4">
      <div className="h-[80vh] flex items-center">
        <div className="relative h-full flex">
          {/* Container for numbers and progress bar */}
          <div className="flex h-full">
            {/* Numbers column */}
            <div className="relative h-[90%] my-auto pr-2" style={{ width: '80px' }}>
              {LEVELS.map((level) => (
                <span
                  key={level.threshold}
                  className="absolute text-sm text-right w-full pr-2"
                  style={{
                    bottom: `${getLogPercentage(level.threshold)}%`,
                    transform: 'translateY(50%)'
                  }}
                >
                  {level.threshold.toLocaleString()}
                </span>
              ))}
            </div>

            {/* Progress bar and markers column */}
            <div className="relative w-4 h-[90%] my-auto">
              <Progress
                value={percentage}
                orientation="vertical"
                className="h-full absolute"
              />
              {/* Markers */}
              <div className="absolute h-full w-full">
                {LEVELS.map((level) => (
                  <div
                    key={level.threshold}
                    className="absolute w-8 h-1 bg-primary"
                    style={{
                      bottom: `${getLogPercentage(level.threshold)}%`,
                      transform: 'translateY(50%)',
                      left: 0
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Labels column */}
            <div className="relative h-[90%] my-auto pl-4" style={{ width: '160px' }}>
              {LEVELS.map((level) => (
                <span
                  key={level.threshold}
                  className="absolute text-sm whitespace-nowrap pl-2"
                  style={{
                    bottom: `${getLogPercentage(level.threshold)}%`,
                    transform: 'translateY(50%)'
                  }}
                >
                  {level.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New points display card */}
      <div className="bg-card border rounded-lg p-4 shadow-sm w-full">
        <div className="flex flex-row justify-center items-center">
          <div className="text-xl font-semibold">Princess Points:</div>
          <div className={`text-xl font-bold ml-2 ${points?.points && points.points > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {points?.points?.toLocaleString() || '0'}
          </div>
        </div>
      </div>
    </div>
  );
}
