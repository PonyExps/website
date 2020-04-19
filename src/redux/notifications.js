import { NOTIFICATIONS } from '../shared/notifications';
import * as ActionTypes from './ActionTypes';

export const Notifications = (state = NOTIFICATIONS, action) => {
    switch (action.type) {
        case ActionTypes.SET_NOTIFICATIONS:
            var payload = action.payload;
            return payload.data;
        default:
            return state;
        }
};
