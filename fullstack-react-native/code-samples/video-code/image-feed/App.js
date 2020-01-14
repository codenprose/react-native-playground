import { AsyncStorage, Modal, Platform, StyleSheet, View } from 'react-native';
import { Constants, Permissions } from 'expo';
import React from 'react';

import { fetchImages, uploadImage } from './utils/api';

import Comments from './screens/Comments';
import Feed from './screens/Feed';
import Camera from './screens/Camera';

const ASYNC_STORAGE_COMMENTS_KEY = 'ASYNC_STORAGE_COMMENTS_KEY';

export default class App extends React.Component {
  state = {
    commentsForItem: {},
    showCommentsModal: false,
    showCameraModal: false,
    selectedItemId: null,
    loading: true,
    error: false,
    items: [],
    localItems: [],
  };

  async componentDidMount() {
    this.loadComments();
    this.loadImages();
  }

  onSubmitComment = async text => {
    const { selectedItemId, commentsForItem } = this.state;
    const comments = commentsForItem[selectedItemId] || [];

    const updated = {
      ...commentsForItem,
      [selectedItemId]: [...comments, text],
    };

    this.setState({ commentsForItem: updated });

    try {
      await AsyncStorage.setItem(
        ASYNC_STORAGE_COMMENTS_KEY,
        JSON.stringify(updated),
      );
    } catch (e) {
      console.log('Failed to save comment', text, 'for', selectedItemId);
    }
  };

  loadComments = async () => {
    try {
      const commentsForItem = await AsyncStorage.getItem(ASYNC_STORAGE_COMMENTS_KEY);

      this.setState({
        commentsForItem: commentsForItem ? JSON.parse(commentsForItem) : {},
      });
    } catch (e) {
      console.log('Failed to load comments');
    }
  };

  loadImages = async localId => {
    try {
      const items = await fetchImages();

      this.setState({
        loading: false,
        items,
        localItems: this.state.localItems.filter(item => item.id !== localId),
      });
    } catch (e) {
      this.setState({
        loading: false,
        error: true,
      });
    }
  };

  openCommentScreen = id => {
    this.setState({
      showCommentsModal: true,
      selectedItemId: id,
    });
  };

  closeCommentScreen = () => {
    this.setState({
      showCommentsModal: false,
      selectedItemId: null,
    });
  };

  openCameraScreen = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    if (status !== 'granted') return;

    this.setState({
      showCameraModal: true,
    });
  };

  closeCameraScreen = () => {
    this.setState({
      showCameraModal: false,
    });
  };

  handleUploadPhoto = async photo => {
    const { localItems } = this.state;

    const localId = `local:${Date.now()}`;

    this.setState({
      showCameraModal: false,
      localItems: [
        ...localItems,
        {
          id: localId,
          imageUrl: photo.uri,
          createdAt: Date.now(),
          author: 'Me',
          isUploading: true,
        },
      ],
    });

    await uploadImage(photo.uri);

    this.loadImages(localId);
  };

  render() {
    const {
      commentsForItem,
      showCommentsModal,
      showCameraModal,
      selectedItemId,
      loading,
      items,
      error,
      localItems,
    } = this.state;

    const allItems = [...items, ...localItems].sort((a, b) => b.createdAt - a.createdAt);

    return (
      <View style={styles.container}>
        <Feed
          loading={loading}
          items={allItems}
          error={error}
          style={styles.feed}
          commentsForItem={commentsForItem}
          onPressComments={this.openCommentScreen}
          onPressAdd={this.openCameraScreen}
        />
        <Modal
          visible={showCommentsModal}
          animationType="slide"
          onRequestClose={this.closeCommentScreen}
        >
          <Comments
            style={styles.comments}
            comments={commentsForItem[selectedItemId] || []}
            onClose={this.closeCommentScreen}
            onSubmitComment={this.onSubmitComment}
          />
        </Modal>
        <Modal
          visible={showCameraModal}
          animationType="slide"
          onRequestClose={this.closeCameraScreen}
        >
          <Camera
            style={styles.camera}
            onClose={this.closeCameraScreen}
            onUploadPhoto={this.handleUploadPhoto}
          />
        </Modal>
      </View>
    );
  }
}

const platformVersion =
  Platform.OS === 'ios' ? parseInt(Platform.Version, 10) : Platform.Version;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  feed: {
    flex: 1,
    marginTop:
      Platform.OS === 'android' || platformVersion < 11
        ? Constants.statusBarHeight
        : 0,
  },
  comments: {
    flex: 1,
    marginTop:
      Platform.OS === 'ios' && platformVersion < 11
        ? Constants.statusBarHeight
        : 0,
  },
  camera: {
    flex: 1,
    marginTop:
      Platform.OS === 'ios' && platformVersion < 11
        ? Constants.statusBarHeight
        : 0,
  },
});
