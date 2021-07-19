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
  name: 'ButtonDemo',
  data() {
    return {
      demoComp: createComp(),
      demoEvents: [
        {
          name: 'kup-button-click',
          type: 'click',
        },
        {
          name: 'kup-button-focus',
          type: 'focus',
        },
        {
          name: 'kup-button-blur',
          type: 'blur',
        },
      ],
      demoProps: [
        {
          prop: 'checked',
          description:
            'Icon button variant only. The toggable icon button state will be initialized to ON.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
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
          prop: 'disabled',
          description:
            'Sets the component to disabled state, making it not interactable.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'icon',
          description:
            'The button will be rendered with the specified Material Design icon.',
          type: 'string',
          default: 'null',
          try: 'field',
        },
        {
          prop: 'iconOff',
          description:
            'Toggable icon button variant only. By default, the off state will be displayed as an outlined version of the icon prop. By setting this prop with a Material Design icon, the off state will show this icon instead.',
          type: 'string',
          default: 'null',
          try: 'field',
        },
        {
          prop: 'label',
          description:
            "The button's text. If no value is specified, the button will render as an icon button, in this variant specifying an icon is mandatory.",
          type: 'string',
          default: 'null',
          try: 'field',
        },
        {
          prop: 'styling',
          description:
            'Defines the style of the button. Styles available: "flat", "outlined", "floating", "icon" and "raised" which is also the default.',
          type: 'FButtonStyling',
          default: 'raised',
          try: 'field',
        },
        {
          prop: 'toggable',
          description:
            'Icon button variant only. The icon button supports the toggable state, switching between ON and OFF.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'trailingIcon',
          description:
            'The button will display its associated icon after the text.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
      ],
      demoClasses: [
        {
          class: 'kup-danger',
          description:
            'The component will be rendered using the danger color of the app.',
        },
        {
          class: 'kup-full-height',
          description:
            'The button will fill all the available vertical space (needs a new render to be effective).',
        },
        {
          class: 'kup-full-width',
          description:
            'The button will fill all the available horizontal space (needs a new render to be effective).',
        },
        {
          class: 'kup-info',
          description:
            'The component will be rendered using the info color of the app.',
        },
        {
          class: 'kup-large',
          description:
            'The button will have an increased size (needs a new render to be effective).',
        },
        {
          class: 'kup-secondary',
          description:
            'The component will be rendered using the secondary color of the app.',
        },
        {
          class: 'kup-shaped',
          description:
            'The borders of the button will be shaped (needs a new render to be effective).',
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
  let comp = document.createElement('kup-button');
  comp.icon = 'widgets';
  comp.id = 'demo-component';
  comp.label = 'Demo';
  comp.styling = 'raised';
  return comp;
}
</script>
