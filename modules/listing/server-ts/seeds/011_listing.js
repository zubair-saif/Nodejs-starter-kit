import { returnId, truncateTables } from '@gqlapp/database-server-ts';
import { MEDIA } from '@gqlapp/listing-common';

const HIGHLIGHT = ['High quality: Yes', 'Superhigh quality: Yes', 'Break resistance: Yes', 'Super light: Yes'];

exports.seed = async function(knex) {
  await truncateTables(knex, Promise, [
    'listing',
    'listing_flag',
    'listing_option',
    'listing_detail',
    'listing_medium',
    'listing_cost',
    'listing_bookmark'
  ]);

  await Promise.all(
    [...Array(100).keys()].map(async ii => {
      // const isDiscount = Math.random() > 0.7;
      const isActive = Math.random() < 0.6 ? false : true;
      const listing = await returnId(knex('listing')).insert({
        user_id: Math.random() < 0.7 ? 2 : 1,

        title: `Listing ${ii + 1}`,
        description: `This is listing ${ii + 1}`,
        sku: `${Math.floor(Math.random() * 2) + 1}`,

        is_active: isActive
      });
      await returnId(knex('listing_flag')).insert({
        listing_id: listing[0],

        is_featured: Math.random() < 0.6 ? false : true,
        is_new: Math.random() < 0.6 ? false : true,
        // is_discount: isDiscount,

        is_active: isActive
      });
      await returnId(knex('listing_option')).insert({
        listing_id: listing[0],

        fixed_quantity: Math.random() < 0.6 ? -1 : Math.floor(Math.random() * (10 - 1 + 1) + 1),

        is_active: isActive
      });
      await returnId(knex('listing_detail')).insert({
        listing_id: listing[0],

        inventory_count: Math.floor(Math.random() * (50 - 1 + 1) + 1),

        is_active: isActive
      });
      await Promise.all(
        [...Array(3).keys()].map(async () => {
          return returnId(knex('listing_medium')).insert({
            listing_id: listing[0],
            ...MEDIA[Math.floor(Math.random() * (MEDIA.length - 1 - 0 + 1) + 0)],
            is_active: Math.random() < 0.6 ? false : true
          });
        })
      );
      await returnId(knex('listing_cost')).insert({
        listing_id: listing[0],
        cost: Math.floor(Math.random() * (999 - 100 + 1) + 100),
        // discount: isDiscount ? Math.floor(Math.random() * (60 - 1 + 1) + 1).toFixed(2) : 0,
        type: '',
        label: '',
        is_active: isActive
      });
      await Promise.all(
        [...Array(4).keys()].map(async i => {
          return returnId(knex('listing_highlight')).insert({
            listing_id: listing[0],
            highlight: HIGHLIGHT[i]
          });
        })
      );
      (Math.random() < 0.6 ? false : true) &&
        (await returnId(knex('listing_bookmark')).insert({
          listing_id: listing[0],
          user_id: Math.floor(Math.random() * 2) + 1
        }));
    })
  );
};
