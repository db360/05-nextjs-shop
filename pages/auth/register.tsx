import NextLink from 'next/link';
import { Box, Button, Grid, Link, TextField, Typography } from "@mui/material";
import { AuthLayout } from "../../components/layout";

const LoginPage = () => {
  return (
    <AuthLayout title={"Nueva Cuenta"} >
        <Box sx={{width: 350, padding: '10px 20px'}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h1" component="h1">Formulario de Registro</Typography>
                </Grid>

                <Grid item xs={12}>
                    <TextField label="Nombre Completo" variant="filled" fullWidth/>
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Correo" variant="filled" fullWidth/>
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Contraseña" type="password" variant="filled" fullWidth/>
                </Grid>
                <Grid item xs={12}>
                    <Button color="secondary" className="circular-btn" size="large" fullWidth>Registrar Cuenta</Button>
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="end">
                    <NextLink href='/auth/login' passHref>
                        <Link underline="always">
                        ¿Ya tiene una Cuenta?
                        </Link>
                    </NextLink>
                </Grid>
            </Grid>
        </Box>
    </AuthLayout>
  )
}

export default LoginPage