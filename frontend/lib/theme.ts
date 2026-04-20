export const baseColors = {
  primary: "#004a99",
  secondary: "#111827",
  white: "#ffffff",
  black: "#111111",
};

export const lightTheme = {
  mode: "light",
  base: {
    ...baseColors,
  },
  primary: {
    10: "#e6f0ff",
    25: "#b3d1ff",
    50: "#4da3ff",
    75: "#0066cc",
    100: "#004a99",
    foreground: "#ffffff",
    rgb: "0, 74, 153",
  },
  secondary: {
    10: "#f2f4f7",
    25: "#d0d5db",
    50: "#6b7280",
    75: "#374151",
    100: "#111827",
    foreground: "#ffffff",
    rgb: "17, 24, 39",
  },
  text: {
    primary: "#111111",
  },
  button: {
    primary: {
      base: {
        bg: "primary.100",
        text: "#ffffff",
        hover: {
          bg: "primary.75",
          text: "#ffffff",
        },
      },
      inverted: {
        bg: "#ffffff",
        text: "primary.100",
        hover: {
          bg: "primary.75",
          text: "#ffffff",
        },
      },
      disabled: {
        bg: "primary.25",
        text: "secondary.25",
        hover: {
          bg: "primary.75",
          text: "secondary.100",
        },
      },
    },
    secondary: {
      base: {
        bg: "primary.100",
        text: "primary.100",
        hover: {
          bg: "primary.75",
          text: "#ffffff",
        },
      },
      inverted: {
        bg: "#ffffff",
        text: "#ffffff",
        hover: {
          bg: "primary.75",
          text: "#ffffff",
        },
      },
      disabled: {
        bg: "primary.25",
        text: "secondary.25",
        hover: {
          bg: "primary.75",
          text: "secondary.100",
        },
      },
    },
    blurred: {
      base: {
        bg: "primary.100",
        text: "#ffffff",
        hover: {
          bg: "primary.75",
          text: "#ffffff",
        },
      },
      inverted: {
        bg: "#ffffff",
        text: "primary.100",
        hover: {
          bg: "primary.100",
          text: "#ffffff",
        },
      },
      disabled: {
        bg: "primary.25",
        text: "secondary.25",
        hover: {
          bg: "primary.75",
          text: "secondary.100",
        },
      },
    },
  },
  announcement: {
    background: "primary.100",
    text: "#ffffff",
    link: "primary.10",
  },
  navigation: {
    transparent: {
      links: "#111827",
      linksHover: "#004a99",
    },
  },
  background: "#ffffff",
  backgroundRgb: "255, 255, 255",
  foreground: "#ffffff",
  foregroundRgb: "255, 255, 255",
  border: "#d1d5db",
  heading: "#111111",
  link: {
    base: "#004a99",
    hover: "#004a99",
    inverted: "secondary.100",
  },
  error: "#b91c1c",
  success: "#1e7e34",
  warning: "#d97706",
  status: {
    online: "#1e7e34",
    offline: "#6b7280",
    busy: "#b91c1c",
  },
  states: {
    info: {
      bg: "#004a99",
      text: "#ffffff",
    },
    success: {
      bg: "#1e7e34",
      text: "#ffffff",
    },
    error: {
      bg: "#b91c1c",
      text: "#ffffff",
    },
    warning: {
      bg: "#b97706",
      text: "#ffffff",
    },
  },
  tabBackground: "#f2f4f7",
  carousel: {
    button: {
      background: "secondary.25",
      text: "secondary.100",
    },
  },
};

export const darkTheme = {
  mode: "dark",
  base: {
    ...baseColors,
  },
  primary: {
    10: "#1a2b47",
    25: "#274572",
    50: "#336199",
    75: "#3d7ad1",
    100: "#4da3ff",
    foreground: "#111111",
    rgb: "77, 163, 255",
  },
  secondary: {
    10: "#1f2937",
    25: "#374151",
    50: "#6b7280",
    75: "#9ca3af",
    100: "#d1d5db",
    foreground: "#111111",
    rgb: "209, 213, 219",
  },
  text: {
    primary: "#f9fafb",
  },
  button: {
    primary: {
      base: {
        bg: "primary.100",
        text: "#ffffff",
        hover: {
          bg: "primary.75",
          text: "#ffffff",
        },
      },
      inverted: {
        bg: "#ffffff",
        text: "secondary.10",
        hover: {
          bg: "primary.75",
          text: "#ffffff",
        },
      },
      disabled: {
        bg: "primary.25",
        text: "secondary.25",
        hover: {
          bg: "primary.75",
          text: "secondary.100",
        },
      },
    },
    secondary: {
      base: {
        bg: "primary.100",
        text: "primary.100",
        hover: {
          bg: "primary.75",
          text: "#ffffff",
        },
      },
      inverted: {
        bg: "#ffffff",
        text: "#ffffff",
        hover: {
          bg: "primary.75",
          text: "#ffffff",
        },
      },
      disabled: {
        bg: "primary.25",
        text: "secondary.25",
        hover: {
          bg: "primary.75",
          text: "secondary.100",
        },
      },
    },
    blurred: {
      base: {
        bg: "primary.100",
        text: "#ffffff",
        hover: {
          bg: "primary.75",
          text: "#ffffff",
        },
      },
      inverted: {
        bg: "#ffffff",
        text: "secondary.10",
        hover: {
          bg: "primary.100",
          text: "#ffffff",
        },
      },
      disabled: {
        bg: "primary.25",
        text: "secondary.25",
        hover: {
          bg: "primary.75",
          text: "secondary.100",
        },
      },
    },
  },
  announcement: {
    background: "primary.25",
    text: "text.primary",
    link: "primary.100",
  },
  navigation: {
    transparent: {
      links: "#f9fafb",
      linksHover: "#4da3ff",
    },
  },
  background: "#111827",
  backgroundRgb: "17, 24, 39",
  foreground: "#ffffff",
  foregroundRgb: "255, 255, 255",
  border: "#374151",
  heading: "#f9fafb",
  link: {
    base: "#4da3ff",
    hover: "#4da3ff",
    inverted: "secondary.100",
  },
  error: "#f87171",
  success: "#4ade80",
  warning: "#facc15",
  status: {
    online: "#1e7e34",
    offline: "#6b7280",
    busy: "#b91c1c",
  },
  states: {
    info: {
      bg: "#4da3ff",
      text: "#111111",
    },
    success: {
      bg: "#4ade80",
      text: "#111111",
    },
    error: {
      bg: "#f87171",
      text: "#111111",
    },
    warning: {
      bg: "#facc15",
      text: "#111111",
    },
  },
  tabBackground: "#1f2937",
  carousel: {
    button: "secondary.100",
    text: "secondary.25",
  },
};
