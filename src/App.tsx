import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { AboutPage } from '@/pages/AboutPage';
import { ArticlePage } from '@/pages/ArticlePage';
import { ContributePage } from '@/pages/ContributePage';
import { CulturePage } from '@/pages/CulturePage';
import { FashionPage } from '@/pages/FashionPage';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { OpinionPage } from '@/pages/OpinionPage';
import { ProductPage } from '@/pages/ProductPage';
import { SearchPage } from '@/pages/SearchPage';
import { StoriesPage } from '@/pages/StoriesPage';
import { StorePage } from '@/pages/StorePage';
import { AdminPage } from '@/pages/AdminPage';
function App() {
  return <BrowserRouter><Routes>
    <Route path="/admin" element={<AdminPage />} />
    <Route element={<Layout />}>
      <Route index element={<HomePage />} /><Route path="stories" element={<StoriesPage />} />
      <Route path="opinion" element={<OpinionPage />} /><Route path="culture" element={<CulturePage />} />
      <Route path="fashion" element={<FashionPage />} /><Route path="store" element={<StorePage />} />
      <Route path="store/:slug" element={<ProductPage />} /><Route path="article/:slug" element={<ArticlePage />} />
      <Route path="contribute" element={<ContributePage />} /><Route path="about" element={<AboutPage />} />
      <Route path="search" element={<SearchPage />} /><Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes></BrowserRouter>;
}
export default App;
