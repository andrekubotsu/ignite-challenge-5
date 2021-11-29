import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import Prismic from '@prismicio/client';
import { FiUser, FiCalendar } from 'react-icons/fi';
import { useState } from 'react';
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
  const loadMessage = 'Carregar mais posts';

  const results = [...postsPagination.results];
  let nextPageLink = postsPagination.next_page;

  const [morePosts, setMorePosts] = useState(results);
  const [hasLoadMore, setHasLoadMore] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(loadMessage);

  async function loadMorePosts(nextPage): Promise<void> {
    let moreResults;

    try {
      const response = await fetch(nextPage);
      if (response.status === 200) {
        setLoadingMessage('Carregando...');

        moreResults = await response.json();

        if (moreResults.next_page === null) {
          setHasLoadMore(false);
        } else {
          setLoadingMessage(loadMessage);
          nextPageLink = moreResults.next_page;
        }
      }
    } catch (error) {
      throw new Error(error.message);
    }
    return setMorePosts([...morePosts, ...moreResults.results]);
  }

  return (
    <>
      <Head>
        <title>Home | spacetravelling.</title>
      </Head>
      <div className={commonStyles.wrapper}>
        <Header />
        <main className={styles.posts}>
          {morePosts.map(post => {
            return (
              <article key={post.uid}>
                <h1>
                  <Link href={`/post/${post.uid}`}>
                    <a>{post.data.title}</a>
                  </Link>
                </h1>

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
              {loadingMessage}
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
