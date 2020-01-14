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

import CardList from '../components/CardList';

import icon from '../assets/icon-plus.png';

export default class Feed extends React.Component {
  static propTypes = {
    style: ViewPropTypes.style,
    commentsForItem: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string))
      .isRequired,
    onPressComments: PropTypes.func.isRequired,
    onPressAdd: PropTypes.func.isRequired,
  };

  static defaultProps = {
    style: null,
  };

  render() {
    const {
      commentsForItem,
      onPressComments,
      onPressAdd,
      style,
      loading,
      error,
      items,
    } = this.props;

    if (loading) {
      return <ActivityIndicator size="large" />;
    }

    if (error) {
      return <Text>Error...</Text>;
    }

    return (
      <SafeAreaView style={style}>
        <CardList
          items={items}
          commentsForItem={commentsForItem}
          onPressComments={onPressComments}
        />
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onPressAdd}
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            width: 60,
            height: 60,
            backgroundColor: 'white',
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image source={icon} />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
