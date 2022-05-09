import { Typography } from "@mui/material"
import { ShopLayout } from "../../components/layout"
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { useProducts } from "../../hooks";

const WomenPage = () => {

    const {products, isLoading} = useProducts('/products?gender=women');


  return (
    <ShopLayout title="Women Products" pageDescription="Products for Women category">
        <Typography variant="h1" component='h1'>Women Products</Typography>
        <Typography variant="h2" sx={{marginBottom: 1}}>Productos para Mujer</Typography>

        {
            isLoading
            ? <FullScreenLoading />
            : <ProductList products={ products }/>
        }

    </ShopLayout>
  )
}

export default WomenPage