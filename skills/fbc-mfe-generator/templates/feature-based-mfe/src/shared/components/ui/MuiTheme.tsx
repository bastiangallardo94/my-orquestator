import { createTheme } from "@mui/material/styles"; 

export const MuiTheme = createTheme({ 
   /* palette: {
        // Primary color - FBC Ice Blue 06 (main primary from UI Kit)
        primary: {
            main: '#0d9bd3', // fbc-ice-06 - UI Kit main primary color
            light: '#3dafdc', // fbc-ice-05
            dark: '#0c8dc0', // fbc-ice-07
            contrastText: '#ffffff',
        },
        // Secondary color - FBC Blue 06 (main secondary from UI Kit)
        secondary: {
            main: '#0c2941', // fbc-blue-06 - UI Kit PRIMARY BRAND COLOR
            light: '#3d5467', // fbc-blue-05
            dark: '#0b253b', // fbc-blue-07
            contrastText: '#ffffff',
        },
        // Error/Alert states - UI Kit semantic colors
        error: {
            main: '#721c24', // alert-secondary (dark red text)
            light: '#f7cac8', // alert-primary (light red background)
            dark: '#721c24',
            contrastText: '#ffffff',
        },
        // Warning states - UI Kit semantic colors
        warning: {
            main: '#856404', // warning-secondary (dark orange-brown)
            light: '#fcf5cb', // warning-primary (light yellow)
            dark: '#856404',
            contrastText: '#ffffff',
        },
        // Info states - UI Kit semantic colors
        info: {
            main: '#075574', // info-secondary (dark blue)
            light: '#b4e0f1', // info-primary (light blue)
            dark: '#075574',
            contrastText: '#ffffff',
        },
        // Success states - UI Kit semantic colors
        success: {
            main: '#186f07', // success-secondary (dark green)
            light: '#d7f0d9', // success-primary (light green)
            dark: '#186f07',
            contrastText: '#ffffff',
        },
        // Background colors - UI Kit neutrals
        background: {
            default: '#f9f9f9', // neutral-01
            paper: '#ffffff',
        },
        // Text colors - UI Kit neutrals
        text: {
            primary: '#333333', // neutral-10-base
            secondary: '#717171', // neutral-07
            disabled: '#a6a6a6', // neutral-05
        },
        // Divider color - UI Kit neutrals
        divider: '#dddddd', // neutral-03
    },*/
    typography: {
        fontFamily: 'Lato, sans-serif',
        fontSize: 16,
    },
    shape: {
        borderRadius: 4,
    },
    spacing: 8,
    components: {
        MuiTextField: { 
            styleOverrides: { 
                root: { 
                    minWidth: 200,
                    "& .MuiInputBase-root": {
                        minHeight: 56,
                        fontFamily: "Lato, sans-serif",
                    }, 
                    "& .MuiInputBase-input": { 
                        padding: "10px 14px",
                    },
                    "& .MuiInputLabel-root": { 
                        fontFamily: "Lato, sans-serif",
                        fontSize: "16px",
                        color: "#333333 !important", // neutral-10-base
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                        fontFamily: "Lato, sans-serif",
                        color: "#0d9bd3", // fbc-ice-06 primary
                    },
                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#0d9bd3 !important", // fbc-ice-06 primary
                    },
                }, 
            }, 
        },
        MuiButton: {
            styleOverrides: {
/*                root: {
                    fontFamily: 'Lato, sans-serif',
                    textTransform: 'none',
                    borderRadius: 4,
                },*/
                // Botones Contained (rellenos)
                containedPrimary: {
                    backgroundColor: '#05111b', // fbc-ice-06
                    color: '#ffffff', // Texto blanco
                    '&:hover': {
                        backgroundColor: '#0c2941', // fbc-ice-07
                    },
                },
                containedSecondary: {
                    backgroundColor: '#0c2941', // fbc-blue-06
                    color: '#ffffff', // Texto blanco
                    '&:hover': {
                        backgroundColor: '#0b253b', // fbc-blue-07
                    },
                },
                // Botones Outlined (con borde)
                outlinedPrimary: {
                    color: '#0c2941', // Texto color primario
                    borderColor: '#333', // Borde color primario
                    '&:hover': {
                        backgroundColor: '#f1f1f1', // Fondo ligero al hover
                        borderColor: '#333', // Borde más oscuro
                    },
                },
                outlinedSecondary: {
                    color: '#0c2941', // Texto color secundario
                    borderColor: '#0c2941', // Borde color secundario
                    '&:hover': {
                        backgroundColor: 'rgba(12, 41, 65, 0.04)', // Fondo ligero al hover
                        borderColor: '#0b253b', // Borde más oscuro
                    },
                },
                // Botones Text (sin fondo ni borde)
                textPrimary: {
					color: '#0c2941',// Texto color primario
					'&:hover': {
						backgroundColor: '#f1f1f1',
						borderColor: '#333',
					},
                },
                textSecondary: {
                    color: '#0c2941', // Texto color secundario
                    '&:hover': {
                        backgroundColor: 'rgba(12, 41, 65, 0.04)', // Fondo ligero al hover
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#0c2941', // fbc-blue-06 PRIMARY BRAND COLOR
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: '#0d9bd3', // fbc-ice-06 primary
                    '&:hover': {
                        color: '#0c8dc0', // fbc-ice-07
                    },
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                standardError: {
                    backgroundColor: '#f7cac8', // alert-primary
                    color: '#721c24', // alert-secondary
                },
                standardWarning: {
                    backgroundColor: '#fcf5cb', // warning-primary
                    color: '#856404', // warning-secondary
                },
                standardInfo: {
                    backgroundColor: '#b4e0f1', // info-primary
                    color: '#075574', // info-secondary
                },
                standardSuccess: {
                    backgroundColor: '#d7f0d9', // success-primary
                    color: '#186f07', // success-secondary
                },
            },
        },
        MuiChip: {
            styleOverrides: {
/*                // Personalización del chip principal
                root: {
                    fontFamily: 'Lato, sans-serif',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                },*/
                // Chip variant filled (relleno) - Colores personalizados
                filled: {
                    '&.MuiChip-colorPrimary': {
                        backgroundColor: '#0c2941', // fbc-ice-06
                        color: '#fff',
                    },
                    '&.MuiChip-colorError': {
                        backgroundColor: '#f7cac8', // alert-secondary
                        color: '#721c24',
                    },
                    '&.MuiChip-colorWarning': {
                        backgroundColor: '#fcf5cb', // warning-secondary
                        color: '#856404',
                    },
                    '&.MuiChip-colorInfo': {
                        backgroundColor: '#b4e0f1', // info-secondary
                        color: '#075574',
                    },
                    '&.MuiChip-colorSuccess': {
                        backgroundColor: '#d7f0d9', // success-secondary
                        color: '#186f07',
                    },
                },
/*                // Personalización del ícono de borrar
                deleteIcon: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                        color: 'rgba(255, 255, 255, 0.9)',
                    },
                },*/
            },
        },
    },
});
