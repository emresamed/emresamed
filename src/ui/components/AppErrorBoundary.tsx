import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { darkTheme } from "../theme/darkTheme";

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
    message: ""
  };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return {
      hasError: true,
      message: error.message
    };
  }

  componentDidCatch(error: Error): void {
    // Keeps runtime crash information available in cloud logs.
    console.error("AppErrorBoundary caught error:", error);
  }

  render(): React.ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.message}>{this.state.message || "Unknown UI error"}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: darkTheme.colors.background,
    flex: 1,
    justifyContent: "center",
    padding: darkTheme.spacing.lg
  },
  title: {
    color: darkTheme.colors.danger,
    fontSize: darkTheme.typography.heading,
    fontWeight: "700",
    marginBottom: darkTheme.spacing.sm
  },
  message: {
    color: darkTheme.colors.textSecondary,
    fontSize: darkTheme.typography.body,
    textAlign: "center"
  }
});
