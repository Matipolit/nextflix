import Head from 'next/head'
import MediaCard from '../components/mediaCard'

import styles from '../styles/home.module.scss'

import { refreshAndGetDB } from '../lib/media'

export default function Home({db}) {
  return (
    <div>
      <Head>
        <title>NextFlix</title>
      </Head>
      <div className={styles.movieGrid}>
        {db.movies.map((data) => (
            <MediaCard movieData={data} key={data.filePath}/> 
        ))}
      </div>
    </div>
   )
}

export async function getStaticProps() { 
  const db = await refreshAndGetDB();
  console.log(db);
  return {
    props: {
      db,
    },
  }
}
