import { defineConfig, Template, RichTextType } from 'tinacms'

// Field utilities
export const createRichText = (name: string, extra?: any): RichTextType => {
  return {
    label: name,
    name: name,
    type: 'rich-text',
    ...extra,
    templates: [
      {
        name: 'TwoColumns',
        label: 'TwoColumns',
        fields: [
          {
            name: 'left',
            label: 'Left',
            type: 'rich-text',
          },
          {
            name: 'right',
            label: 'Right',
            type: 'rich-text',
          },
        ],
      },
      {
        name: 'Buttons',
        label: 'Buttons',
        fields: [
          {
            name: 'Button',
            label: 'Button',
            list: true,
            type: 'object',
            fields: [
              {
                name: 'text',
                label: 'text',
                type: 'string'
              },
              {
                name: 'url',
                label: 'url',
                type: 'string'
              },
            ]
          }
        ]
      },
    ],
  }
}

export const button = (name: string, extra?: any) => {
  return {
    label: name,
    name: name,
    type: 'object',
    ...extra,
    fields: [
      {
        label: 'link',
        name: 'link',
        type: 'string'
      },
      {
        label: 'text',
        name: 'text',
        type: 'string'
      }
    ]
  }
}