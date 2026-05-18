import { Transaction, useTransactions } from "@/context/TransactionContext";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function toBn(n: number) {
  return Math.round(n)
    .toString()
    .replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);
}

function formatAmount(n: number) {
  if (n >= 100000) return (n / 100000).toFixed(1) + " লক্ষ";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return toBn(n);
}

function TransactionItem({
  item,
  onDelete,
}: {
  item: Transaction;
  onDelete: () => void;
}) {
  const isIncome = item.type === "income";
  const emoji = item.category.split(" ")[0];
  const catName = item.category.split(" ").slice(1).join(" ");
  const color = isIncome ? "#3B6D11" : "#A32D2D";
  const bg = isIncome ? "#EAF3DE" : "#FCEBEB";

  return (
    <View style={styles.txItem}>
      <View style={[styles.txIcon, { backgroundColor: bg }]}>
        <Text style={styles.txEmoji}>{emoji}</Text>
      </View>
      <View style={styles.txInfo}>
        <Text style={styles.txDesc} numberOfLines={1}>
          {item.description}
        </Text>
        <Text style={styles.txCat}>
          {catName} · {item.date}
        </Text>
      </View>
      <Text style={[styles.txAmount, { color }]}>
        {isIncome ? "+" : "−"}৳{toBn(item.amount)}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const {
    transactions,
    balance,
    totalIncome,
    totalExpense,
    deleteTransaction,
  } = useTransactions();

  const recent = transactions.slice(0, 5);
  const savingsRate =
    totalIncome > 0
      ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100)
      : 0;

  const balanceColor = balance >= 0 ? "#EAF3DE" : "#FCEBEB";
  const balanceTextColor = balance >= 0 ? "#3B6D11" : "#A32D2D";

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Hero card */}
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>মোট ব্যালেন্স</Text>
              <Text style={styles.heroGreeting}>আস্সালামু আলাইকুম 👋</Text>
            </View>
            <TouchableOpacity style={styles.avatarBtn} activeOpacity={0.8}>
              <Text style={styles.avatarText}>রা</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.heroBalance}>
            ৳ {formatAmount(Math.abs(balance))}
            {balance < 0 && <Text style={styles.heroBalanceSub}> ঘাটতি</Text>}
          </Text>

          <View style={[styles.savingsPill, { backgroundColor: balanceColor }]}>
            <Text style={[styles.savingsText, { color: balanceTextColor }]}>
              সঞ্চয় হার {toBn(savingsRate)}%
            </Text>
          </View>
        </View>

        {/* Income / Expense cards */}
        <View style={styles.cardRow}>
          <View style={[styles.summaryCard, { borderLeftColor: "#3B6D11" }]}>
            <View style={styles.summaryCardTop}>
              <View style={[styles.summaryDot, { backgroundColor: "#EAF3DE" }]}>
                <Text style={styles.summaryDotIcon}>↑</Text>
              </View>
              <Text style={styles.summaryLabel}>আয়</Text>
            </View>
            <Text style={[styles.summaryAmount, { color: "#3B6D11" }]}>
              ৳{formatAmount(totalIncome)}
            </Text>
          </View>

          <View style={[styles.summaryCard, { borderLeftColor: "#A32D2D" }]}>
            <View style={styles.summaryCardTop}>
              <View style={[styles.summaryDot, { backgroundColor: "#FCEBEB" }]}>
                <Text style={[styles.summaryDotIcon, { color: "#A32D2D" }]}>
                  ↓
                </Text>
              </View>
              <Text style={styles.summaryLabel}>খরচ</Text>
            </View>
            <Text style={[styles.summaryAmount, { color: "#A32D2D" }]}>
              ৳{formatAmount(totalExpense)}
            </Text>
          </View>
        </View>

        {/* Quick add button */}
        <TouchableOpacity
          style={styles.quickAdd}
          onPress={() => router.push("/(tabs)/add")}
          activeOpacity={0.85}
        >
          <Text style={styles.quickAddPlus}>+</Text>
          <Text style={styles.quickAddText}>নতুন লেনদেন যোগ করুন</Text>
        </TouchableOpacity>

        {/* Recent transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>সাম্প্রতিক লেনদেন</Text>
            <TouchableOpacity
              onPress={() => {
                router.push("/(tabs)/history");
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionLink}>সব দেখুন →</Text>
            </TouchableOpacity>
          </View>

          {recent.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyText}>এখনো কোনো লেনদেন নেই</Text>
              <Text style={styles.emptySubText}>
                উপরের বাটনে চাপ দিয়ে শুরু করুন
              </Text>
            </View>
          ) : (
            <View style={styles.txList}>
              {recent.map((item) => (
                <TransactionItem
                  key={item.id}
                  item={item}
                  onDelete={() => deleteTransaction(item.id)}
                />
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FAFAF8",
  },
  scroll: {
    paddingBottom: 16,
  },

  // Hero
  hero: {
    backgroundColor: "#006a4e",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  heroLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
    fontWeight: "500",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  heroGreeting: {
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  heroBalance: {
    fontSize: 44,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: -1,
    marginBottom: 14,
  },
  heroBalanceSub: {
    fontSize: 18,
    fontWeight: "400",
    letterSpacing: 0,
  },
  savingsPill: {
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Summary cards
  cardRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderLeftWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryCardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  summaryDot: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryDotIcon: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3B6D11",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#888780",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.5,
  },

  // Quick add
  quickAdd: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#006a4e",
    borderRadius: 14,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  quickAddPlus: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "300",
    lineHeight: 24,
  },
  quickAddText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 0.1,
  },

  // Section
  section: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a18",
    letterSpacing: -0.2,
  },
  sectionLink: {
    fontSize: 13,
    color: "#006a4e",
    fontWeight: "500",
  },

  // Transaction list
  txList: {
    gap: 8,
  },
  txItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    borderWidth: 0.5,
    borderColor: "#EDEBE4",
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  txEmoji: {
    fontSize: 18,
  },
  txInfo: {
    flex: 1,
  },
  txDesc: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1a1a18",
    marginBottom: 2,
  },
  txCat: {
    fontSize: 11,
    color: "#AEACA5",
  },
  txAmount: {
    fontSize: 14,
    fontWeight: "700",
  },

  // Empty state
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 6,
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#5F5E5A",
  },
  emptySubText: {
    fontSize: 13,
    color: "#AEACA5",
  },
});
