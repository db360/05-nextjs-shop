import { useState } from 'react';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { Box, Button, Chip, Grid, Link, TextField, Typography } from "@mui/material";

import { AuthLayout } from "../../components/layout";
import { shopApi } from '../../api';
import { validations } from '../../utils';
import { ErrorOutline } from '@mui/icons-material';

type FormData = {
    name: string;
    email: string;
    password: string;
  };

const RegisterPage = ({name, email, password}:FormData) => {

    const { register, handleSubmit, formState: { errors }, } = useForm<FormData>();
    const [showError, setshowError] = useState(false);



    const onRegisterForm = async({name, email, password}: FormData) => {

        setshowError(false);

    try {
      const { data } = await shopApi.post('/user/register', { name, email, password });
      const { token, user } = data;
      console.log({token, user});

    } catch (error) {
      console.log('Error al Crear Cuenta');
      setshowError(true);
      setTimeout(() => {setshowError(false) }, 3500);
    }
    }

  return (
    <AuthLayout title={"Nueva Cuenta"} >
        <form onSubmit={ handleSubmit(onRegisterForm)} noValidate>
            <Box sx={{width: 350, padding: '10px 20px'}}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h1" component="h1">Formulario de Registro</Typography>
                        <Chip
                            label="El Usuario o Contraseña no Existe"
                            color="error"
                            icon={ <ErrorOutline />}
                            className='fadeIn'
                            sx={{display: showError ? 'flex' : 'none'}}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Nombre Completo"
                            variant="filled"
                            fullWidth
                            {...register('name', {
                                required: 'Campo requerido',
                                minLength: { value: 2, message: 'Mínimo 2 Carácteres'}
                            })}
                            error={ !!errors.name }
                            helperText={ errors.name?.message }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField {
                            ...register('email', {
                                    required: 'Campo requerido',
                                    validate: validations.isEmail
                })}         label="Correo"
                            type='email'
                            variant="filled"
                            fullWidth
                            error={ !!errors.email }
                            helperText={ errors.email?.message }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Contraseña"
                            type="password"
                            variant="filled"
                            fullWidth
                            {...register('password', {
                                required: 'El Password es Obligatorio',
                                minLength: { value: 6, message: 'Mínimo 6 Carácteres'}
                            })}
                            error={ !!errors.password }
                            helperText={ errors.password?.message }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type='submit' color="secondary" className="circular-btn" size="large" fullWidth>Registrar Cuenta</Button>
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
        </form>
    </AuthLayout>
  )
}

export default RegisterPage