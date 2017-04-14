import _ from 'lodash';
import {
  INVALIDATE,
  REQUEST_STARTED,
  REQUEST_COMPELTED,
  REQUEST_FAILED
} from '../../actions/user/topicListAction';
import { REMOVE_CACHE } from '../../actions/authorizeAction';

const defaultState = {};
const defaultUserTopicListState = {
  isRefreshing: false,
  isEndReached: false,
  didInvalidate: false,
  list: [],
  hasMore: false,
  page: 0,
  errCode: ''
};

export default function userTopicList(state = defaultState, action) {
  switch (action.type) {
    case INVALIDATE: {
      let { userId, type } = action.payload;

      return {
        ...state,
        [userId]: {
          ..._.get(state, userId, {}),
          [type]: {
            ..._.get(state, [userId, type], defaultUserTopicListState),
            didInvalidate: true
          }
        }
      };
    }
    case REQUEST_STARTED: {
      let { userId, type, isEndReached } = action.payload;

      return {
        ...state,
        [userId]: {
          ..._.get(state, userId, {}),
          [type]: {
            ..._.get(state, [userId, type], defaultUserTopicListState),
            isRefreshing: !isEndReached,
            isEndReached: isEndReached,
            didInvalidate: false
          }
        }
      };
    }
    case REQUEST_COMPELTED:
      let {
        payload: userTopicList,
        meta: {
          userId,
          type
        }
      } = action;

      // there are bad data from mobcent API...WTF!!!
      // https://github.com/UESTC-BBS/API-Docs/issues/13
      let validUserTopicList = userTopicList.list.filter(item =>
        item.board_id !== 0 &&
        item.board_name !== "" &&
        item.last_reply_date !== "000" &&
        item.user_id !== 0 &&
        item.user_nick_name !== ""
      )

      return {
        ...state,
        [userId]: {
          ..._.get(state, userId, {}),
          [type]: {
            ..._.get(state, [userId, type], defaultUserTopicListState),
            isRefreshing: false,
            isEndReached: false,
            didInvalidate: false,
            list: getNewCache(state, validUserTopicList, userId, type, userTopicList.page, userTopicList.rs),
            hasMore: !!userTopicList.has_next,
            page: userTopicList.page,
            errCode: userTopicList.errcode
          }
        }
      };
    case REQUEST_FAILED: {
      let { userId, type } = action.meta;

      return {
        ...state,
        [userId]: {
          ..._.get(state, userId, {}),
          [type]: {
            ..._.get(state, [userId, type], defaultUserTopicListState),
            isRefreshing: false,
            isEndReached: false,
            didInvalidate: false
          }
        }
      };
    }
    case REMOVE_CACHE:
      return defaultState;
    default:
      return state;
  }
}

function getNewCache(oldState, userTopicList, userId, type, page, isSuccessful) {
  if (!isSuccessful) { return oldState.list; }

  let newUserTopicList = [];

  if (page !== 1) {
    newUserTopicList = oldState[userId][type].list.concat(userTopicList);
  } else {
    newUserTopicList = userTopicList;
  }

  return newUserTopicList;
}
