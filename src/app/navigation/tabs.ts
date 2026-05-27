import { Activity, Dumbbell, Home, Trophy, User } from "lucide-react-native";

export const tabs = [
  {
    name: "index",
    title: "Home",
    icon: Home,
  },
  {
    name: "programs",
    title: "Programs",
    icon: Dumbbell,
  },
  {
    name: "exercises",
    title: "Exercises",
    icon: Activity,
  },
  {
    name: "progress",
    title: "Progress",
    icon: Trophy,
  },
  {
    name: "profile",
    title: "Profile",
    icon: User,
  },
] as const;
