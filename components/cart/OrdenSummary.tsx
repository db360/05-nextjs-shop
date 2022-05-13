import { Grid, Typography } from "@mui/material"
import { useContext } from "react"
import { CartContext } from "../../context"
import { currency } from "../../utils"

export const OrdenSummary = () => {

    const {numberOfItems, subTotal, total, tax} = useContext(CartContext)

  return (
    <Grid container>
        <Grid item xs={6}>
            <Typography>Nº Productos:</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>{numberOfItems} {numberOfItems > 1 ? 'productos' : 'producto'}</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography>Subtotal:</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>{currency.format(subTotal)}</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography>I.V.A ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%):</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>{currency.format(tax)}</Typography>
        </Grid>
        <Grid item xs={6} sx={{mt: 2}}>
            <Typography variant='subtitle1'>Total (I.V.A Incluido):</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end' sx={{mt: 2}}>
            <Typography variant='subtitle1'>{currency.format(total)}</Typography>
        </Grid>
    </Grid>
  )
}
