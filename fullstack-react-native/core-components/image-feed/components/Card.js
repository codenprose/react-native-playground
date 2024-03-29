import { Image, StyleSheet, View, ActivityIndicator } from "react-native";
import PropTypes from "prop-types";
import React from "react";

import AuthorRow from "./AuthorRow";

export default class Card extends React.Component {
  static propTypes = {
    fullName: PropTypes.string.isRequired,
    image: Image.propTypes.source.isRequired,
    linkText: PropTypes.string,
    onPressLinkText: PropTypes.func
  };

  static defaultProps = {
    linkText: "",
    onPressLinkText: () => {}
  };

  shouldComponentUpdate(nextProps) {
    return this.props.linkText !== nextProps.linkText;
  }

  state = {
    loading: true
  };

  handleLoad = () => {
    this.setState({ loading: false });
  };

  render() {
    const { fullName, image, linkText, onPressLinkText } = this.props;
    const { loading } = this.state;

    return (
      <View>
        <AuthorRow
          fullName={fullName}
          linkText={linkText}
          onPressLinkText={onPressLinkText}
        />
        <View style={styles.image}>
          {loading && (
            <ActivityIndicator style={StyleSheet.absoluteFill} size={"large"} />
          )}
          <Image
            style={StyleSheet.absoluteFill}
            source={image}
            onLoad={this.handleLoad}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    aspectRatio: 1, //  make the height of the Image match its full-screen width, rendering as a perfect square
    backgroundColor: "rgba(0,0,0,0.02)"
  }
});
