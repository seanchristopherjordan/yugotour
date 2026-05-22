import * as migration_20260501_162019 from './20260501_162019';
import * as migration_20260505_new_blocks_faq from './20260505_new_blocks_faq';
import * as migration_20260506_add_page_hero_enum from './20260506_add_page_hero_enum';
import * as migration_20260506_add_pickup_spot from './20260506_add_pickup_spot';
import * as migration_20260506_email_template_keys from './20260506_email_template_keys';
import * as migration_20260506_email_templates_contact_messages from './20260506_email_templates_contact_messages';
import * as migration_20260506_fix_hero_schema from './20260506_fix_hero_schema';
import * as migration_20260507_202230 from './20260507_202230';
import * as migration_20260507_optional_extras from './20260507_optional_extras';
import * as migration_20260508_full_bleed_static_mobile_image from './20260508_full_bleed_static_mobile_image';
import * as migration_20260522_site_settings_default_og_image from './20260522_site_settings_default_og_image';

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
    up: migration_20260506_add_page_hero_enum.up,
    down: migration_20260506_add_page_hero_enum.down,
    name: '20260506_add_page_hero_enum',
  },
  {
    up: migration_20260506_add_pickup_spot.up,
    down: migration_20260506_add_pickup_spot.down,
    name: '20260506_add_pickup_spot',
  },
  {
    up: migration_20260506_email_template_keys.up,
    down: migration_20260506_email_template_keys.down,
    name: '20260506_email_template_keys',
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
    up: migration_20260507_202230.up,
    down: migration_20260507_202230.down,
    name: '20260507_202230',
  },
  {
    up: migration_20260507_optional_extras.up,
    down: migration_20260507_optional_extras.down,
    name: '20260507_optional_extras'
  },
  {
    up: migration_20260508_full_bleed_static_mobile_image.up,
    down: migration_20260508_full_bleed_static_mobile_image.down,
    name: '20260508_full_bleed_static_mobile_image',
  },
  {
    up: migration_20260522_site_settings_default_og_image.up,
    down: migration_20260522_site_settings_default_og_image.down,
    name: '20260522_site_settings_default_og_image',
  },
];
