import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../styles/components/_RewardList';
import colors from '../styles/common/_colors';

export default class RewardList extends Component {
  render() {
    let { reward, router } = this.props;
    let {
      score,
      userNumber,
      userList,
      showAllUrl
    } = reward;

    return (
      <View style={styles.reward}>
        <View style={styles.rewardHeader}>
          <Text style={styles.rewardHeaderText}>
            {`共 ${userNumber} 人评分${score.map(({ info, value }) => {
              if (value >= 0) {
                value = `+${value}`;
              }

              return `， ${info} ${value}`;
            })}`}
          </Text>
        </View>
        <View style={styles.rewardUserList}>
          {reward.userList.map(user => {
            let { uid, userName, userIcon } = user;

            return (
              <TouchableHighlight
                key={uid}
                style={styles.avatarWapper}
                underlayColor={colors.underlay}
                onPress={() => router.toIndividual({
                  userId: uid,
                  userName: userName,
                  userAvatar: userIcon
                }, false)}>
                <Image
                  key={uid}
                  source={{ uri: userIcon }}
                  style={styles.rewardUser} />
              </TouchableHighlight>
            );
          })}
          <Icon
            style={[styles.rewardUser, styles.more]}
            name='ellipsis-h'
            size={14}
            onPress={() => router.toBrowser(showAllUrl, '全部评分')} />
        </View>
      </View>
    );
  }
}
