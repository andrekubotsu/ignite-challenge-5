import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import Prismic from '@prismicio/client';
import { FiUser, FiCalendar } from 'react-icons/fi';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

// IMPORTANT!: remember that there is no need to absolute paths in Images
// it automatically points to /public/

export default function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>Home | spacetravelling.</title>
      </Head>
      <div className={styles.wrapper}>
        <header>
          <Image src="/imgs/logo.svg" alt="logo" width="239" height="27" />
        </header>
        <main>
          <article>
            <h1>Como utilizar hooks</h1>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div>
              <time>
                <FiCalendar /> 15 Mar 2021
              </time>
              <span className={styles.author}>
                <FiUser />
                Joseph Oliveira
              </span>
            </div>
          </article>

          <article>
            <h1>Como utilizar hooks</h1>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div>
              <time>
                <FiCalendar /> 15 Mar 2021
              </time>
              <span className={styles.author}>
                <FiUser />
                Joseph Oliveira
              </span>
            </div>
          </article>

          <article>
            <h1>Como utilizar hooks</h1>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div>
              <time>
                <FiCalendar /> 15 Mar 2021
              </time>
              <span className={styles.author}>
                <FiUser />
                Joseph Oliveira
              </span>
            </div>
          </article>

          <a className={styles.loadPosts}>Carregar mais posts</a>
        </main>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts')
  );

  return {
    props: {
      postsResponse,
    },
  };
};
