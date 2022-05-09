import { Typography } from "@mui/material"
import { ShopLayout } from "../../components/layout"
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { useProducts } from "../../hooks";

const MenPage = () => {

    const {products, isLoading} = useProducts('/products?gender=men');


  return (
    <ShopLayout title="Men Products" pageDescription="Products for men category">
        <Typography variant="h1" component='h1'>Men Products</Typography>
        <Typography variant="h2" sx={{marginBottom: 1}}>Productos para Hombre</Typography>

        {
            isLoading
            ? <FullScreenLoading />
            : <ProductList products={ products }/>
        }

    </ShopLayout>
  )
}

export default MenPage