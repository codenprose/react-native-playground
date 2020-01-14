import {
  ActivityIndicator,
  Text,
  Image,
  TouchableOpacity,
  ViewPropTypes,
  SafeAreaView,
} from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';
import { Camera as CameraComponent } from 'expo';

import { fetchImages } from '../utils/api';
import CardList from '../components/CardList';
import NavigationBar from '../components/NavigationBar';

import icon from '../assets/icon-plus.png';

const STEPS = {
  CAPTURE: 'capture',
  REVIEW: 'review',
};

export default class Camera extends React.Component {
  static propTypes = {
    style: ViewPropTypes.style,
    onClose: PropTypes.func.isRequired,
    onUploadPhoto: PropTypes.func.isRequired,
  };

  static defaultProps = {
    style: null,
  };

  state = {
    step: STEPS.CAPTURE,
    photo: null,
  };

  snap = async () => {
    if (this.camera) {
      const photo = await this.camera.takePictureAsync();

      this.setState({
        photo,
        step: STEPS.REVIEW,
      });
    }
  };

  handleRetake = () => {
    this.setState({
      photo: null,
      step: STEPS.CAPTURE,
    });
  };

  handleUpload = () => {
    const { onUploadPhoto } = this.props;
    const { photo } = this.state;

    onUploadPhoto(photo);
  };

  render() {
    const { style, onClose } = this.props;
    const { step, photo } = this.state;

    return (
      <SafeAreaView style={style}>
        {step === STEPS.CAPTURE && (
          <React.Fragment>
            <NavigationBar
              title="Camera"
              leftText="Back"
              onPressLeftText={onClose}
            />
            <CameraComponent
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
              ref={ref => {
                this.camera = ref;
              }}
            >
              <TouchableOpacity
                onPress={this.snap}
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: 'white',
                  borderRadius: 25,
                  marginBottom: 60,
                }}
              />
            </CameraComponent>
          </React.Fragment>
        )}
        {step === STEPS.REVIEW && (
          <React.Fragment>
            <NavigationBar
              title="Review"
              leftText="Retake"
              onPressLeftText={this.handleRetake}
              rightText="Upload"
              onPressRightText={this.handleUpload}
            />
            <Image
              source={{ uri: photo.uri }}
              style={{
                flex: 1,
              }}
            />
          </React.Fragment>
        )}
      </SafeAreaView>
    );
  }
}
