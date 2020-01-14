import React from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar
} from "react-native";

import { fetchLocationId, fetchWeather } from "./utils/api";
import getImageForWeather from "./utils/getImageForWeather";

import SearchInput from "./components/SearchInput";

export default class App extends React.Component {
  state = {
    loading: false,
    error: false,
    location: "",
    temperature: 0,
    weather: ""
  };

  componentDidMount() {
    this.handleUpdateLocation("San Francisco");
  }

  handleUpdateLocation = async city => {
    if (!city) return;

    this.setState({ loading: true }, () => {
      this.requestWeatherDataAndUpdateState(city);
    });
  };

  requestWeatherDataAndUpdateState = async city => {
    try {
      const locationId = await fetchLocationId(city);
      const { location, weather, temperature } = await fetchWeather(locationId);

      this.setState({
        loading: false,
        error: false,
        location,
        weather,
        temperature
      });
    } catch (e) {
      this.setState({ loading: false, error: true });
    }
  };

  formatTemperature(temperature) {
    return `${Math.round(temperature)}°`;
  }

  renderContent() {
    const { loading, error, weather, temperature, location } = this.state;

    if (loading) return;

    if (error) {
      return (
        <View>
          <Text style={[styles.smallText, styles.textStyle]}>
            Could not load weather, please try a different city.
          </Text>
          {this.renderSearchInput()}
        </View>
      );
    }

    const formattedTemperature = this.formatTemperature(temperature);

    return (
      <View>
        <View>
          <Text style={[styles.largeText, styles.textStyle]}>{location}</Text>
          <Text style={[styles.smallText, styles.textStyle]}>{weather}</Text>
          <Text style={[styles.largeText, styles.textStyle]}>
            {formattedTemperature}{" "}
          </Text>
        </View>
        {this.renderSearchInput()}
      </View>
    );
  }

  renderSearchInput() {
    return (
      <SearchInput
        placeholder="Search any city"
        location={this.state.location}
        onSubmit={this.handleUpdateLocation}
      />
    );
  }

  render() {
    const { loading, weather } = this.state;

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <StatusBar barStyle="light-content" />
        <ImageBackground
          source={getImageForWeather(weather)}
          style={styles.imageContainer}
          imageStyle={styles.image}
        >
          <ActivityIndicator animating={loading} color="white" size="large" />
          <View style={styles.detailsContainer}>{this.renderContent()}</View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#34495E"
  },
  imageContainer: {
    flex: 1
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "cover"
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)"
  },
  textStyle: {
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "AvenirNext-Regular" : "Helvetica Neue",
    color: "white"
  },
  largeText: {
    fontSize: 44
  },
  smallText: {
    fontSize: 18
  }
});
