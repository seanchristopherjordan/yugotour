import * as migration_20260501_162019 from './20260501_162019';
import * as migration_20260505_new_blocks_faq from './20260505_new_blocks_faq';
import * as migration_20260506_email_templates_contact_messages from './20260506_email_templates_contact_messages';
import * as migration_20260506_fix_hero_schema from './20260506_fix_hero_schema';
import * as migration_20260506_add_pickup_spot from './20260506_add_pickup_spot';

export const migrations = [
  {
    up: migration_20260501_162019.up,
    down: migration_20260501_162019.down,
    name: '20260501_162019',
  },
  {
    up: migration_20260505_new_blocks_faq.up,
    down: migration_20260505_new_blocks_faq.down,
    name: '20260505_new_blocks_faq',
  },
  {
    up: migration_20260506_email_templates_contact_messages.up,
    down: migration_20260506_email_templates_contact_messages.down,
    name: '20260506_email_templates_contact_messages',
  },
  {
    up: migration_20260506_fix_hero_schema.up,
    down: migration_20260506_fix_hero_schema.down,
    name: '20260506_fix_hero_schema',
  },
  {
    up: migration_20260506_add_pickup_spot.up,
    down: migration_20260506_add_pickup_spot.down,
    name: '20260506_add_pickup_spot',
  },
];
