// app(front)\search\page.tsx
import ProductItem from '@/components/products/ProductItem';
import productServices from '@/lib/services/productService';
import Link from 'next/link';

const sortOrders = [
  { name: 'Najnowsze', value: 'newest' },
  { name: 'Najniższa cena', value: 'lowest' },
  { name: 'Najwyższa cena', value: 'highest' },
];

const prices = [
  { name: 'od $1 do $50', value: '1-50' },
  { name: 'od $51 do $200', value: '51-200' },
  { name: 'od $201 do $1000', value: '201-1000' },
];

const ratings = [5, 4, 3, 2, 1];

export async function generateMetadata({
  searchParams: { q = 'all', category = 'all', price = 'all' },
}: {
  searchParams: {
    q: string;
    category: string;
    price: string;
    sort: string;
    page: string;
  };
}) {
  if ((q !== 'all' && q !== '') || category !== 'all' || price !== 'all') {
    return {
      title: `Wyszukaj ${q !== 'all' ? q : ''} ${category !== 'all' ? `: Kategoria ${category}` : ''} ${price !== 'all' ? `: Cena ${price}` : ''}`,
    };
  } else {
    return {
      title: 'Wyszukaj Produkty',
    };
  }
}

export default async function SearchPage({
  searchParams: { q = 'all', category = 'all', price = 'all', sort = 'newest', page = '1' },
}: {
  searchParams: {
    q: string;
    category: string;
    price: string;
    sort: string;
    page: string;
  };
}) {
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, sort, page };
    if (c) params.category = c;
    if (p) params.price = p;
    if (pg) params.page = pg;
    if (s) params.sort = s;
    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const categories = await productServices.getCategories();
  const { countProducts, products, pages } = await productServices.getByQuery({
    category,
    q,
    price,
    page,
    sort,
  });

  const createPagination = () => {
    const currentPage = Number(page);
    const maxPagesToShow = 5;
    let pagination = [];

    if (pages <= maxPagesToShow) {
      pagination = Array.from({ length: pages }, (_, i) => i + 1);
    } else {
      const startPages = Array.from({ length: 2 }, (_, i) => i + 1);
      const endPages = Array.from({ length: 2 }, (_, i) => pages - 1 + i);
      const middlePages = Array.from({ length: 3 }, (_, i) => currentPage - 1 + i).filter(p => p > 1 && p < pages);

      pagination = [...new Set([...startPages, ...middlePages, ...endPages])];

      if (startPages[1] + 1 < middlePages[0]) {
        startPages.push('...');
      }
      if (middlePages[middlePages.length - 1] + 1 < endPages[0]) {
        middlePages.push('...');
      }
    }
    return pagination;
  };

  const pagination = createPagination();

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div>
        <div className="text-xl pt-3 font-bold">Kategorie</div>
        <div>
          <ul>
            <li>
              <Link className={`link link-hover ${'all' === category && 'link-primary'}`} href={getFilterUrl({ c: 'all' })}>
                Wszystkie
              </Link>
            </li>
            {categories.map((c: string) => (
              <li key={c}>
                <Link className={`link link-hover ${c === category && 'link-primary'}`} href={getFilterUrl({ c })}>
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xl pt-3 font-bold">Cena</div>
          <ul>
            <li>
              <Link className={`link link-hover ${'all' === price && 'link-primary'}`} href={getFilterUrl({ p: 'all' })}>
                Wszystkie
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p.value}>
                <Link href={getFilterUrl({ p: p.value })} className={`link link-hover ${p.value === price && 'link-primary'}`}>
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/*
        <div>
          <div className="text-xl pt-3">Opinie Klientów</div>
          <ul>
            <li>
              <Link href={getFilterUrl({ r: 'all' })} className={`link link-hover ${'all' === rating && 'link-primary'}`}>
                Wszystkie
              </Link>
            </li>
            {ratings.map((r) => (
              <li key={r}>
                <Link href={getFilterUrl({ r: `${r}` })} className={`link link-hover ${r === rating && 'link-primary'}`}>
                  <Rating caption={' & up'} value={r}></Rating>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        */}
      </div>
      <div className="md:col-span-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <span className="font-bold">{products.length === 0 ? 'Brak' : countProducts} Wyników</span>
            {q !== 'all' && q !== '' && ' : ' + q}
            {category !== 'all' && ' : ' + category}
            {price !== 'all' && ' : Cena ' + price}

            {(q !== 'all' && q !== '') || category !== 'all' || price !== 'all' ? (
              <Link className="btn btn-sm btn-ghost" href="/search">
                Wyczyść
              </Link>
            ) : null}
          </div>
          <div>
            <span className="font-bold">Sortuj według</span>{' '}
            {sortOrders.map((s) => (
              <Link
                key={s.value}
                className={`mx-2 link link-hover ${sort == s.value ? 'link-primary' : ''}`}
                href={getFilterUrl({ s: s.value })}
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {products.map((product) => (
              <ProductItem key={product.slug} product={product} />
            ))}
          </div>
          <div className="join mb-4">
            {products.length > 0 &&
              pagination.map((p, index) =>
                typeof p === 'number' ? (
                  <Link
                    key={index}
                    className={`join-item btn ${Number(page) === p ? 'btn-active' : ''}`}
                    href={getFilterUrl({ pg: `${p}` })}
                  >
                    {p}
                  </Link>
                ) : (
                  <span key={index} className="join-item btn-disabled">
                    ...
                  </span>
                )
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
