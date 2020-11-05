import { message } from 'antd';
import update from 'immutability-helper';

import DISCOUNT_SUBSCRIPTION from '../graphql/DiscountSubscription.graphql';

export const subscribeToDiscount = (subscribeToMore, discountId) =>
  subscribeToMore({
    document: DISCOUNT_SUBSCRIPTION,
    variables: { id: discountId },
    updateQuery: (
      prev,
      {
        subscriptionData: {
          data: {
            discountUpdated: { mutation, node }
          }
        }
      }
    ) => {
      let newResult = prev;
      // console.log('mutation', mutation, node);
      if (mutation === 'UPDATED') {
        newResult = onEditDiscount(prev, node);
      } else if (mutation === 'DELETED') {
        newResult = onDeleteDiscount(prev);
      }
      return newResult;
    }
  });

function onEditDiscount(prev, node) {
  // console.log(prev, node);
  return update(prev, {
    modalDiscount: {
      $set: node
    }
  });
}

const onDeleteDiscount = prev => {
  message.info('This discount has been expired!');
  return update(prev, {
    modalDiscount: {
      $set: null
    }
  });
};

export const subscribeToDiscounts = () => console.log('This is Discounts subscription');
