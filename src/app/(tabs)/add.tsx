import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Category,
  TransactionType,
  useTransactions,
} from "../../context/TransactionContext";

const CATEGORIES: { label: Category; color: string; bg: string }[] = [
  { label: "🍛 খাবার", color: "#854F0B", bg: "#FAEEDA" },
  { label: "🚌 যাতায়াত", color: "#185FA5", bg: "#E6F1FB" },
  { label: "🏠 বাড়িভাড়া", color: "#3C3489", bg: "#EEEDFE" },
  { label: "📱 মোবাইল", color: "#0F6E56", bg: "#E1F5EE" },
  { label: "💊 ওষুধ", color: "#A32D2D", bg: "#FCEBEB" },
  { label: "📚 পড়াশোনা", color: "#3B6D11", bg: "#EAF3DE" },
  { label: "🛍️ কেনাকাটা", color: "#993556", bg: "#FBEAF0" },
  { label: "💰 বেতন", color: "#27500A", bg: "#EAF3DE" },
  { label: "🎁 অন্যান্য", color: "#5F5E5A", bg: "#F1EFE8" },
];

export default function AddTransactionScreen() {
  const router = useRouter();
  const { addTransaction } = useTransactions();

  const [type, setType] = useState<TransactionType>("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [descFocused, setDescFocused] = useState(false);
  const [amtFocused, setAmtFocused] = useState(false);

  const isIncome = type === "income";
  const accentColor = isIncome ? "#3B6D11" : "#A32D2D";
  const accentBg = isIncome ? "#EAF3DE" : "#FCEBEB";
  const accentLight = isIncome ? "#639922" : "#E24B4A";

  function handleSubmit() {
    if (!description.trim()) {
      Alert.alert("ত্রুটি", "বিবরণ লিখুন");
      return;
    }
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0) {
      Alert.alert("ত্রুটি", "সঠিক পরিমাণ লিখুন");
      return;
    }
    if (!selectedCategory) {
      Alert.alert("ত্রুটি", "একটি বিভাগ বেছে নিন");
      return;
    }

    addTransaction({
      description: description.trim(),
      amount: amt,
      category: selectedCategory,
      type,
    });
    router.back();
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>নতুন লেনদেন</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Type toggle */}
        <View style={styles.toggleWrap}>
          <View style={styles.toggle}>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                !isIncome && styles.toggleBtnActive,
                !isIncome && { backgroundColor: "#FCEBEB" },
              ]}
              onPress={() => setType("expense")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.toggleText,
                  !isIncome && { color: "#A32D2D", fontWeight: "600" },
                ]}
              >
                খরচ
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                isIncome && styles.toggleBtnActive,
                isIncome && { backgroundColor: "#EAF3DE" },
              ]}
              onPress={() => setType("income")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.toggleText,
                  isIncome && { color: "#3B6D11", fontWeight: "600" },
                ]}
              >
                আয়
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Amount big input */}
        <View
          style={[
            styles.amountCard,
            { borderColor: amtFocused ? accentLight : "#E8E6DF" },
          ]}
        >
          <Text style={[styles.currencySymbol, { color: accentColor }]}>৳</Text>
          <TextInput
            style={[styles.amountInput, { color: accentColor }]}
            placeholder="০"
            placeholderTextColor="#C8C6BE"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            onFocus={() => setAmtFocused(true)}
            onBlur={() => setAmtFocused(false)}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>বিবরণ</Text>
          <TextInput
            style={[styles.input, descFocused && { borderColor: accentLight }]}
            placeholder="যেমন: সকালের নাস্তা, রিকশা ভাড়া…"
            placeholderTextColor="#AEACA5"
            value={description}
            onChangeText={setDescription}
            onFocus={() => setDescFocused(true)}
            onBlur={() => setDescFocused(false)}
            returnKeyType="done"
          />
        </View>

        {/* Category grid */}
        <View style={styles.section}>
          <Text style={styles.label}>বিভাগ</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => {
              const selected = selectedCategory === cat.label;
              return (
                <TouchableOpacity
                  key={cat.label}
                  style={[
                    styles.categoryChip,
                    selected && {
                      backgroundColor: cat.bg,
                      borderColor: cat.color,
                      borderWidth: 1.5,
                    },
                  ]}
                  onPress={() => setSelectedCategory(cat.label)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.categoryEmoji}>
                    {cat.label.split(" ")[0]}
                  </Text>
                  <Text
                    style={[
                      styles.categoryText,
                      selected && { color: cat.color, fontWeight: "600" },
                    ]}
                  >
                    {cat.label.split(" ").slice(1).join(" ")}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Submit button */}
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: accentColor }]}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Text style={styles.submitText}>
            {isIncome ? "+ আয় যোগ করুন" : "− খরচ যোগ করুন"}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FAFAF8",
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 56,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F1EFE8",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 18,
    color: "#3d3d3a",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1a1a18",
    letterSpacing: -0.3,
  },

  // Toggle
  toggleWrap: {
    alignItems: "center",
    marginBottom: 24,
  },
  toggle: {
    flexDirection: "row",
    backgroundColor: "#F1EFE8",
    borderRadius: 12,
    padding: 4,
  },
  toggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 9,
  },
  toggleBtnActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  toggleText: {
    fontSize: 15,
    color: "#888780",
    fontWeight: "500",
  },

  // Amount
  amountCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8E6DF",
    paddingVertical: 20,
    marginBottom: 24,
  },
  currencySymbol: {
    fontSize: 36,
    fontWeight: "300",
    marginRight: 4,
    marginTop: 2,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: "600",
    letterSpacing: -1,
    minWidth: 80,
    textAlign: "center",
  },

  // Section
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#888780",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8E6DF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1a1a18",
  },

  // Category
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E8E6DF",
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 13,
    color: "#5F5E5A",
    fontWeight: "500",
  },

  // Submit
  submitBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  submitText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.2,
  },
});
