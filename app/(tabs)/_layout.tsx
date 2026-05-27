import { Tabs } from "expo-router";
import { Dumbbell, House, LayoutGrid, NotebookPen, UserRound } from "lucide-react-native";

import { TabIcon } from "../../src/components/navigation/tab-icon";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#22D3EE",
        tabBarInactiveTintColor: "#64748B",
        tabBarStyle: {
          backgroundColor: "#121826",
          borderTopColor: "#243041",
          height: 64,
          paddingTop: 8
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => <TabIcon Icon={House} color={color} focused={focused} />
        }}
      />
      <Tabs.Screen
        name="programs"
        options={{
          title: "Programs",
          tabBarIcon: ({ color, focused }) => <TabIcon Icon={LayoutGrid} color={color} focused={focused} />
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: "Exercises",
          tabBarIcon: ({ color, focused }) => <TabIcon Icon={Dumbbell} color={color} focused={focused} />
        }}
      />
      <Tabs.Screen
        name="tracker"
        options={{
          title: "Tracker",
          tabBarIcon: ({ color, focused }) => <TabIcon Icon={NotebookPen} color={color} focused={focused} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => <TabIcon Icon={UserRound} color={color} focused={focused} />
        }}
      />
    </Tabs>
  );
}
