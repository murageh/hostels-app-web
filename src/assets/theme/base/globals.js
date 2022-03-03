// Material Dashboard 2 PRO React Base Styles
import colors from "assets/theme/base/colors";

const {info, dark, primary, warning} = colors;
export default {
    html: {
        scrollBehavior: "smooth",
    },
    "*, *::before, *::after": {
        margin: 0,
        padding: 0,
    },
    "a, a:link, a:visited": {
        textDecoration: "none !important",
    },
    "a.link, .link, a.link:link, .link:link, a.link:visited, .link:visited": {
        color: `${dark.main} !important`,
        transition: "color 150ms ease-in !important",
    },
    "a.link:hover, .link:hover, a.link:focus, .link:focus": {
        color: `${info.main} !important`,
    },
    ".my20, .preview.my20": {
        maxWidth: "45%",
        maxHeight: "200px",
        margin: "4px auto",
    },
    /* Works on Firefox */
    "*": {
        scrollbarWidth: "thin !important",
        scrollbarColor: `${warning.main} !important`,
    },
    /* Works on Chrome, Edge, and Safari */
    "*::-webkit-scrollbar": {
        width: "10px",
    },
    "*::-webkit-scrollbar-track": {
        borderRadius: ".75rem",
        backgroundClip: "padding-box",
        border: "3px solid transparent",
    },
    "*::-webkit-scrollbar-thumb": {
        backgroundColor: `${warning.main} !important`,
        backgroundClip: "padding-box",
        border: "0px solid transparent",
        borderRadius: ".75rem",
    },
};
