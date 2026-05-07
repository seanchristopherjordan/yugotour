import type { Block } from 'payload'

export const SimulatorBlock: Block = {
  slug: 'simulatorBlock',
  interfaceName: 'SimulatorBlock',
  labels: { singular: 'Yugotour Simulator', plural: 'Yugotour Simulators' },
  fields: [
    {
      name: 'spacing',
      type: 'group',
      label: 'Vertical Spacing',
      admin: { description: 'Override the default top/bottom margin of this block.' },
      fields: [
        {
          name: 'top',
          type: 'select',
          label: 'Top',
          defaultValue: 'standard',
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'None', value: 'none' },
            { label: 'Custom', value: 'custom' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'topCustom',
          type: 'number',
          label: 'Custom top (rem)',
          admin: {
            width: '50%',
            step: 0.5,
            condition: (_, siblingData) => siblingData?.top === 'custom',
          },
        },
        {
          name: 'bottom',
          type: 'select',
          label: 'Bottom',
          defaultValue: 'standard',
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'None', value: 'none' },
            { label: 'Custom', value: 'custom' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'bottomCustom',
          type: 'number',
          label: 'Custom bottom (rem)',
          admin: {
            width: '50%',
            step: 0.5,
            condition: (_, siblingData) => siblingData?.bottom === 'custom',
          },
        },
      ],
    },
  ],
}
