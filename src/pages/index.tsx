import { GetStaticProps } from 'next';
import Head from 'next/head';

import Prismic from '@prismicio/client';
import { FiUser, FiCalendar } from 'react-icons/fi';
import Header from '../components/Header';
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

export default function Home(props: HomeProps): JSX.Element {
  const { postsPagination } = props;
  const results = [...postsPagination.results];
  const nextPageLink = postsPagination.next_page;
  const hasLoadMore = true;

  async function loadMorePosts(nextPage): Promise<void> {
    let moreResults;

    const response = await fetch(nextPage);
    try {
      if (response.status === 200) {
        moreResults = await response.json();
      }
    } catch (error) {
      throw new Error(error.message);
    }

    return console.log(moreResults.results);
  }

  return (
    <>
      <Head>
        <title>Home | spacetravelling.</title>
      </Head>
      <div className={styles.wrapper}>
        <Header />
        <main>
          {results.map(post => {
            return (
              <article key={post.uid}>
                <h1>{post.data.title}</h1>
                <p>{post.data.subtitle}</p>
                <div>
                  <time>
                    <FiCalendar /> {post.first_publication_date}
                  </time>
                  <span className={styles.author}>
                    <FiUser />
                    {post.data.author}
                  </span>
                </div>
              </article>
            );
          })}

          {hasLoadMore ? (
            <button
              type="button"
              className={styles.loadPosts}
              onClick={() => loadMorePosts(nextPageLink)}
            >
              Carregar mais posts
            </button>
          ) : (
            ''
          )}
        </main>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts'),
    { pageSize: 3 }
  );

  const homeProps: HomeProps = {
    postsPagination: {
      next_page: postsResponse.next_page,
      results: postsResponse.results,
    },
  };

  return {
    props: homeProps,
  };
};
