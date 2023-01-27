import endPoints from '@services/api';
import useFetch from '@hooks/useFetch';
import { Chart } from '@common/Chart';
import Head from 'next/head';
import { useAuth } from '@hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const PRODUCT_LIMIT = 60;
const PRODUCT_OFFSET = 60;

export default function Dashboard() {
  const router = useRouter();

  const { user } = useAuth();

  useEffect(() => {
    if (!user?.name) {
      router.push('/');
    }
  }, [user]);

  const products = useFetch(endPoints.products.getProducts(PRODUCT_LIMIT, PRODUCT_OFFSET));

  const categoryNames = products?.map((product) => product.category);
  const categoryCount = categoryNames?.map((category) => category.name);

  const countOccurrences = (arr) => arr.reduce((prev, curr) => ((prev[curr] = ++prev[curr] || 1), prev), {});

  const data = {
    datasets: [
      {
        label: 'Categories',
        data: countOccurrences(categoryCount),
        borderWidth: 2,
        backgroundColor: ['#ffbb11', '#c0c0c0', '#50AF95', 'f3ba2f', '#2a71d0'],
      },
    ],
  };

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Chart className="mb-8 mt-2" chartData={data} />
    </>
  );
}
