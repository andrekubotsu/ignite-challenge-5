import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import Prismic from '@prismicio/client';
// import util from 'util';

import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

import Header from '../../components/Header';
import { formatDate } from '../../utils/dateFormat';

interface Post {
  uid: string;
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const { first_publication_date, data } = post;
  const router = useRouter();

  // to work with fallback in getStaticPaths, this is a fallback page version
  if (router.isFallback) {
    return (
      <>
        <Header />
        <div className={commonStyles.wrapper}>
          <main className={styles.post}>
            <h1>Carregando...</h1>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.banner}>
        <img src={data.banner.url} alt="" />
      </div>
      <div className={commonStyles.wrapper}>
        <main className={styles.post}>
          <h1>{data.title}</h1>
          <div>
            <time>
              <FiCalendar /> {formatDate(first_publication_date)}
            </time>
            <span className={styles.author}>
              <FiUser />
              {data.author}
            </span>
            <span className={styles.estimated}>
              <FiClock /> 4 min
            </span>
          </div>

          {data.content.map(content => {
            return (
              <section key={content.heading}>
                <h2>{content.heading}</h2>
                <div
                  className={styles.postContent}
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(content.body),
                  }}
                />
              </section>
            );
          })}
        </main>
        )
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts')
  );

  const paths = posts.results.map(post => ({
    params: {
      slug: post.uid,
    },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const prismic = getPrismicClient();
  const { slug } = context.params;

  const response = await prismic.getByUID('posts', slug as string, {});

  const postProps: PostProps = {
    post: {
      first_publication_date: response.first_publication_date,
      data: response.data,
      uid: response.uid,
    },
  };

  // console.log(
  //   util.inspect(response, { showHidden: true, depth: null, colors: true })
  // );

  return {
    props: postProps,
  };
};
