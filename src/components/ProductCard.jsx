import Link from 'next/link';
import { MdPhotoCamera } from 'react-icons/md';

export default function ProductCard({ product }) {
    const priceDisplay = product.price
        ? new Intl.NumberFormat('fa-IR').format(product.price) + ' تومان'
        : 'توافقی';

    // In a real app, city info would come from the API/Product object
    // For now, if cityId is present, we could fetch it or just display a placeholder if not in object
    const city = product.cityName || 'سنندج'; 

    return (
        <Link href={`/v/${product.id}`} className="product-card">
            <div className="product-image-wrapper">
                <img
                    src={product.image}
                    alt={product.title}
                    className="product-image"
                />
                {product.imageCount > 0 && (
                    <div className="product-badge">
                        <MdPhotoCamera size={16} />
                        <span>{product.imageCount}</span>
                    </div>
                )}
            </div>
            <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <div className="product-meta">
                    <span>{product.time}</span>
                    <span className="dot"></span>
                    <span>در {city}</span>
                </div>
                <div className="product-price">{priceDisplay}</div>
            </div>
        </Link>
    );
}
