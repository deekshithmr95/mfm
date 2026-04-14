import ProductDetail from './ProductDetail';

// Required for static export: pre-generate a placeholder shell page.
// At runtime, Firebase rewrites serve this shell for all /products/* URLs,
// and the client-side useParams() reads the real ID from the browser URL.
export function generateStaticParams() {
  return [{ id: '0' }];
}

export default function ProductDetailPage() {
  return <ProductDetail />;
}
