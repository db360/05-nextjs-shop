import { Grid, Typography } from "@mui/material"

export const OrdenSummary = () => {
  return (
    <Grid container>
        <Grid item xs={6}>
            <Typography>Nº Productos:</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>3</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography>Subtotal:</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>119.5 €</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography>I.V.A (21%):</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>31.5 €</Typography>
        </Grid>
        <Grid item xs={6} sx={{mt: 2}}>
            <Typography variant='subtitle1'>Total (I.V.A Incluido):</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end' sx={{mt: 2}}>
            <Typography variant='subtitle1'>151 €</Typography>
        </Grid>
    </Grid>
  )
}
