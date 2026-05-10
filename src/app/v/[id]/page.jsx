import React from 'react';
import { IoWarningOutline } from 'react-icons/io5';
import { FaRegBookmark } from 'react-icons/fa';
import { BsShare } from 'react-icons/bs';
import { MdOutlinePhotoLibrary, MdInfoOutline } from 'react-icons/md';
import { IoIosArrowBack } from 'react-icons/io';
import db from '@/lib/db';

export default async function ProductDetailsPage({ params }) {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);

    if (!product) {
        return <div style={{ textAlign: 'center', padding: '100px' }}>آگهی یافت نشد!</div>;
    }

    const categoryRecord = db.prepare('SELECT name FROM categories WHERE id = ?').get(product.categoryId);
    const category = categoryRecord ? categoryRecord.name : 'دسته‌بندی نامشخص';
    
    const cityRecord = db.prepare('SELECT name FROM cities WHERE id = ?').get(product.cityId);
    const city = cityRecord ? cityRecord.name : 'شهر نامشخص';

    const priceDisplay = product.price
        ? new Intl.NumberFormat('fa-IR').format(product.price) + ' تومان'
        : 'توافقی';

    return (
        <div className="details-container">
            <div className="details-breadcrumb">
                همه آگهی‌ها &gt; {category} &gt; {product.title}
            </div>

            <div className="details-grid">
                {/* Right Info Section */}
                <div className="details-info">
                    <h1 className="details-title">{product.title}</h1>
                    <div className="details-time">{product.time} در {city}</div>

                    <div className="warning-box">
                        <div className="warning-box-content">
                            <IoWarningOutline size={22} color="var(--text-muted)" />
                            <div>
                                <div style={{ fontWeight: 600 }}>زنگ خطرهای قبل از معامله</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                    پیش از انجام معامله و هرگونه پرداخت وجه از صحت کالا اطمینان حاصل کنید.
                                </div>
                            </div>
                        </div>
                        <IoIosArrowBack className="warning-chevron" size={18} />
                    </div>

                    <div className="actions-row">
                        <button className="btn-primary">اطلاعات تماس</button>
                        <button className="btn-outline">چت</button>
                        <button className="icon-action-btn" title="نشان کردن"><FaRegBookmark /></button>
                        <button className="icon-action-btn" title="اشتراک‌گذاری"><BsShare /></button>
                    </div>

                    <div className="info-rows" style={{ borderTop: '1px solid var(--border-color)' }}>
                        <div className="info-row">
                            <span className="info-label">زنانه/مردانه</span>
                            <span className="info-value red-text">زنانه</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">وضعیت</span>
                            <span className="info-value">{product.condition || 'نو'}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">نوع لباس</span>
                            <span className="info-value red-text">لباس مجلسی</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">قیمت</span>
                            <span className="info-value">{priceDisplay}</span>
                        </div>
                    </div>

                    <div className="desc-section">
                        <h3 className="desc-title">توضیحات</h3>
                        <p className="desc-content">{product.description}</p>
                        <div className="tag-badge">مشخصات</div>
                    </div>
                </div>

                {/* Left Image Section */}
                <div className="details-image-section">
                    <div className="main-image-container">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="main-image"
                        />
                        <div className="photo-count-badge">
                            <MdOutlinePhotoLibrary size={18} />
                            <span>۱</span>
                        </div>
                    </div>

                    <div className="thumbnail-strip">
                        <div className="thumbnail-item active">
                            <img src={product.image} alt="thumb-main" />
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <textarea
                            className="note-input-box"
                            placeholder="یادداشت شما..."
                            rows="3"
                        ></textarea>
                        <div className="note-hint">یادداشت تنها برای شما قابل دیدن است و پس از حذف آگهی، پاک خواهد شد.</div>
                    </div>

                    <div className="report-section">
                        <span>گزارش آگهی</span>
                        <MdInfoOutline size={20} />
                    </div>
                </div>
            </div>
        </div>
    );
}
