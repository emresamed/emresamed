import type { LucideIcon } from "lucide-react-native";
import type { ColorValue } from "react-native";

type TabIconProps = {
  Icon: LucideIcon;
  color: ColorValue;
  focused: boolean;
};

export const TabIcon = ({ Icon, color, focused }: TabIconProps) => {
  return <Icon color={color} size={focused ? 22 : 20} strokeWidth={focused ? 2.2 : 2} />;
};
