import { Dimensions, Platform } from "react-native";

export const PrimaryColor = "#FF6600";
export const Base = "#FFF4ED";

export const _HEIGHT = Dimensions.get("screen").height;
export const _WIDTH = Dimensions.get("screen").width;

export const isWeb = Platform.OS === "web";
