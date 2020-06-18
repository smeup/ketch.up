const themes = JSON.parse(`{
    "dark": {
        "cssVariables": {
            "--kup-background-color": "#2d2d2d",
            "--kup-header-background-color": "#2d2d2d",
            "--kup-drawer-background-color": "#1f1f1f",
            "--kup-main-color": "#82f0e2",
            "--kup-display-mode": "block",
            "--kup-font-family": "Lato, sans-serif",
            "--kup-font-size": "14px",
            "--kup-text-on-main-color": "#555555",
            "--kup-text-color": "#f5f5f5",
            "--kup-icon-color": "#e0e0e0",
            "--kup-hover-background-color": "#3c3c3c",
            "--kup-hover-color": "#dddddd",
            "--kup-border-color": "#535353",
            "--kup-disabled-text-color": "#7e7e7e",
            "--kup-disabled-background-color": "#3c3c3c",
            "--kup-field-background-color": "#2a2a2a",
            "--kup-chip-background-color": "#222222",
            "--kup-spinner-color": "#f2e114",
            "--kup-title-background-color": "#111111"
        },
        "customStyles": {
            "KUP-BUTTON": "#kup-component { box-shadow: 0 0 0 purple; animation: pulse 2s infinite; border-radius: 4px; } #kup-component:hover { animation: none; } #kup-component button { background-color: purple; } @-webkit-keyframes pulse { 0% { -webkit-box-shadow: 0 0 0 0 purple; } 70% { -webkit-box-shadow: 0 0 5px 5px transparent; } 100% { -webkit-box-shadow: 0 0 0 0 transparent; }}@keyframes pulse { 0% { -moz-box-shadow: 0 0 0 0 purple; box-shadow: 0 0 0 0 purple; }  70% { -moz-box-shadow: 0 0 5px 5px transparent; box-shadow: 0 0 5px 5px transparent; }  100% { -moz-box-shadow: 0 0 0 0 transparent; box-shadow: 0 0 0 0 transparent; }}"
        }
    },
    "default": {
        "cssVariables": {
            "--kup-background-color": "#ffffff",
            "--kup-header-background-color": "#2e2e2e",
            "--kup-drawer-background-color": "#ffffff",
            "--kup-main-color": "#d64325",
            "--kup-display-mode": "block",
            "--kup-font-family": "Roboto, sans-serif",
            "--kup-font-size": "14px",
            "--kup-text-on-main-color": "#ffffff",
            "--kup-text-color": "#2e2e2e",
            "--kup-icon-color": "#505050",
            "--kup-hover-background-color": "#f0f0f0",
            "--kup-hover-color": "#545454",
            "--kup-border-color": "#e0e0e0",
            "--kup-disabled-text-color": "#5c5c5c",
            "--kup-disabled-background-color": "#eaeaea",
            "--kup-field-background-color": "#fafafa",
            "--kup-chip-background-color": "#eaeaea",
            "--kup-spinner-color": "#eaa710",
            "--kup-title-background-color": "#f1f3f4"
        }
    },
    "graphite": {
        "cssVariables": {
            "--kup-background-color": "#ffffff",
            "--kup-header-background-color": "#535353",
            "--kup-drawer-background-color": "#ffffff",
            "--kup-main-color": "#888888",
            "--kup-display-mode": "block",
            "--kup-font-family": "Roboto, sans-serif",
            "--kup-font-size": "13px",
            "--kup-text-on-main-color": "#ffffff",
            "--kup-text-color": "#545454",
            "--kup-icon-color": "#808080",
            "--kup-hover-background-color": "#f0f0f0",
            "--kup-hover-color": "#545454",
            "--kup-border-color": "#e0e0e0",
            "--kup-disabled-text-color": "#5c5c5c",
            "--kup-disabled-background-color": "#eaeaea",
            "--kup-field-background-color": "#fafafa",
            "--kup-chip-background-color": "#eaeaea",
            "--kup-spinner-color": "#eaa710",
            "--kup-title-background-color": "#f0f0f0"
        }
    },
    "ocean": {
        "cssVariables": {
            "--kup-background-color": "#e9f1ff",
            "--kup-header-background-color": "#001d3e",
            "--kup-drawer-background-color": "#e6f1ff",
            "--kup-main-color": "#0081c5",
            "--kup-display-mode": "block",
            "--kup-font-family": "Lato, sans-serif",
            "--kup-font-size": "16px",
            "--kup-text-on-main-color": "#ffffff",
            "--kup-text-color": "#1b1b1b",
            "--kup-icon-color": "#505050",
            "--kup-hover-background-color": "#cfe8ff",
            "--kup-hover-color": "#545454",
            "--kup-border-color": "#e0e0e0",
            "--kup-disabled-text-color": "#5c5c5c",
            "--kup-disabled-background-color": "#eaeaea",
            "--kup-field-background-color": "#dce9ff",
            "--kup-chip-background-color": "#eaeaea",
            "--kup-spinner-color": "#eaa710",
            "--kup-title-background-color": "#f1f3f4"
        }
    },
    "wildlife": {
        "cssVariables": {
            "--kup-background-color": "#f7fff6",
            "--kup-header-background-color": "#095a1f",
            "--kup-drawer-background-color": "#dbfbd5",
            "--kup-main-color": "#0fa918",
            "--kup-display-mode": "block",
            "--kup-font-family": "Roboto, sans-serif",
            "--kup-font-size": "16px",
            "--kup-text-on-main-color": "#ffffff",
            "--kup-text-color": "#000000",
            "--kup-icon-color": "#333333",
            "--kup-hover-background-color": "#63ab46",
            "--kup-hover-color": "#ffffff",
            "--kup-border-color": "#e0e0e0",
            "--kup-disabled-text-color": "#5c5c5c",
            "--kup-disabled-background-color": "#eaeaea",
            "--kup-field-background-color": "transparent",
            "--kup-chip-background-color": "#eaeaea",
            "--kup-spinner-color": "#eaa710",
            "--kup-title-background-color": "#f1f3f4"
        }
    }
}`);
