import React from 'react';
import { Chip, Stack, Box, Typography, Avatar } from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * Ejemplos de uso de MUI Chip con colores personalizados
 * 
 * Los colores están configurados en src/shared/components/ui/MuiTheme.tsx
 */
export const ChipExamples = () => {
    const handleClick = () => {
        console.info('Chip clicked');
    };

    const handleDelete = () => {
        console.info('Delete icon clicked');
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Ejemplos de Chip con colores personalizados
            </Typography>

            {/* Chips Filled (rellenos) con diferentes colores */}
            <Typography variant="h6" gutterBottom mt={3}>
                Chips Filled (Rellenos)
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                <Chip label="Default" />
                <Chip label="Primary" color="primary" />
                <Chip label="Secondary" color="secondary" />
                <Chip label="Error" color="error" />
                <Chip label="Warning" color="warning" />
                <Chip label="Info" color="info" />
                <Chip label="Success" color="success" />
            </Stack>

            {/* Chips Outlined (con borde) con diferentes colores */}
            <Typography variant="h6" gutterBottom mt={4}>
                Chips Outlined (Con borde)
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                <Chip label="Default" variant="outlined" />
                <Chip label="Primary" color="primary" variant="outlined" />
                <Chip label="Secondary" color="secondary" variant="outlined" />
                <Chip label="Error" color="error" variant="outlined" />
                <Chip label="Warning" color="warning" variant="outlined" />
                <Chip label="Info" color="info" variant="outlined" />
                <Chip label="Success" color="success" variant="outlined" />
            </Stack>

            {/* Chips clickeables */}
            <Typography variant="h6" gutterBottom mt={4}>
                Chips Clickeables
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                <Chip label="Clickable" color="primary" onClick={handleClick} />
                <Chip label="Clickable" color="secondary" onClick={handleClick} />
                <Chip label="Clickable Outlined" color="error" variant="outlined" onClick={handleClick} />
            </Stack>

            {/* Chips eliminables */}
            <Typography variant="h6" gutterBottom mt={4}>
                Chips Eliminables
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                <Chip label="Deletable" color="primary" onDelete={handleDelete} />
                <Chip label="Deletable" color="error" onDelete={handleDelete} />
                <Chip label="Deletable Outlined" color="success" variant="outlined" onDelete={handleDelete} />
            </Stack>

            {/* Chips clickeables y eliminables */}
            <Typography variant="h6" gutterBottom mt={4}>
                Chips Clickeables y Eliminables
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                <Chip 
                    label="Clickable Deletable" 
                    color="primary" 
                    onClick={handleClick} 
                    onDelete={handleDelete} 
                />
                <Chip 
                    label="Clickable Deletable" 
                    color="secondary" 
                    variant="outlined"
                    onClick={handleClick} 
                    onDelete={handleDelete} 
                />
            </Stack>

            {/* Chips con íconos */}
            <Typography variant="h6" gutterBottom mt={4}>
                Chips con Íconos
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                <Chip icon={<FaceIcon />} label="With Icon" color="primary" />
                <Chip icon={<FaceIcon />} label="With Icon" color="success" variant="outlined" />
                <Chip 
                    icon={<DoneIcon />} 
                    label="Completed" 
                    color="success" 
                    onDelete={handleDelete} 
                />
            </Stack>

            {/* Chips con avatares */}
            <Typography variant="h6" gutterBottom mt={4}>
                Chips con Avatares
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                <Chip avatar={<Avatar>M</Avatar>} label="Avatar" color="primary" />
                <Chip avatar={<Avatar>J</Avatar>} label="Avatar" color="secondary" variant="outlined" />
                <Chip 
                    avatar={<Avatar alt="User" src="/static/images/avatar/1.jpg" />} 
                    label="Avatar" 
                    color="info"
                    onDelete={handleDelete} 
                />
            </Stack>

            {/* Chips con ícono de borrar personalizado */}
            <Typography variant="h6" gutterBottom mt={4}>
                Chips con Ícono de Borrar Personalizado
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                <Chip 
                    label="Custom delete icon" 
                    color="primary"
                    onDelete={handleDelete} 
                    deleteIcon={<DoneIcon />} 
                />
                <Chip 
                    label="Custom delete icon" 
                    color="error"
                    variant="outlined"
                    onDelete={handleDelete} 
                    deleteIcon={<DeleteIcon />} 
                />
            </Stack>

            {/* Chips de diferentes tamaños */}
            <Typography variant="h6" gutterBottom mt={4}>
                Chips de Diferentes Tamaños
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} alignItems="center">
                <Chip label="Small" color="primary" size="small" />
                <Chip label="Medium (Default)" color="primary" />
                <Chip label="Small Outlined" color="secondary" size="small" variant="outlined" />
                <Chip label="Medium Outlined" color="secondary" variant="outlined" />
            </Stack>

            {/* Chips como enlaces clickeables */}
            <Typography variant="h6" gutterBottom mt={4}>
                Chips como Enlaces
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                <Chip 
                    label="Clickable Link" 
                    color="primary"
                    component="a" 
                    href="#chips" 
                    clickable 
                />
                <Chip 
                    label="Clickable Link" 
                    color="info"
                    component="a" 
                    href="#chips" 
                    variant="outlined"
                    clickable 
                />
            </Stack>

            {/* Chips deshabilitados */}
            <Typography variant="h6" gutterBottom mt={4}>
                Chips Deshabilitados
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                <Chip label="Disabled" color="primary" disabled />
                <Chip label="Disabled" color="secondary" disabled onClick={handleClick} />
                <Chip label="Disabled Outlined" color="error" variant="outlined" disabled />
            </Stack>

            {/* Personalización adicional con sx prop */}
            <Typography variant="h6" gutterBottom mt={4}>
                Chips con Estilos Personalizados (sx prop)
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                <Chip 
                    label="Custom Size" 
                    color="primary"
                    sx={{
                        fontSize: '1rem',
                        height: '40px',
                        '& .MuiChip-label': {
                            padding: '0 20px',
                        }
                    }}
                />
                <Chip 
                    label="Custom Border" 
                    color="secondary"
                    variant="outlined"
                    sx={{
                        borderWidth: '2px',
                        borderStyle: 'dashed',
                        '&:hover': {
                            borderWidth: '2px',
                        }
                    }}
                />
                <Chip 
                    label="Custom Colors" 
                    sx={{
                        backgroundColor: '#FF6B6B',
                        color: '#ffffff',
                        '&:hover': {
                            backgroundColor: '#EE5A52',
                        }
                    }}
                    onDelete={handleDelete}
                />
            </Stack>

            {/* Chips multilínea */}
            <Typography variant="h6" gutterBottom mt={4}>
                Chip Multilínea
            </Typography>
            <Chip
                color="primary"
                sx={{
                    height: 'auto',
                    '& .MuiChip-label': {
                        display: 'block',
                        whiteSpace: 'normal',
                    },
                }}
                label="This is a chip that has multiple lines of text to demonstrate multiline functionality."
            />

            {/* Ejemplo de uso práctico: Tags */}
            <Typography variant="h6" gutterBottom mt={4}>
                Ejemplo Práctico: Sistema de Tags
            </Typography>
            <Box>
                <Typography variant="body2" gutterBottom>
                    Categorías del proyecto:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} mt={1}>
                    <Chip label="React" color="info" size="small" />
                    <Chip label="TypeScript" color="primary" size="small" />
                    <Chip label="Material-UI" color="secondary" size="small" />
                    <Chip label="Frontend" color="success" size="small" />
                </Stack>
            </Box>

            {/* Ejemplo de uso práctico: Estados */}
            <Typography variant="h6" gutterBottom mt={4}>
                Ejemplo Práctico: Estados de Tareas
            </Typography>
            <Stack direction="column" spacing={2}>
                <Box>
                    <Chip label="Pending" color="warning" icon={<FaceIcon />} />
                    <Typography variant="caption" display="block" mt={0.5}>
                        Tarea pendiente de revisión
                    </Typography>
                </Box>
                <Box>
                    <Chip label="In Progress" color="info" icon={<FaceIcon />} />
                    <Typography variant="caption" display="block" mt={0.5}>
                        Tarea en progreso
                    </Typography>
                </Box>
                <Box>
                    <Chip label="Completed" color="success" icon={<DoneIcon />} />
                    <Typography variant="caption" display="block" mt={0.5}>
                        Tarea completada
                    </Typography>
                </Box>
                <Box>
                    <Chip label="Rejected" color="error" icon={<DeleteIcon />} />
                    <Typography variant="caption" display="block" mt={0.5}>
                        Tarea rechazada
                    </Typography>
                </Box>
            </Stack>
        </Box>
    );
};

export default ChipExamples;
