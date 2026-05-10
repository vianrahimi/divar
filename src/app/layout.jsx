import '../index.css';
import '../App.css';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export const metadata = {
  title: 'دیوار',
  description: 'خرید و فروش اینترنتی',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <div className="app-container">
          <Header />
          <main className="main-content">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
