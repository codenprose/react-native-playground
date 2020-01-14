import React from "react";
import { StyleSheet, View, Text } from "react-native";

export default class Person extends React.Component {
  render() {
    const { name } = this.props;

    return (
      <View style={styles.container}>
        <Text>Hello, {name}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
