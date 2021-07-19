<template>
  <div>
    <p>
      In this section you can create your own theme. <br />Choose a template to
      start from, then start editing your variables.<br />
      Keep in mind that the JSON tab will always contain the data of your theme,
      if it doesn't yet exist it will be created.<br /><br />
      Your theme will be stored until you refresh the page or until you delete
      it, so you can freely swap to another template during the creation
      process.
    </p>
    <div id="theme-container-demo" class="kup-container"></div>
    <div id="theme-action-demo">
      <kup-button
        title="Download"
        icon="download"
        @kup-button-click="downloadTheme" />
      <kup-button title="Delete" icon="delete" @kup-button-click="deleteTheme"
    /></div>
    <div id="sample-wrapper" class="theming">
      <div id="sample-specs">
        <kup-tab-bar
          id="demo-tab-bar"
          :data.prop="tabs"
          @kup-tabbar-click="handleTab"
        ></kup-tab-bar>
        <div id="sample-comp" class="full">
          <table class="instruction-table" id="css-variables-tab">
            <thead>
              <tr>
                <th>Variable name</th>
                <th>Description</th>
                <th>Type</th>
                <th>Try it!</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-primary-color</span>
                </td>
                <td>
                  Sets the primary color of the app, changing components
                  accordingly.
                </td>
                <td class="prevent-cr">
                  <span class="code-word">color</span>
                </td>
                <td class="text-cell">
                  <kup-color-picker
                    id="primary-color"
                    :data.prop="colorPickerData"
                    @kup-colorpicker-input="updateThemeVariable"
                    @kup-colorpicker-change="updateThemeVariable"
                  ></kup-color-picker>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-secondary-color</span>
                </td>
                <td>
                  Sets the secondary color of the app, usable by specifying the
                  .kup-secondary class to kup components.
                </td>
                <td class="prevent-cr">
                  <span class="code-word">color</span>
                </td>
                <td class="text-cell">
                  <kup-color-picker
                    id="secondary-color"
                    :data.prop="colorPickerData"
                    @kup-colorpicker-input="updateThemeVariable"
                    @kup-colorpicker-change="updateThemeVariable"
                  ></kup-color-picker>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-background-color</span>
                </td>
                <td>Sets the color of the background.</td>
                <td class="prevent-cr">
                  <span class="code-word">color</span>
                </td>
                <td class="text-cell">
                  <kup-color-picker
                    id="background-color"
                    :data.prop="colorPickerData"
                    @kup-colorpicker-input="updateThemeVariable"
                    @kup-colorpicker-change="updateThemeVariable"
                  ></kup-color-picker>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-nav-bar-background-color</span>
                </td>
                <td>Sets the background color of the header/nav bar.</td>
                <td class="prevent-cr">
                  <span class="code-word">color</span>
                </td>
                <td class="text-cell">
                  <kup-color-picker
                    id="nav-bar-background-color"
                    :data.prop="colorPickerData"
                    @kup-colorpicker-input="updateThemeVariable"
                    @kup-colorpicker-change="updateThemeVariable"
                  ></kup-color-picker>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-drawer-background-color</span>
                </td>
                <td>Sets the color of the drawer/side menu.</td>
                <td class="prevent-cr">
                  <span class="code-word">color</span>
                </td>
                <td class="text-cell">
                  <kup-color-picker
                    id="drawer-background-color"
                    :data.prop="colorPickerData"
                    @kup-colorpicker-input="updateThemeVariable"
                    @kup-colorpicker-change="updateThemeVariable"
                  ></kup-color-picker>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-font-family</span>
                </td>
                <td>
                  Sets a different font family, overriding the default Roboto
                  provided by Material Design. To set a custom font not natively
                  supported by the browser, you must import manually its font
                  face.
                </td>
                <td class="prevent-cr">
                  <span class="code-word">font</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    full-width
                    id="font-family"
                    @kup-textfield-input="updateThemeVariable"
                  ></kup-text-field>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-font-family-monospace</span>
                </td>
                <td>
                  Sets the font family used for monospace text. Right now it's
                  used only by kup-datatable when cells are numbers.
                </td>
                <td class="prevent-cr">
                  <span class="code-word">font</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    full-width
                    id="font-family-monospace"
                    @kup-textfield-input="updateThemeVariable"
                  ></kup-text-field>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-font-size</span>
                </td>
                <td>
                  Sets a different font size, a sensible range is between 12px
                  and 18px. It's possible to break this boundary but some
                  strange behaviors might occur.
                </td>
                <td class="prevent-cr">
                  <span class="code-word">size</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    full-width
                    id="font-size"
                    @kup-textfield-input="updateThemeVariable"
                  ></kup-text-field>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-text-color</span>
                </td>
                <td>Sets the color of plain text, such as labels.</td>
                <td class="prevent-cr">
                  <span class="code-word">color</span>
                </td>
                <td class="text-cell">
                  <kup-color-picker
                    id="text-color"
                    :data.prop="colorPickerData"
                    @kup-colorpicker-input="updateThemeVariable"
                    @kup-colorpicker-change="updateThemeVariable"
                  ></kup-color-picker>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-text-on-primary-color</span>
                </td>
                <td>
                  Sets the color of text displayed above the primary color, keep
                  in mind readability when setting this!
                </td>
                <td class="prevent-cr">
                  <span class="code-word">color</span>
                </td>
                <td class="text-cell">
                  <kup-color-picker
                    id="text-on-primary-color"
                    :data.prop="colorPickerData"
                    @kup-colorpicker-input="updateThemeVariable"
                    @kup-colorpicker-change="updateThemeVariable"
                  ></kup-color-picker>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-text-on-secondary-color</span>
                </td>
                <td>
                  Sets the color of text displayed above the secondary color,
                  keep in mind readability when setting this!
                </td>
                <td class="prevent-cr">
                  <span class="code-word">color</span>
                </td>
                <td class="text-cell">
                  <kup-color-picker
                    id="text-on-secondary-color"
                    :data.prop="colorPickerData"
                    @kup-colorpicker-input="updateThemeVariable"
                    @kup-colorpicker-change="updateThemeVariable"
                  ></kup-color-picker>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-disabled-background-color</span>
                </td>
                <td>
                  Sets the background color of disabled text, keep in mind
                  readability when setting its counterpart
                  "--kup-disabled-color".
                </td>
                <td class="prevent-cr">
                  <span class="code-word">color</span>
                </td>
                <td class="text-cell">
                  <kup-color-picker
                    id="disabled-background-color"
                    :data.prop="colorPickerData"
                    @kup-colorpicker-input="updateThemeVariable"
                    @kup-colorpicker-change="updateThemeVariable"
                  ></kup-color-picker>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-disabled-color</span>
                </td>
                <td>Sets the color of disabled text.</td>
                <td class="prevent-cr">
                  <span class="code-word">color</span>
                </td>
                <td class="text-cell">
                  <kup-color-picker
                    id="disabled-color"
                    :data.prop="colorPickerData"
                    @kup-colorpicker-input="updateThemeVariable"
                    @kup-colorpicker-change="updateThemeVariable"
                  ></kup-color-picker>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-hover-background-color</span>
                </td>
                <td>Sets the background of elements at mouse hover.</td>
                <td class="prevent-cr">
                  <span class="code-word">color</span>
                </td>
                <td class="text-cell">
                  <kup-color-picker
                    id="hover-background-color"
                    :data.prop="colorPickerData"
                    @kup-colorpicker-input="updateThemeVariable"
                    @kup-colorpicker-change="updateThemeVariable"
                  ></kup-color-picker>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-hover-color</span>
                </td>
                <td>
                  Sets the color of text at mouse hover, keep in mind
                  readability with its counterpart
                  "--kup-hover-background-color".
                </td>
                <td class="prevent-cr">
                  <span class="code-word">color</span>
                </td>
                <td class="text-cell">
                  <kup-color-picker
                    id="hover-color"
                    :data.prop="colorPickerData"
                    @kup-colorpicker-input="updateThemeVariable"
                    @kup-colorpicker-change="updateThemeVariable"
                  ></kup-color-picker>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-title-background-color</span>
                </td>
                <td
                  >Sets the background color of titles (trees, data tables,
                  etc.).</td
                >
                <td class="prevent-cr">
                  <span class="code-word">color</span>
                </td>
                <td class="text-cell">
                  <kup-color-picker
                    id="title-background-color"
                    :data.prop="colorPickerData"
                    @kup-colorpicker-input="updateThemeVariable"
                    @kup-colorpicker-change="updateThemeVariable"
                  ></kup-color-picker>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-title-color</span>
                </td>
                <td>Sets the color of titles (trees, data tables, etc.).</td>
                <td class="prevent-cr">
                  <span class="code-word">color</span>
                </td>
                <td class="text-cell">
                  <kup-color-picker
                    id="title-color"
                    :data.prop="colorPickerData"
                    @kup-colorpicker-input="updateThemeVariable"
                    @kup-colorpicker-change="updateThemeVariable"
                  ></kup-color-picker>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-icon-color</span>
                </td>
                <td>
                  Sets the color of icons, for example leading and trailing
                  icons in text fields.
                </td>
                <td class="prevent-cr">
                  <span class="code-word">color</span>
                </td>
                <td class="text-cell">
                  <kup-color-picker
                    id="icon-color"
                    :data.prop="colorPickerData"
                    @kup-colorpicker-input="updateThemeVariable"
                    @kup-colorpicker-change="updateThemeVariable"
                  ></kup-color-picker>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-border-color</span>
                </td>
                <td>Sets the color of borders, such as checkboxes borders.</td>
                <td class="prevent-cr">
                  <span class="code-word">color</span>
                </td>
                <td class="text-cell">
                  <kup-color-picker
                    id="border-color"
                    :data.prop="colorPickerData"
                    @kup-colorpicker-input="updateThemeVariable"
                    @kup-colorpicker-change="updateThemeVariable"
                  ></kup-color-picker>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-box-shadow</span>
                </td>
                <td
                  >Generic box shadow mostly used for stacked elements (like
                  contextual menus).</td
                >
                <td class="prevent-cr">
                  <span class="code-word">box-shadow</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    full-width
                    id="box-shadow"
                    @kup-textfield-input="updateThemeVariable"
                  ></kup-text-field>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-field-background-color</span>
                </td>
                <td>Sets the background color of filled text fields.</td>
                <td class="prevent-cr">
                  <span class="code-word">color</span>
                </td>
                <td class="text-cell">
                  <kup-color-picker
                    id="field-background-color"
                    :data.prop="colorPickerData"
                    @kup-colorpicker-input="updateThemeVariable"
                    @kup-colorpicker-change="updateThemeVariable"
                  ></kup-color-picker>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-info-color</span>
                </td>
                <td
                  >Sets the color which defines an informational status within
                  the app.</td
                >
                <td class="prevent-cr">
                  <span class="code-word">color</span>
                </td>
                <td class="text-cell">
                  <kup-color-picker
                    id="info-color"
                    :data.prop="colorPickerData"
                    @kup-colorpicker-input="updateThemeVariable"
                    @kup-colorpicker-change="updateThemeVariable"
                  ></kup-color-picker>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-success-color</span>
                </td>
                <td
                  >Sets the color which defines a success status within the
                  app.</td
                >
                <td class="prevent-cr">
                  <span class="code-word">color</span>
                </td>
                <td class="text-cell">
                  <kup-color-picker
                    id="success-color"
                    :data.prop="colorPickerData"
                    @kup-colorpicker-input="updateThemeVariable"
                    @kup-colorpicker-change="updateThemeVariable"
                  ></kup-color-picker>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-warning-color</span>
                </td>
                <td
                  >Sets the color which defines a warning status within the
                  app.</td
                >
                <td class="prevent-cr">
                  <span class="code-word">color</span>
                </td>
                <td class="text-cell">
                  <kup-color-picker
                    id="warning-color"
                    :data.prop="colorPickerData"
                    @kup-colorpicker-input="updateThemeVariable"
                    @kup-colorpicker-change="updateThemeVariable"
                  ></kup-color-picker>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-danger-color</span>
                </td>
                <td
                  >Sets the color which defines a danger status within the
                  app.</td
                >
                <td class="prevent-cr">
                  <span class="code-word">color</span>
                </td>
                <td class="text-cell">
                  <kup-color-picker
                    id="danger-color"
                    :data.prop="colorPickerData"
                    @kup-colorpicker-input="updateThemeVariable"
                    @kup-colorpicker-change="updateThemeVariable"
                  ></kup-color-picker>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-spinner-color</span>
                </td>
                <td>Sets the color of spinners.</td>
                <td class="prevent-cr">
                  <span class="code-word">color</span>
                </td>
                <td class="text-cell">
                  <kup-color-picker
                    id="spinner-color"
                    :data.prop="colorPickerData"
                    @kup-colorpicker-input="updateThemeVariable"
                    @kup-colorpicker-change="updateThemeVariable"
                  ></kup-color-picker>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-chart-color-1</span>
                </td>
                <td
                  >Sets the first color of kup-chart. Offline mode variants:
                  "bar" (positive bar color), "dis" (line color), "lin" (line
                  color), "pie" (first slice).</td
                >
                <td class="prevent-cr">
                  <span class="code-word">color</span>
                </td>
                <td class="text-cell">
                  <kup-color-picker
                    id="chart-color-1"
                    :data.prop="colorPickerData"
                    @kup-colorpicker-input="updateThemeVariable"
                    @kup-colorpicker-change="updateThemeVariable"
                  ></kup-color-picker>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-chart-color-2</span>
                </td>
                <td
                  >Sets the second color of kup-chart. Offline mode variants:
                  "bar" (negative bar color), "lin" (fill color), "pie" (second
                  slice).</td
                >
                <td class="prevent-cr">
                  <span class="code-word">color</span>
                </td>
                <td class="text-cell">
                  <kup-color-picker
                    id="chart-color-2"
                    :data.prop="colorPickerData"
                    @kup-colorpicker-input="updateThemeVariable"
                    @kup-colorpicker-change="updateThemeVariable"
                  ></kup-color-picker>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-chart-color-3</span>
                </td>
                <td
                  >Sets the third color of kup-chart. Offline mode variants:
                  "bar" (neutral bar color), "pie" (third slice).</td
                >
                <td class="prevent-cr">
                  <span class="code-word">color</span>
                </td>
                <td class="text-cell">
                  <kup-color-picker
                    id="chart-color-3"
                    :data.prop="colorPickerData"
                    @kup-colorpicker-input="updateThemeVariable"
                    @kup-colorpicker-change="updateThemeVariable"
                  ></kup-color-picker>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-chart-color-4</span>
                </td>
                <td
                  >Sets the fourth color of kup-chart and so on. It is possible
                  to specify an infinite amount of "--kup-chart-color" variables
                  (use the JSON tab to add as many as you like).</td
                >
                <td class="prevent-cr">
                  <span class="code-word">color</span>
                </td>
                <td class="text-cell">
                  <kup-color-picker
                    id="chart-color-4"
                    :data.prop="colorPickerData"
                    @kup-colorpicker-input="updateThemeVariable"
                    @kup-colorpicker-change="updateThemeVariable"
                  ></kup-color-picker>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-obj-cursor</span>
                </td>
                <td
                  >Sets the cursor style when the mouse hovers over an
                  object.</td
                >
                <td class="prevent-cr">
                  <span class="code-word">cursor</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    full-width
                    id="obj-cursor"
                    @kup-textfield-input="updateThemeVariable"
                  ></kup-text-field>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="instruction-table" id="customstyle-tab">
            <thead>
              <tr>
                <th>Component</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">MASTER</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="master"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-AUTOCOMPLETE</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-autocomplete"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-BADGE</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-badge"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-BUTTON</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-button"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-BOX</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-box"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-CARD</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-card"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-CHECKBOX</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-checkbox"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-CHIP</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-chip"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-COLOR-PICKER</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-color-picker"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-COMBOBOX</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-combobox"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-DATA-TABLE</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-data-table"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-DATE-PICKER</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-date-picker"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-DRAWER</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-drawer"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-ECHART</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-echart"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-FIELD</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-field"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-GAUGE</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-gauge"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-GRID</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-grid"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-IMAGE</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-image"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-LAZY</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-lazy"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-LIST</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-list"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-NAV-BAR</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-nav-bar"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-PROGRESS-BAR</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-progress-bar"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-RADIO</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-radio"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-RATING</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-rating"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-SPINNER</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-spinner"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-SWITCH</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-switch"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-TAB-BAR</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-tab-bar"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-TEXT-FIELD</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-text-field"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-TIME-PICKER</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-time-picker"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">KUP-TREE</span>
                </td>
                <td class="text-cell">
                  <kup-text-field
                    text-area
                    full-width
                    id="kup-tree"
                    @kup-textfield-input="updateThemeCustomStyles"
                  ></kup-text-field
                ></td> </tr></tbody
          ></table>
          <table class="instruction-table" id="icons-tab">
            <thead>
              <tr>
                <th>Variable name</th>
                <th>Description</th>
                <th>Try it!</th>
              </tr> </thead
            ><tbody>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-ascending-icon</span>
                </td>
                <td> Used for ascending sorts. </td>
                <td class="text-cell">
                  <kup-text-field
                    full-width
                    id="ascending-icon"
                    @kup-textfield-input="updateThemeIcons"
                  ></kup-text-field>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-descending-icon</span>
                </td>
                <td> Used for descending sorts. </td>
                <td class="text-cell">
                  <kup-text-field
                    full-width
                    id="descending-icon"
                    @kup-textfield-input="updateThemeIcons"
                  ></kup-text-field>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-expanded-icon</span>
                </td>
                <td>Used when a node or a group are expanded.</td>
                <td class="text-cell">
                  <kup-text-field
                    full-width
                    id="expanded-icon"
                    @kup-textfield-input="updateThemeIcons"
                  ></kup-text-field>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-collapsed-icon</span>
                </td>
                <td>Used when a node or a group are collapsed.</td>
                <td class="text-cell">
                  <kup-text-field
                    full-width
                    id="collapsed-icon"
                    @kup-textfield-input="updateThemeIcons"
                  ></kup-text-field>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-clear-icon</span>
                </td>
                <td>Used when an element can be cleared or deleted.</td>
                <td class="text-cell">
                  <kup-text-field
                    full-width
                    id="clear-icon"
                    @kup-textfield-input="updateThemeIcons"
                  ></kup-text-field>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-filter-remove-icon</span>
                </td>
                <td>Used as a button to clear filters previously set.</td>
                <td class="text-cell">
                  <kup-text-field
                    full-width
                    id="filter-remove-icon"
                    @kup-textfield-input="updateThemeIcons"
                  ></kup-text-field>
                </td>
              </tr>
              <tr>
                <td class="prevent-cr">
                  <span class="code-word">--kup-key-icon</span>
                </td>
                <td>Used to identify a key.</td>
                <td class="text-cell">
                  <kup-text-field
                    full-width
                    id="key-icon"
                    @kup-textfield-input="updateThemeIcons"
                  ></kup-text-field>
                </td> </tr
            ></tbody>
          </table>
          <div id="json-tab" class="sample-section" style="display: none">
            <textarea id="json-textarea" style="display: none"></textarea>
            <kup-button
              id="json-warning"
              icon="warning"
              title="Invalid JSON. Theme not set."
            ></kup-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ThemingMaker',
  data() {
    return {
      colorPickerData: { 'kup-text-field': { fullWidth: true } },
      tabs: [
        {
          value: 'CSSvariables',
          text: 'CSS variables',
          icon: 'color_lens',
          title: "List of the current theme's variables",
        },
        {
          value: 'customStyles',
          text: 'customStyles',
          icon: 'style',
          title: "List of the current theme's customStyles",
        },
        {
          value: 'Icons',
          text: 'Icons',
          icon: 'photo',
          title: "List of the current theme's icons",
        },
        {
          value: 'JSON',
          text: 'JSON',
          icon: 'json',
          title: 'The JSON of your theme',
        },
      ],
    };
  },
  methods: {
    updateThemeVariable(e) {
      const dom = document.documentElement;
      this.initTheme();

      const list = { ...dom.ketchup.theme.list };
      list['showcaseDemo']['cssVariables']['--kup-' + e.target.id] =
        e.detail.value;
      dom.ketchup.theme.set(null, list);
      e.target.customStyle =
        '#kup-component .icon-container { background-color: ' +
        e.detail.value +
        ' }';

      this.refreshTheme();
    },

    updateThemeCustomStyles(e) {
      const dom = document.documentElement;
      this.initTheme();

      const list = { ...dom.ketchup.theme.list };
      list['showcaseDemo']['customStyles'][e.target.id.toUpperCase()] =
        e.detail.value;
      dom.ketchup.theme.set(null, list);

      this.refreshTheme();
    },

    updateThemeIcons(e) {
      const dom = document.documentElement;
      this.initTheme();

      const list = { ...dom.ketchup.theme.list };
      list['showcaseDemo']['icons']['--kup-' + e.target.id] = e.detail.value;
      dom.ketchup.theme.set(null, list);
      e.target.icon = e.detail.value;

      this.refreshTheme();
    },

    initTheme() {
      const dom = document.documentElement;
      const list = { ...dom.ketchup.theme.list };

      if (!list['showcaseDemo']) {
        list['showcaseDemo'] = JSON.parse(
          JSON.stringify(dom.ketchup.theme.list[dom.ketchup.theme.name])
        );
        if (!list['showcaseDemo'].cssVariables) {
          list['showcaseDemo'].cssVariables = {};
        }
        if (!list['showcaseDemo'].customStyles) {
          list['showcaseDemo'].customStyles = {};
        }
        if (!list['showcaseDemo'].icons) {
          list['showcaseDemo'].icons = {};
        }
        dom.ketchup.theme.set(null, list);
      }

      const tile = document.querySelector('#showcaseDemo');
      if (!tile) {
        createTile();
      }
    },

    downloadTheme() {
      const dom = document.documentElement;
      var dataStr =
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(
          JSON.stringify(dom.ketchup.theme.list['showcaseDemo'], null, 2)
        );
      var downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute('download', 'your_theme.json');
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    },

    deleteTheme() {
      const dom = document.documentElement;
      const list = { ...dom.ketchup.theme.list };
      const tile = document.querySelector('#showcaseDemo');
      const actions = document.querySelector('#theme-action-demo');
      actions.classList.remove('visible');
      tile.remove();
      delete list['showcaseDemo'];
      dom.ketchup.theme.set('ketchup', list);
    },

    refreshTheme() {
      const dom = document.documentElement;

      if (dom.ketchup.theme.name === 'showcaseDemo') {
        dom.ketchup.theme.refresh();
      } else {
        dom.ketchup.theme.set('showcaseDemo');
      }
      updateTile();
    },

    handleTab(e) {
      let i = e.detail.index;
      let tabBar = document.querySelector('#demo-tab-bar');
      let cssVariablesTab = document.querySelector('#css-variables-tab');
      let customStyleTab = document.querySelector('#customstyle-tab');
      let iconsTab = document.querySelector('#icons-tab');
      let jsonTab = document.querySelector('#json-tab');

      cssVariablesTab.setAttribute('style', 'display: none;');
      customStyleTab.setAttribute('style', 'display: none;');
      iconsTab.setAttribute('style', 'display: none;');
      jsonTab.setAttribute('style', 'display: none;');

      switch (tabBar.data[i].text) {
        case 'CSS variables':
          cssVariablesTab.setAttribute('style', '');
          break;
        case 'customStyles':
          customStyleTab.setAttribute('style', '');
          break;
        case 'Icons':
          iconsTab.setAttribute('style', '');
          break;
        case 'JSON':
          jsonTab.setAttribute('style', '');
          this.initTheme();
          this.jsonSet();
          break;
      }
    },

    jsonSet() {
      const dom = document.documentElement;
      const list = { ...dom.ketchup.theme.list };
      let jsonWarning = document.querySelector('#json-warning');
      let jsonTextarea = document.querySelector('#json-textarea');
      let codemirrorTextarea = document.querySelector('#json-tab .CodeMirror');
      let stringifiedJSON = JSON.stringify(list['showcaseDemo'], null, 2);
      if (jsonTextarea.value === stringifiedJSON) {
        return;
      } else {
        jsonTextarea.value = stringifiedJSON;
      }
      if (codemirrorTextarea) {
        codemirrorTextarea.remove();
      }
      CodeMirror.fromTextArea(jsonTextarea, {
        mode: { name: 'javascript', json: true },
        lineNumbers: true,
        lineWrapping: true,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      }).on('change', function (cm) {
        cm.save();
        try {
          let jsonifiedData = JSON.parse(jsonTextarea.value);
          list['showcaseDemo'] = jsonifiedData;
          dom.ketchup.theme.set('showcaseDemo', list);
          jsonWarning.classList.remove('visible');
        } catch (error) {
          jsonWarning.classList.add('visible');
        }
      });
    },
  },

  destroyed() {
    document.removeEventListener('kupThemeChange', initDemo);
  },

  mounted() {
    const dom = document.documentElement;
    let customStyleTab = document.querySelector('#customstyle-tab');
    let iconsTab = document.querySelector('#icons-tab');

    customStyleTab.setAttribute('style', 'display: none;');
    iconsTab.setAttribute('style', 'display: none;');

    if (dom.ketchup) {
      initDemo();
    }

    document.addEventListener('kupThemeChange', initDemo);
  },
};

