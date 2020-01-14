import React from 'react';
import { createStackNavigator, createDrawerNavigator, createAppContainer } from 'react-navigation';
import { MaterialIcons } from '@expo/vector-icons';

import Favorites from './screens/Favorites';
import Contacts from './screens/Contacts';
import Profile from './screens/Profile';
import User from './screens/User';
import Options from './screens/Options';

const getDrawerItemIcon = icon => ({ tintColor }) => (
  <MaterialIcons name={icon} size={22} style={{ color: tintColor }} />
);

const ContactsScreens = createStackNavigator(
  {
    Contacts,
    Profile,
  },
  {
    initialRouteName: 'Contacts',
    navigationOptions: {
      drawerIcon: getDrawerItemIcon('list'),
    },
  },
);

const FavoritesScreens = createStackNavigator(
  {
    Favorites,
    Profile,
  },
  {
    initialRouteName: 'Favorites',
    navigationOptions: {
      drawerIcon: getDrawerItemIcon('star'),
    },
  },
);

const UserScreens = createStackNavigator(
  {
    User,
    Options,
  },
  {
    mode: 'modal',
    initialRouteName: 'User',
    navigationOptions: {
      drawerIcon: getDrawerItemIcon('person'),
    },
  },
);

const DrawerNavigator = createDrawerNavigator(
  {
    Contacts: ContactsScreens,
    Favorites: FavoritesScreens,
    User: UserScreens,
  },
  {
    initialRouteName: 'Contacts',
  },
);

export default createAppContainer(DrawerNavigator);
