import { Progress } from "@/components/ui/progress";

const LEVELS = [
  { threshold: 1000000, label: "Queen Supreme 👑" },
  { threshold: 500000, label: "Royal Highness 👸" },
  { threshold: 250000, label: "Princess Powerful 💫" },
  { threshold: 100000, label: "Duchess of Delight ✨" },
  { threshold: 50000, label: "Countess Cool 🌟" },
  { threshold: 10000, label: "Lady Lovely 🎀" },
  { threshold: 5000, label: "Noble Novice 🌼" },
  { threshold: 1000, label: "Aspiring Aristocrat 🌱" },
  { threshold: 100, label: "Peasant Plus ⭐" },
  { threshold: 0, label: "Humble Peasant 🌾" },
];

interface HomeProps {
  score?: number;
}

export default function Home({ score = 210 }: HomeProps) {


  const getLogPercentage = (value: number) => {
    if (value <= 0) return 0;
    const logValue = Math.log(value + 1);
    const logMax = Math.log(1000001);
    return (logValue / logMax) * 100;  // Invert the final percentage                                                                                                    
  };

  const percentage = getLogPercentage(score);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="h-[80vh] flex items-center">
        <div className="relative h-full w-24">
          {/* Vertical Progress Bar */}
          <div className="absolute h-full w-4 left-4">
            <Progress
              value={percentage}
              orientation="vertical"
              className="h-full"
            />
          </div>

          {/* Level Markers */}
          <div className="absolute h-full w-full">
            {LEVELS.map((level) => {
              const levelPercentage = getLogPercentage(level.threshold);
              return (
                <div
                  key={level.threshold}
                  className="absolute flex items-center gap-2"
                  style={{
                    bottom: `${levelPercentage}%`,
                    transform: 'translateY(50%)',
                  }}
                >
                  <div className="w-4 h-1 bg-primary" />
                  <span className="text-sm whitespace-nowrap pl-4">{level.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
