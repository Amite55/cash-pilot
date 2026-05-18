import tw from "@/lib/tailwind";
import * as Font from "expo-font";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

const index = () => {
  React.useEffect(() => {
    const AppLoader = async () => {
      await Font.loadAsync({
        PoppinsBold: require("@/assets/fonts/Poppins/Poppins-Bold.ttf"),
        PoppinsMedium: require("@/assets/fonts/Poppins/Poppins-Medium.ttf"),
        PoppinsRegular: require("@/assets/fonts/Poppins/Poppins-Regular.ttf"),
        PoppinsSemiBold: require("@/assets/fonts/Poppins/Poppins-SemiBold.ttf"),
      });
    };
    AppLoader();
  }, []);

  React.useEffect(() => {
    const redirect = async () => {
      try {
        setTimeout(() => {
          router.replace("/(tabs)");
        }, 3000);
      } catch (error: any) {
        console.log(error, "Root index-------> Error");
      }
    };
    redirect();
  }, []);

  return (
    <View style={tw`flex-1 `}>
      <View style={tw`flex-1 justify-center items-center gap-4`}>
        <Image
          style={tw`w-52 h-20`}
          contentFit="contain"
          source={"@/assets/images/react-logo@3x.png"}
        />
        <ActivityIndicator size={"large"} color={tw.color("yellow-500")} />
      </View>
    </View>
  );
};

export default index;
