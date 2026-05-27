import { Dumbbell, Layers, Moon, ShieldCheck, Workflow } from "lucide-react-native";
import { View } from "react-native";

import { AppScreen } from "@/components/ui/AppScreen";
import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/colors";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";

const foundationItems = [
  {
    description: "Expo Router now separates public auth routes from protected app screens.",
    icon: Workflow,
    title: "Protected navigation"
  },
  {
    description: "Theme tokens and NativeWind utilities keep the dark premium UI consistent.",
    icon: Moon,
    title: "Dark design system"
  },
  {
    description: "Supabase session persistence is isolated behind services, hooks, and stores.",
    icon: ShieldCheck,
    title: "Secure auth boundary"
  },
  {
    description: "Providers isolate server state, safe areas, gestures, session bootstrapping, and future app concerns.",
    icon: Layers,
    title: "Clean app boundary"
  }
] as const;

export default function FoundationScreen() {
  const { isLoading, signOut } = useAuthActions();
  const { user } = useAuthSession();

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
              Phase 2 adds secure authentication while keeping route files, form UI, state, and
              Supabase calls separated.
            </AppText>
          </View>
        </View>

        <Card elevated className="gap-3">
          <AppText variant="title">Signed in</AppText>
          <AppText className="text-slate-400">
            {user?.email ?? "Your authenticated session is active."}
          </AppText>
          <Button
            label="Sign out"
            loading={isLoading}
            onPress={() => signOut()}
            variant="ghost"
            className="mt-2"
          />
        </Card>

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
