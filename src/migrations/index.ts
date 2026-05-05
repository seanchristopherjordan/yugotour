import * as migration_20260501_162019 from './20260501_162019';
import * as migration_20260505_new_blocks_faq from './20260505_new_blocks_faq';
import * as migration_20260506_email_templates_contact_messages from './20260506_email_templates_contact_messages';

export const migrations = [
  {
    up: migration_20260501_162019.up,
    down: migration_20260501_162019.down,
    name: '20260501_162019'
  },
  {
    up: migration_20260505_new_blocks_faq.up,
    down: migration_20260505_new_blocks_faq.down,
    name: '20260505_new_blocks_faq'
  },
  {
    up: migration_20260506_email_templates_contact_messages.up,
    down: migration_20260506_email_templates_contact_messages.down,
    name: '20260506_email_templates_contact_messages'
  },
];
