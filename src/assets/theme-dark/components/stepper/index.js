// Material Dashboard 2 PRO React base styles
import colors from "assets/theme-dark/base/colors";
import borders from "assets/theme-dark/base/borders";
import boxShadows from "assets/theme-dark/base/boxShadows"; // Material Dashboard 2 PRO React helper functions
import pxToRem from "assets/theme-dark/functions/pxToRem";
import linearGradient from "assets/theme-dark/functions/linearGradient";

const {transparent, gradients} = colors;
const {borderRadius} = borders;
const {colored} = boxShadows;
export default {
    styleOverrides: {
        root: {
            background: linearGradient(gradients.info.main, gradients.info.state),
            padding: `${pxToRem(24)} 0 ${pxToRem(16)}`,
            borderRadius: borderRadius.lg,
            boxShadow: colored.info,
            "&.MuiPaper-root": {
                backgroundColor: transparent.main,
            },
        },
    },
};
