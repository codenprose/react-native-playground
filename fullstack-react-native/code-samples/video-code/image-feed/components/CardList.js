import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';

import { getImageFromId } from '../utils/api';
import Card from './Card';

const keyExtractor = ({ id }) => id.toString();

export default class CardList extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
    })).isRequired,
    commentsForItem: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string))
      .isRequired,
    onPressComments: PropTypes.func.isRequired,
  };

  renderItem = ({
    item: {
      id, author, imageUrl, isUploading,
    },
  }) => {
    const { commentsForItem, onPressComments } = this.props;
    const comments = commentsForItem[id];

    return (
      <Card
        fullname={author}
        image={{
          uri: imageUrl,
        }}
        isUploading={isUploading}
        linkText={`${comments ? comments.length : 0} Comments`}
        onPressLinkText={() => onPressComments(id)}
      />
    );
  };

  render() {
    const { items, commentsForItem } = this.props;

    return (
      <FlatList
        data={items}
        extraData={commentsForItem}
        renderItem={this.renderItem}
        keyExtractor={keyExtractor}
      />
    );
  }
}
