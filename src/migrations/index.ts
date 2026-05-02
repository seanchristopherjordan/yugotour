import * as migration_20260501_162019 from './20260501_162019';

export const migrations = [
  {
    up: migration_20260501_162019.up,
    down: migration_20260501_162019.down,
    name: '20260501_162019'
  },
];
