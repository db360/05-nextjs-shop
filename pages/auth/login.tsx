import { useContext, useState } from "react";
import {useRouter} from "next/router";
import NextLink from "next/link";
import { useForm } from "react-hook-form";

import { Box, Button, Chip, Grid, Link, TextField, Typography } from "@mui/material";

import { AuthContext } from "../../context";
import { AuthLayout } from "../../components/layout";
import { validations } from "../../utils";
import { ErrorOutline } from "@mui/icons-material";

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {

  const router = useRouter();
  const { loginUser } = useContext(AuthContext);

  const { register, handleSubmit, formState: { errors }, } = useForm<FormData>();
  const [showError, setshowError] = useState(false);


  const onLoginUser = async({email, password}: FormData) => {

    setshowError(false);
    const isValidLogin = await loginUser(email, password);

    if(!isValidLogin) {
      setshowError(true);
      setTimeout(() => {setshowError(false) }, 3500);
      return;
    }

    const destination = router.query.p?.toString() || '/';
    router.replace(destination);
  }

  return (
    <AuthLayout title={"Ingresar"}>
      <form onSubmit={ handleSubmit(onLoginUser) } noValidate>
        <Box sx={{ width: 350, padding: "10px 20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Iniciar Sesión
              </Typography>
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
                type='email'
                label="Correo"
                variant="filled"
                fullWidth
                {...register('email', {
                    required: 'Campo requerido',
                    validate: validations.isEmail
                })}
                error={ !!errors.email }
                helperText={ errors.email?.message }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register('password', {
                    required: 'El Password es Obligatorio',
                    minLength: { value: 6, message: 'Mínimo 6 Carácteres'}
                })}
                error={ !!errors.password }
                helperText={ errors.password?.message }
                label="Contraseña"
                type="password"
                variant="filled"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type='submit'
                color="secondary"
                className="circular-btn"
                size="large"
                fullWidth
              >
                Login
              </Button>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="end">
              <NextLink
                href={router.query.p ? `/auth/register?p=${router.query.p}` : '/auth/register' }
                passHref
              >
                <Link underline="always">¿No tiene cuenta aun?</Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
