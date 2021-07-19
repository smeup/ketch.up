<template>
  <div>
    <demo
      :demoComp="demoComp"
      :demoEvents="demoEvents"
      :demoProps="demoProps"
      :demoClasses="demoClasses"
    ></demo>
  </div>
</template>

<script>
import Demo from '@/views/advanced/page/templates/Demo';

export default {
  components: {
    Demo,
  },
  name: 'ImageDemo',
  data() {
    return {
      demoComp: createComp(),
      demoEvents: [
        {
          name: 'kup-image-click',
          type: 'click',
        },
      ],
      demoProps: [
        {
          prop: 'badgeData',
          description: 'Sets the data of badges.',
          type: 'KupBadge',
          default: '[]',
          try: 'json',
        },
        {
          prop: 'color',
          description:
            'The color of the image, defaults to the primary color of the app. Accepts any CSS color format (HEX, RGB, etc.). It works only when the image is in a vector format.',
          type: 'string',
          default: 'var(--kup-icon-color)',
          try: 'field',
        },
        {
          prop: 'customStyle',
          description:
            'Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization',
          type: 'string',
          default: '""',
          try: 'css',
        },
        {
          prop: 'data',
          description:
            'When present, the component will be drawn using CSS. Check the "Drawing with CSS" section of the image showcase for more information.',
          type: 'FImageData[]',
          default: 'null',
          try: 'json',
        },
        {
          prop: 'feedback',
          description:
            'When set to true, a spinner will be displayed until the image finished loading. Not compatible with SVGs.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'isCanvas',
          description:
            "The image component will create a canvas element on which it's possible to draw.  It's a temporary feature that will be fully replaced by CSS drawing in the future.",
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'resource',
          description:
            'The name of the image. It can also contain an URL or a path.',
          type: 'string',
          default: 'null',
          try: 'field',
        },
        {
          prop: 'sizeX',
          description:
            'The width of the image, defaults to 100%. Accepts any valid CSS format (px, %, vh, etc.).',
          type: 'string',
          default: '100%',
          try: 'field',
        },
        {
          prop: 'sizeY',
          description:
            'The height of the image, defaults to 100%. Accepts any valid CSS format (px, %, vh, etc.).',
          type: 'string',
          default: '100%',
          try: 'field',
        },
      ],
      demoClasses: [
        {
          class: 'kup-danger',
          description:
            'The component will be rendered using the danger color of the app.',
        },
        {
          class: 'kup-fit',
          description:
            "The component won't exceed its size in pixels (needs a new render to be effective, works only when resource is an URL).",
        },
        {
          class: 'kup-info',
          description:
            'The component will be rendered using the informational color of the app.',
        },
        {
          class: 'kup-secondary',
          description:
            'The component will be rendered using the secondary color of the app.',
        },
        {
          class: 'kup-success',
          description:
            'The component will be rendered using the success color of the app.',
        },
        {
          class: 'kup-warning',
          description:
            'The component will be rendered using the warning color of the app.',
        },
      ],
    };
  },
};

function createComp() {
  let comp = document.createElement('kup-image');
  comp.badgeData = [
    {
      imageData: {
        resource:
          'https://ketchup.smeup.com/ketchup-showcase/header_logo_dark.svg',
        sizeX: '1.75rem',
        sizeY: 'auto',
      },
      position: 'BL',
    },
  ];
  comp.color = 'var(--kup-icon-color)';
  comp.id = 'demo-component';
  comp.resource = 'widgets';
  comp.sizeX = '128px';
  comp.sizeY = '128px';
  return comp;
}
</script>
