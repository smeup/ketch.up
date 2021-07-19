<template>
  <div>
    <div class="demo-wrapper">
      <p>
        There are several other ways to render a button in addition to the
        default styling, through the usage of the
        <span class="code-word">styling</span> prop.<br />
        When set to
        <span class="code-word">flat</span> the button will be rendered without
        its background, only the text will be visible.<br />
        On the other hand, when
        <span class="code-word">outlined</span>, the button will have an
        outlined look.<br />
        If you need a floating action button, commonly used for quick and
        highlighted user actions, you can set
        <span class="code-word">floating</span>.
        <br />
        <span class="code-word">icon</span> will render an icon button, even if
        the <span class="code-word">label</span> prop was declared.
      </p>
      <div class="demo-container">
        <div class="kup-container">
          <kup-button styling="flat" label="Flat"></kup-button>
          <kup-button styling="outlined" label="Outlined"></kup-button>
          <kup-button styling="floating" label="Floating"></kup-button>
        </div>
        <p class="centered">Flat sample markup</p>
        <code class="flat">{{ markupFlat }}</code>
        <p class="centered">Outlined sample markup</p>
        <code class="flat">{{ markupOutlined }}</code>
        <p class="centered">Floating sample markup</p>
        <code class="flat">{{ markupFloating }}</code>
      </div>
    </div>

    <div class="demo-wrapper">
      <p>
        The class
        <span class="code-word">shaped</span> may be used for any of the
        stylings above, and it will shape the edges of the button to be more
        round.
      </p>
      <div class="demo-container">
        <div class="kup-container">
          <kup-button class="shaped" label="Raised"></kup-button>
          <kup-button styling="flat" class="shaped" label="Flat"></kup-button>
          <kup-button
            styling="outlined"
            class="shaped"
            label="Outlined"
          ></kup-button>
        </div>
        <p class="centered">Shaped sample markup</p>
        <code class="flat">{{ markupRounded }}</code>
      </div>
    </div>

    <div class="demo-wrapper">
      <p>
        It is possible to set the button to fill all available space both
        vertically and horizontally, using the
        <span class="code-word">kup-full-height</span> and
        <span class="code-word">kup-full-width</span> classes. You can use them
        both as in the example below.
      </p>
      <div class="demo-container">
        <div
          class="kup-container"
          style="height: 25vh; width: 50vw; margin: auto; margin-bottom: 2rem"
        >
          <kup-button
            class="kup-full-height kup-full-width"
            label="Full height and full width"
          ></kup-button>
        </div>
        <p class="centered">Full height sample markup</p>
        <code class="flat">{{ markupFullheight }}</code>
        <p class="centered">Full width sample markup</p>
        <code class="flat">{{ markupFullwidth }}</code>
      </div>
    </div>

    <div class="demo-wrapper">
      <p>
        If you want to use an icon to give further emphasis to the button's
        meaning, you can use the attribute
        <span class="code-word">icon</span> and specify a value supported by the
        <a href="https://ketchup.smeup.com/ketchup-showcase/#/image"
          >Ketch.UP Icon component</a
        >. It's important to specify both
        <span class="code-word">label</span> and
        <span class="code-word">icon</span> attributes in this case, because
        specifying only <span class="code-word">icon</span> will render the
        <span class="code-word">icon button variant</span>.
      </p>
      <div class="demo-container">
        <div class="kup-container">
          <kup-button icon="favorite" label="Favorite"></kup-button>
          <kup-button
            styling="flat"
            icon="play_arrow"
            label="Play"
          ></kup-button>
          <kup-button
            styling="outlined"
            icon="done"
            label="Submit"
          ></kup-button>
        </div>
        <p class="centered">Icon sample markup</p>
        <code class="flat">{{ markupIcon }}</code>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ButtonStyling',
  data() {
    return {
      markupFlat: '<kup-button styling="flat" label="Flat"></kup-button>',
      markupFullheight:
        '<kup-button class="kup-full-height" label="Full height"></kup-button>',
      markupFullwidth:
        '<kup-button class="kup-full-width" label="Full width"></kup-button>',
      markupOutlined:
        '<kup-button styling="outlined" label="Outlined"></kup-button>',
      markupFloating:
        '<kup-button styling="floating" label="Floating"></kup-button>',
      markupRounded: '<kup-button class="shaped" label="Shaped"></kup-button>',
      markupIcon: '<kup-button icon="Favorite" label="Favorite"></kup-button>',
    };
  },
};
</script>
