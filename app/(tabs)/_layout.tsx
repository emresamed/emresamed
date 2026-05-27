import { Tabs } from "expo-router";

import { tabs } from "@app/navigation";
import { colors } from "@shared/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.foregroundMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 78,
          paddingBottom: 18,
          paddingTop: 10,
        },
      }}
    >
      {tabs.map(({ icon: Icon, name, title }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, size }) => <Icon color={color} size={size} strokeWidth={2.2} />,
          }}
        />
      ))}
    </Tabs>
  );
}
