import { Box, CircularProgress, Typography } from "@mui/material"

export const FullScreenLoading = () => {
  return (
    <Box
        gap={2}
        display="flex"
        flexDirection={"column"}
        justifyContent="center"
        alignItems="center"
        height="70vh"
        sx={{flexDirection: {xs: 'column', sm:'row'}}}
        >
            <Typography variant="h2" component="h2" fontWeight={200} fontSize={ 20 }>Cargando...</Typography>
            <CircularProgress thickness={3}/>
    </Box>
  )
}
