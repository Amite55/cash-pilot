import { Tabs } from "expo-router";
import { Text } from "react-native";
import { TransactionProvider } from "../../context/TransactionContext";

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>{emoji}</Text>
  );
}

export default function TabLayout() {
  return (
    <TransactionProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#FAFAF8",
            borderTopColor: "#E8E6DF",
            borderTopWidth: 0.5,
            paddingTop: 6,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "500",
            marginBottom: 4,
          },
          tabBarActiveTintColor: "#006a4e",
          tabBarInactiveTintColor: "#B4B2A9",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "হোম",
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="🏠" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: "যোগ করো",
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="➕" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: "ইতিহাস",
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="📋" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="summary"
          options={{
            title: "সারসংক্ষেপ",
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="📊" focused={focused} />
            ),
          }}
        />
      </Tabs>
    </TransactionProvider>
  );
}