function initDemo() {
  const dom = document.documentElement;
  const theme = dom.ketchup.theme.list[dom.ketchup.theme.name];
  const tile = document.querySelector('#showcaseDemo');

  if (tile) {
    updateTile();
  } else if (dom.ketchup.theme.list['showcaseDemo']) {
    createTile();
  }

  const fields = document.querySelectorAll(
    '#css-variables-tab kup-color-picker, #css-variables-tab kup-text-field, #customstyle-tab kup-color-picker, #customstyle-tab kup-text-field, #icons-tab kup-color-picker, #icons-tab kup-text-field'
  );
  for (let index = 0; index < fields.length; index++) {
    fields[index].setValue('');
  }

  let cssVariablesTab = document.querySelector('#css-variables-tab');
  for (let key in theme.cssVariables) {
    let variable = key.replace('--kup-', '');
    let field = cssVariablesTab.querySelector('#' + variable);
    try {
      field.setValue(theme.cssVariables[key]);
    } catch (error) {
      console.warn("Couldn't set field for variable '" + key + "'.");
    }
  }

  let customStyleTab = document.querySelector('#customstyle-tab');
  for (let key in theme.customStyles) {
    let field = customStyleTab.querySelector('#' + key.toLowerCase());
    try {
      field.setValue(theme.customStyles[key]);
    } catch (error) {
      console.warn("Couldn't set field for customStyle '" + key + "'.");
    }
  }

  let iconsTab = document.querySelector('#icons-tab');
  for (let key in theme.icons) {
    let variable = key.replace('--kup-', '');
    let field = iconsTab.querySelector('#' + variable);
    try {
      field.icon = theme.icons[key];
      field.setValue(theme.icons[key]);
    } catch (error) {
      console.warn("Couldn't set field for icon '" + key + "'.");
    }
  }
}

