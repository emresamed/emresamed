import { Dumbbell, Layers, Moon, Workflow } from "lucide-react-native";
import { View } from "react-native";

import { AppScreen } from "@/components/ui/AppScreen";
import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/colors";

const foundationItems = [
  {
    description: "Expo Router is ready for file-based screens and future protected route groups.",
    icon: Workflow,
    title: "Navigation shell"
  },
  {
    description: "Theme tokens and NativeWind utilities keep the dark premium UI consistent.",
    icon: Moon,
    title: "Dark design system"
  },
  {
    description: "Providers isolate server state, safe areas, gestures, and future app concerns.",
    icon: Layers,
    title: "Clean app boundary"
  }
] as const;

export default function FoundationScreen() {
  return (
    <AppScreen scrollable>
      <View className="gap-8">
        <View className="gap-4">
          <View className="h-16 w-16 items-center justify-center rounded-3xl bg-primary">
            <Dumbbell color={colors.text.inverted} size={30} strokeWidth={2.6} />
          </View>

          <View className="gap-3">
            <AppText variant="caption" className="uppercase tracking-[3px] text-primary-soft">
              GymBro Foundation
            </AppText>
            <AppText variant="heading">Build strong. Ship clean.</AppText>
            <AppText className="text-slate-300">
              Phase 1 establishes the scalable Expo, TypeScript, routing, theme, store, and service
              structure for the GymBro MVP.
            </AppText>
          </View>
        </View>

        <View className="gap-4">
          {foundationItems.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title} elevated className="gap-4">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary/15">
                  <Icon color={colors.brand.soft} size={24} />
                </View>
                <View className="gap-2">
                  <AppText variant="title">{item.title}</AppText>
                  <AppText className="text-slate-400">{item.description}</AppText>
                </View>
              </Card>
            );
          })}
        </View>
      </View>
    </AppScreen>
  );
}
