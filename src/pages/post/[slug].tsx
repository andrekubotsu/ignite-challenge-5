import { GetStaticPaths, GetStaticProps } from 'next';

import Prismic from '@prismicio/client';
// import util from 'util';

import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

import Header from '../../components/Header';

interface Post {
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

  return (
    <div className={commonStyles.wrapper}>
      <Header />
      <main className={styles.post}>
        <img src={data.banner.url} alt="" />
        <h1>{data.title}</h1>
        <div>
          <time>
            <FiCalendar /> {first_publication_date}
          </time>
          <span className={styles.author}>
            <FiUser />
            {data.author}
          </span>
          <span className={styles.estimated}>
            <FiClock />4 min.
          </span>
        </div>
        <section>{RichText.asHtml(data.content)}</section>
      </main>
    </div>
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
    fallback: false,
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
    },
  };

  // console.log(
  //   util.inspect(response, { showHidden: true, depth: null, colors: true })
  // );

  return {
    props: postProps,
  };
};
