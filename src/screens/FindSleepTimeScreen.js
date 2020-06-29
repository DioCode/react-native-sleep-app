import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  Dimensions,
} from "react-native";
import { StyledButton } from "../components/StyledButton";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import theme from "../theme";

export const FindSleepTimeScreen = ({ navigation }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [showTimeToSleep, setShowTimeToSleep] = useState(false);
  const [showTimeToWakeUp, setShowTimeToWakeUp] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());

  const [chosenHours, setChosenHours] = useState();
  const [chosenMinutes, setChosenMinutes] = useState();

  const [chosenDate, setChosenDate] = useState("choose time");

  const [timeToFallAsleep, setTimeToFallAsleep] = useState();
  const [timeToWakeUp, setTimeToWakeUp] = useState();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const findTimeToFallAsleep = (timeFirst) => {
    let h = (timeFirst.getHours() < 10 ? "0" : "") + timeFirst.getHours();
    let m = (timeFirst.getMinutes() < 10 ? "0" : "") + timeFirst.getMinutes();
    return h + ":" + m;
  };

  const timeToFallAsleepColors = (res1, res2, res3, res4, res5, res6) => {
    let returnContent;
    if ((res1, res2, res3, res4, res5, res6)) {
      returnContent = (
        <Text style={{ ...styles.textTimeAsleep }}>
          <Text style={{ opacity: 1 }}>{res6}</Text>
          <Text style={styles.textTimeOr}>or </Text>
          <Text style={{ opacity: 1 }}>{res5} </Text>
          <Text style={styles.textTimeOr}>or </Text>
          <Text style={{ opacity: 0.6 }}>{res4} </Text>
          <Text style={styles.textTimeOr}>or </Text> {"\n"}
          <Text style={{ opacity: 0.6 }}>{res3} </Text>
          <Text style={styles.textTimeOr}>or </Text>
          <Text style={{ opacity: 0.25 }}>{res2} </Text>
          <Text style={styles.textTimeOr}>or </Text>
          <Text style={{ opacity: 0.25 }}>{res1} </Text>
        </Text>
      );
    } else if ((res1, res2, res3, res4)) {
      returnContent = (
        <Text style={{ ...styles.textTimeAsleep }}>
          <Text style={{ opacity: 1 }}>{res1}</Text>
          <Text style={styles.textTimeOr}>or </Text>
          <Text style={{ opacity: 0.75 }}>{res2} </Text>
          <Text style={styles.textTimeOr}>or </Text>
          <Text style={{ opacity: 0.5 }}>{res3} </Text>
          <Text style={styles.textTimeOr}>or </Text>
          <Text style={{ opacity: 0.25 }}>{res4} </Text>
        </Text>
      );
    }
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {returnContent}
      </View>
    );
  };

  let showTime = useRef(new Animated.Value(0)).current;
  let showSecondTime = useRef(new Animated.Value(0)).current;
  let showCalc = useRef(new Animated.Value(1)).current;
  let showSecondCalc = useRef(new Animated.Value(1)).current;
  let changeContainerHeight = useRef(new Animated.Value(150)).current;
  let changeSecondContainerHeight = useRef(new Animated.Value(125)).current;

  const showBar = () => {
    Animated.parallel([
      Animated.timing(showTime, {
        duration: 500,
        toValue: 1,
      }),
      Animated.timing(showCalc, {
        duration: 500,
        toValue: 0,
      }),
      Animated.timing(changeContainerHeight, {
        duration: 500,
        toValue: 150,
      }),
    ]).start();
  };

  const hideBar = () => {
    Animated.parallel([
      Animated.timing(showTime, {
        duration: 500,
        toValue: 0,
      }),
      Animated.timing(showCalc, {
        duration: 500,
        toValue: 1,
      }),

      Animated.timing(changeContainerHeight, {
        duration: 500,
        toValue: 150,
      }),
    ]).start();
  };

  const showSecondBar = () => {
    Animated.parallel([
      Animated.timing(showSecondTime, {
        duration: 500,
        toValue: 1,
      }),
      Animated.timing(showSecondCalc, {
        duration: 500,
        toValue: 0,
      }),
      Animated.timing(changeSecondContainerHeight, {
        duration: 500,
        toValue: 170,
      }),
    ]).start();
  };

  const hideSecondBar = () => {
    Animated.parallel([
      Animated.timing(changeSecondContainerHeight, {
        duration: 500,
        toValue: 125,
      }),
      Animated.timing(showSecondCalc, {
        duration: 500,
        toValue: 1,
      }),
      Animated.timing(showSecondTime, {
        duration: 500,
        toValue: 0,
      }),
    ]).start();
  };

  const onCalculateHandler = () => {
    if (chosenDate == "choose time") {
      Alert.alert("Please choose time to wake up! ⏰");
    } else {
      let d = new Date();
      d.setHours(chosenHours);
      d.setMinutes(chosenMinutes);
      // time to fall asleep
      let last = new Date(d.getTime() - 270 * 60000); // chosenDate - 4:30 h
      let result3 = new Date(last.getTime() - 90 * 60000); // chosenDate - 6:00 h
      let result2 = new Date(result3.getTime() - 90 * 60000); // chosenDate - 7:30 h
      let first = new Date(result2.getTime() - 90 * 60000); // chosenDate - 9:00 h

      first = findTimeToFallAsleep(first);
      result2 = findTimeToFallAsleep(result2);
      result3 = findTimeToFallAsleep(result3);
      last = findTimeToFallAsleep(last);
      setTimeToFallAsleep(
        timeToFallAsleepColors(first, result2, result3, last)
      );

      setTimeout(() => setShowTimeToSleep(true), 500);
      showBar();
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const onSleepNowHandler = () => {
    let zd = new Date(Date.now());
    // console.log(zd.toString());

    // time to fall asleep
    let res1 = new Date(zd.getTime() + 104 * 60000); // chosenDate - 4:30 h
    let res2 = new Date(res1.getTime() + 90 * 60000); // chosenDate - 6:00 h
    let res3 = new Date(res2.getTime() + 90 * 60000); // chosenDate - 7:30 h
    let res4 = new Date(res3.getTime() + 90 * 60000); // chosenDate - 9:00 h
    let res5 = new Date(res4.getTime() + 90 * 60000); // chosenDate - 9:00 h
    let res6 = new Date(res5.getTime() + 90 * 60000); // chosenDate - 9:00 h

    res1 = findTimeToFallAsleep(res1);
    res2 = findTimeToFallAsleep(res2);
    res3 = findTimeToFallAsleep(res3);
    res4 = findTimeToFallAsleep(res4);
    res5 = findTimeToFallAsleep(res5);
    res6 = findTimeToFallAsleep(res6);

    setTimeToWakeUp(timeToFallAsleepColors(res1, res2, res3, res4, res5, res6));

    setTimeout(() => setShowTimeToWakeUp(true), 500);
    showSecondBar();

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleConfirm = (date) => {
    hideDatePicker();
    let h = (date.getHours() < 10 ? "0" : "") + date.getHours();
    let m = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    setChosenHours(h);
    setChosenMinutes(m);
    setPickerDate(date);
    setChosenDate(`${h}:${m}`);
  };

  const onBackHandler = () => {
    hideBar();
    setTimeout(() => setShowTimeToSleep(false), 500);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const onBackSleepNowHandler = () => {
    hideSecondBar();
    setTimeout(() => setShowTimeToWakeUp(false), 500);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const ShowCalc = () => {
    return (
      <Animated.View
        style={{ ...styles.container, height: changeContainerHeight }}
      >
        <Animated.View style={{ ...styles.inContainer, opacity: showCalc }}>
          <Text style={styles.text}> I want to wake up at:</Text>

          <TouchableOpacity onPress={showDatePicker}>
            <Text style={{ ...styles.text, ...styles.textTime }}>
              {chosenDate}
            </Text>
          </TouchableOpacity>
          <StyledButton onPress={() => onCalculateHandler()} name="Calculate" />
        </Animated.View>
      </Animated.View>
    );
  };

  const ShowTime = () => {
    return (
      <Animated.View
        style={{ ...styles.container, height: changeContainerHeight }}
      >
        <Animated.View
          style={{
            ...styles.inContainer,
            opacity: showTime,
          }}
        >
          <Text style={styles.text}>Time to fall asleep:</Text>
          <View>{timeToFallAsleep}</View>
          <StyledButton
            onPress={() => onBackHandler()}
            name={<Ionicons name="ios-arrow-back" color="#fff" size={14} />}
          />
        </Animated.View>
      </Animated.View>
    );
  };

  const SleepNow = () => {
    return (
      <Animated.View
        style={{
          ...styles.container,
          height: changeSecondContainerHeight,
        }}
      >
        <Animated.View
          style={{
            ...styles.inContainer,
            justifyContent: "space-evenly",
            opacity: showSecondCalc,
          }}
        >
          <Text style={styles.text}>I want to fall asleep:</Text>

          <StyledButton onPress={() => onSleepNowHandler()} name="Now" />
        </Animated.View>
      </Animated.View>
    );
  };

  const ShowSleepNowTime = () => {
    return (
      <Animated.View
        style={{ ...styles.container, height: changeSecondContainerHeight }}
      >
        <Animated.View
          style={{
            ...styles.inContainer,
            opacity: showSecondTime,
          }}
        >
          <Text style={styles.text}>Time to wake up:</Text>
          <View>{timeToWakeUp}</View>
          <StyledButton
            onPress={() => onBackSleepNowHandler()}
            name={<Ionicons name="ios-arrow-back" color="#fff" size={14} />}
          />
        </Animated.View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.main}>
      {showTimeToSleep ? <ShowTime /> : <ShowCalc />}
      {showTimeToWakeUp ? <ShowSleepNowTime /> : <SleepNow />}

      <DateTimePickerModal
        headerTextIOS="Choose a time to wake up"
        mode="time"
        isVisible={isDatePickerVisible}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        isDarkModeEnabled={true}
        date={pickerDate}
        cancelTextIOS="Exit"
        is24Hour={false}
      />
    </View>
  );
};

const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: theme.PRIMARY_COLOR,
  },
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 10,
    width: windowHeight > 800 ? "85%" : "80%",
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  inContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
    width: "100%",
    // backgroundColor: "red",
    paddingVertical: 5,
  },
  text: {
    color: theme.SECONDARY_COLOR,
    fontFamily: "norms-regular",
    fontSize: 18,
    textAlign: "center",
  },
  textTime: {
    fontSize: 24,
    color: theme.SECONDARY_COLOR,
    fontFamily: "norms-bold",
    // textDecorationLine: "underline",
  },
  textTimeAsleep: {
    color: theme.SECONDARY_COLOR,
    fontSize: 21,
    textAlign: "center",
    fontFamily: "norms-bold",
    lineHeight: 25,
  },
  textTimeOr: {
    opacity: 0.25,
    fontFamily: "norms-regular",
  },
});