function createTile() {
  const themeContainer = document.querySelector('#theme-container-demo');
  let themeWrapper = document.createElement('div');
  let themeImage = document.createElement('kup-image');
  let themeText = document.createElement('div');
  themeWrapper.classList.add('icon-wrapper');
  themeWrapper.classList.add('theme-wrapper');
  themeWrapper.id = 'showcaseDemo';
  themeWrapper.onclick = function () {
    setDemoTheme();
  };
  themeWrapper.title = 'Toggle your theme';
  themeImage.sizeX = '70px';
  themeImage.sizeY = '70px';
  themeImage.resource = 'widgets';
  themeText.classList.add('icon-label');
  themeText.innerText = 'Your theme!';
  themeText.style.letterSpacing = '1.5px';
  themeWrapper.append(themeImage);
  themeWrapper.append(themeText);
  themeContainer.append(themeWrapper);
  updateTile();
}

function updateTile() {
  const dom = document.documentElement;
  var variables = dom.ketchup.theme.list['showcaseDemo'].cssVariables;
  let themeWrapper = document.querySelector('#showcaseDemo');
  let themeImage = document.querySelector('#showcaseDemo kup-image');
  let themeText = document.querySelector('#showcaseDemo .icon-label');
  if (variables) {
    themeWrapper.style.backgroundColor = variables['--kup-background-color'];
    themeWrapper.style.borderColor = variables['--kup-border-color'];
    themeImage.color = variables['--kup-primary-color'];
    themeText.style.color = variables['--kup-text-color'];
    themeText.style.fontFamily = variables['--kup-font-family'];
    themeText.style.fontSize = variables['--kup-font-size'];
  }
  const actions = document.querySelector('#theme-action-demo');
  actions.classList.add('visible');
}

function setDemoTheme() {
  const dom = document.documentElement;
  dom.ketchup.theme.set('showcaseDemo');
}
</script>
