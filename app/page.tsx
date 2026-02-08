import Products from '@/components/Products'

const HomeRouter = async() => {
  let products = { data: [], total: 0 };
  try {
    const productRes = await fetch(`${process.env.SERVER}/api/product`);
    if (productRes.ok) {
      products = await productRes.json();
    } else {
      console.error('Failed to fetch products:', productRes.statusText);
    }
  } catch (error) {
    console.error('An error occurred while fetching products:', error);
  }
  return <Products data={products}/>
}

export default HomeRouter
