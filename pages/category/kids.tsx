import { Typography } from "@mui/material"
import { ShopLayout } from "../../components/layout"
import { ProductList } from "../../components/products"
import { FullScreenLoading } from "../../components/ui"
import { useProducts } from "../../hooks"

const KidsPage = () => {

const {products, isLoading} = useProducts('/products?gender=kid');


  return (
    <ShopLayout title="Kids Products" pageDescription="Products for Kids category">
        <Typography variant="h1" component='h1'>Kids Products</Typography>
        <Typography variant="h2" sx={{marginBottom: 1}}>Productos para Niños</Typography>

        {
            isLoading
            ? <FullScreenLoading />
            : <ProductList products={ products }/>
        }
    </ShopLayout>
  )
}

export default KidsPage