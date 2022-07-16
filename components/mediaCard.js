import { useRouter } from 'next/router';

import styles from '../styles/mediaCard.module.scss';

function MediaCard({movieData}){
  const router = useRouter();
  return(
    <div className={styles.cardContainer} style={{ backgroundImage: `url(${movieData.Poster})` }} onClick={() => router.push({
      pathname: '/play',
      query: { data: JSON.stringify(movieData)}
    })}>
      <img src="/icons/play-96-light.png" className={styles.playIcon} width="96px" height="96px" ></img>
      <div className={styles.infoCard}>
        <p className={styles.movieTitle}>{movieData.Title}</p>
        <p className={styles.movieYear}>{movieData.Year}</p>
        <div className={styles.movieInfo}>
          <b>Director: </b>{movieData.Director}
          <br></br>
          <b>Actors: </b>{movieData.Actors}
        </div>
      </div>
    </div> 
  )
}

export default MediaCard;
